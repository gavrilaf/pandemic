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

interface Infected {
    c: Coordinate
    days: number
    state: State
}

function makeInfected(c: Coordinate): Infected {
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
        incubationLength: 6,
        diseaseLength: 6,
        mortalityProbability: 0.05,
        diseaseProbabilities: new Map([
            [State.healthy, 0.13],
            [State.cured, 0.01]
        ]),
        quarantineStart: 50,
        quarantineFactor: 0.65,
        hospitalsCapacity: 50,
        hospitalFactor: 0.3
    }

    public step: number = 0
    public world: State[][] = []

    public stat = {
        total: 0,
        healthy: 0,
        carries: 0,
        ill: 0,
        infected: 0,
        hospitalized: 0,
        cured: 0,
        dead: 0,
        day: {
            infected: 0,
            dead: 0
        }
    }

    private infected: Infected[] = []

    public constructor(width: number, height: number) {
        this.height = height
        this.width = width

        this.reset()
    }

    public reset(): void {
        this.world = []
        this.infected = []

        for (let i = 0; i < this.height; ++i) {
            this.world[i] = []
            for (let j = 0; j < this.width; ++j) {
                this.world[i][j] = State.healthy
            }
        }

        this.infected.push(makeInfected(new Coordinate(Math.round(this.height/2), Math.round(this.width/2))));

        this.infected.forEach((s) => {
            this.world[s.c.x][s.c.y] = s.state
        })

        this.stat.total = this.height * this.width
        this.stat.hospitalized = 0

        this.step = 0

        this.updateStat()
    }

    public update(): void {
        let newInfected: Coordinate[] = []

        for (let s of this.infected) {
            let factor = 1
            if (s.state == State.hospitalized) {
                factor = this.config.hospitalFactor
            }

            if (this.infectCell(s.c.top, factor)) {
                newInfected.push(s.c.top)
            }

            if (this.infectCell(s.c.bottom, factor)) {
                newInfected.push(s.c.bottom)
            }

            if (this.infectCell(s.c.left, factor)) {
                newInfected.push(s.c.left)
            }

            if (this.infectCell(s.c.right, factor)) {
                newInfected.push(s.c.right)
            }
        }

        this.stat.day = {infected: 0, dead: 0};

        for (let s of this.infected) {
            s.days += 1

            if (s.days == this.config.incubationLength) {
                s.state = State.ill
                if (this.stat.hospitalized < this.config.hospitalsCapacity) {
                    s.state = State.hospitalized
                    this.stat.hospitalized += 1
                }
            }

            let isLastDiseaseDay = (s.days >= this.config.diseaseLength + this.config.incubationLength);
            if (isLastDiseaseDay) {
                let mortalityProbability = this.config.mortalityProbability
                let mortalityFactor = 1

                if (s.state == State.hospitalized) {
                    mortalityFactor = this.config.hospitalFactor
                    this.stat.hospitalized -= 1
                }

                if (checkEventWithProbability(mortalityProbability, mortalityFactor)) {
                    s.state = State.dead
                    this.stat.day.dead += 1
                } else {
                    s.state = State.cured
                }
            }
        }

        this.infected.forEach((s) => {
            this.world[s.c.x][s.c.y] = s.state
        })

        this.infected = this.infected.filter((s) => {
            return s.state == State.ill || s.state == State.carrier || s.state == State.hospitalized
        })

        this.stat.day.infected = newInfected.length
        for (let c of newInfected) {
            this.infected.push(makeInfected(c))
        }

        this.step += 1

        if (this.step == this.config.quarantineStart) {
            this.config.diseaseProbabilities.set(State.healthy, this.config.diseaseProbabilities.get(State.healthy)! * this.config.quarantineFactor);
            this.config.diseaseProbabilities.set(State.cured, this.config.diseaseProbabilities.get(State.cured)! * this.config.quarantineFactor);
        }

        this.updateStat()
    }

    public get isEligibleForContinue(): boolean {
        return this.stat.ill > 0 || this.stat.carries > 0 || this.stat.hospitalized > 0
    }

    private updateStat(): void {
        this.stat.healthy = 0
        this.stat.carries = 0
        this.stat.ill = 0
        this.stat.cured = 0
        this.stat.dead = 0

        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                switch (this.world[i][j]) {
                    case State.healthy:
                        this.stat.healthy +=1
                        break
                    case State.carrier:
                        this.stat.carries += 1
                        break
                    case State.ill:
                    case State.hospitalized:
                        this.stat.ill += 1
                        break
                    case State.cured:
                        this.stat.cured += 1
                        break
                    case State.dead:
                        this.stat.dead += 1
                        break
                }
            }
        }

        this.stat.infected = this.stat.ill + this.stat.carries
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
