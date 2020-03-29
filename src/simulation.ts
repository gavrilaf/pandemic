export enum State {
    healthy,
    ill,
    carrier,
    cured,
    dead,
    hospitalized
}

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
        diseaseLength: 4,
        mortalityProbability: 0.05,
        diseaseProbabilities: new Map([
            [State.healthy, 0.14],
            [State.cured, 0.01]
        ]),
        quarantineStart: 50,
        quarantineFactor: 0.75,
        hospitalsCapacity: 5,
        hospitalFactor: 0.5
    }

    public step: number
    public world: State[][]

    public statistics = {
        totalCount: 0,
        healthyCount: 0,
        carriesCount: 0,
        illCount: 0,
        curedCount: 0,
        deadCount: 0
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

        this.statistics.totalCount = this.height * this.width
        this.step = 0

        this.updateStat()
    }

    update() {
        let infected: Coordinate[] = []

        for (let s of this.sufferers) {
            if (this.infectCell(s.c.top)) {
                infected.push(s.c.top)
            }

            if (this.infectCell(s.c.bottom)) {
                infected.push(s.c.bottom)
            }

            if (this.infectCell(s.c.left)) {
                infected.push(s.c.left)
            }

            if (this.infectCell(s.c.right)) {
                infected.push(s.c.right)
            }
        }

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
                if (s.state == State.hospitalized) {
                    mortalityProbability *= this.config.hospitalFactor
                    this.hospitalized -= 1
                }

                if (Math.random() <= mortalityProbability) {
                    s.state = State.dead
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
        return this.statistics.illCount > 0 || this.statistics.carriesCount > 0 || this.hospitalized > 0
    }

    private updateStat() {
        this.statistics.healthyCount = 0
        this.statistics.carriesCount = 0
        this.statistics.illCount = 0
        this.statistics.curedCount = 0
        this.statistics.deadCount = 0

        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                switch (this.world[i][j]) {
                    case State.healthy:
                        this.statistics.healthyCount +=1
                        break
                    case State.carrier:
                        this.statistics.carriesCount += 1
                        break
                    case State.ill, State.hospitalized:
                        this.statistics.illCount += 1
                        break
                    case State.cured:
                        this.statistics.curedCount += 1
                        break
                    case State.dead:
                        this.statistics.deadCount += 1
                        break
                }
            }
        }
    }

    private infectCell(c: Coordinate): boolean {
        if (c.x < 0 || c.y < 0 || c.x >= this.width || c.y >= this.height) {
            return false
        }

        let probability = this.config.diseaseProbabilities.get(this.world[c.x][c.y])
        if (probability != undefined) {
            if (Math.random() <= probability) {
                this.world[c.x][c.y] = State.carrier
                return true
            }
        }
        return false
    }
}
