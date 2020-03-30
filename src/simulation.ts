export enum State {
    healthy,
    ill,
    carrier,
    cured,
    dead,
    hospitalized
}

type optNumber = number | undefined

class Coordinate {
    constructor(public x: number, public y: number) {
    }

    get top(): Coordinate {
        return new Coordinate(this.x, this.y - 1);
    }

    get bottom(): Coordinate {
        return new Coordinate(this.x, this.y + 1);
    }

    get left(): Coordinate {
        return new Coordinate(this.x - 1, this.y);
    }

    get right(): Coordinate {
        return new Coordinate(this.x + 1, this.y);
    }
}

interface Sufferer {
    c: Coordinate
    days: number
    state: State
}

function newSufferer(c: Coordinate): Sufferer {
    return {
        c: c,
        days: 1,
        state: State.carrier
    }
}

export class Simulation {

    public readonly  width: number
    public readonly  height: number

    public config = {
        incubationLength: 5,
        diseaseLength: 5,
        mortalityProbability: 0.02,
        diseaseProbabilities: new Map([
            [State.healthy, 0.12],
            [State.cured, 0.01]
        ]),
        quarantineStart: 50,
        quarantineFactor: 0.75,
        hospitalsCapacity: 10,
        hospitalFactor: 0.3
    }

    public step: number
    public world: State[][]

    public statistics = {
        total: 0,
        healthy: 0,
        carries: 0,
        ill: 0,
        infected: 0,
        cured: 0,
        dead: 0,
        day: {
            infected: 0,
            dead: 0
        }
    }

    private hospitalized: number
    private sufferers: Sufferer[]

    constructor(width: number, height: number) {
        this.height = height
        this.width = width

        this.reset()
    }

    reset() {
        this.world = []
        this.sufferers = []

        this.hospitalized = 0

        for (let i = 0; i < this.height; ++i) {
            this.world[i] = []
            for (let j = 0; j < this.width; ++j) {
                this.world[i][j] = State.healthy
            }
        }

        this.world[Math.round(this.height/2)][Math.round(this.width/2)] = State.carrier
        this.sufferers.push(newSufferer(new Coordinate(Math.round(this.height/2), Math.round(this.width/2))));

        this.statistics.total = this.height * this.width
        this.step = 0

        this.updateStat()
    }

    update() {
        let infected: Coordinate[] = []

        for (let s of this.sufferers) {
            let factor = 1
            if (s.state == State.hospitalized) {
                factor = this.config.hospitalFactor
            }

            if (this.infectCell(s.c.top, factor)) {
                infected.push(s.c.top)
            }

            if (this.infectCell(s.c.bottom, factor)) {
                infected.push(s.c.bottom)
            }

            if (this.infectCell(s.c.left, factor)) {
                infected.push(s.c.left)
            }

            if (this.infectCell(s.c.right, factor)) {
                infected.push(s.c.right)
            }
        }

        this.statistics.day = {infected: 0, dead: 0};

        for (let s of this.sufferers) {
            s.days += 1

            if (s.days == this.config.incubationLength) {
                s.state = State.ill
                if (this.hospitalized < this.config.hospitalsCapacity) {
                    s.state = State.hospitalized
                    this.hospitalized += 1
                }
            }

            let isLastDiseaseDay = (s.days == this.config.diseaseLength + this.config.incubationLength);
            let isIll = s.state == State.ill || s.state == State.hospitalized;

            if (isIll && isLastDiseaseDay) {
                let mortalityProbability = this.config.mortalityProbability
                let mortalityFactor = 1

                if (s.state == State.hospitalized) {
                    mortalityFactor = this.config.hospitalFactor
                    this.hospitalized -= 1
                }

                if (checkEventWithProbability(mortalityProbability, mortalityFactor)) {
                    s.state = State.dead
                    this.statistics.day.dead += 1
                } else {
                    s.state = State.cured
                }
            }
        }

        this.sufferers.forEach((s) => {
            this.world[s.c.x][s.c.y] = s.state
        })

        this.sufferers = this.sufferers.filter((s) => {
            return s.state == State.ill || s.state == State.carrier || s.state == State.hospitalized
        })

        this.statistics.day.infected = infected.length
        for (let c of infected) {
            this.sufferers.push(newSufferer(c))
        }

        this.step += 1

        if (this.step == this.config.quarantineStart) {
            this.config.diseaseProbabilities.set(State.healthy, this.config.diseaseProbabilities.get(State.healthy) * this.config.quarantineFactor);
            this.config.diseaseProbabilities.set(State.cured, this.config.diseaseProbabilities.get(State.cured) * this.config.quarantineFactor);
        }

        this.updateStat()
    }

    get isEligibleForContinue(): boolean {
        return this.statistics.ill > 0 || this.statistics.carries > 0 || this.hospitalized > 0
    }

    private updateStat() {
        this.statistics.healthy = 0
        this.statistics.carries = 0
        this.statistics.ill = 0
        this.statistics.cured = 0
        this.statistics.dead = 0

        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                switch (this.world[i][j]) {
                    case State.healthy:
                        this.statistics.healthy +=1
                        break
                    case State.carrier:
                        this.statistics.carries += 1
                        break
                    case State.ill:
                    case State.hospitalized:
                        this.statistics.ill += 1
                        break
                    case State.cured:
                        this.statistics.cured += 1
                        break
                    case State.dead:
                        this.statistics.dead += 1
                        break
                }
            }
        }

        this.statistics.infected = this.statistics.ill + this.statistics.carries
    }

    private infectCell(c: Coordinate, factor: number): boolean {
        if (c.x < 0 || c.y < 0 || c.x >= this.width || c.y >= this.height) {
            return false
        }

        let probability = this.config.diseaseProbabilities.get(this.world[c.x][c.y])
        if (checkEventWithProbability(probability, factor)) {
            this.world[c.x][c.y] = State.carrier
            return true
        }

        return false
    }
}

function checkEventWithProbability(p: optNumber, f: number): boolean {
    if (typeof p == "undefined") {
        return false
    }

    let r = Math.random();
    let pf = p * f
    if (r < pf) {
        return true
    }
    return false
}
