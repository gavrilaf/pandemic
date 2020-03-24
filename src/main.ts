
const cellSize = 10

enum State {
    healthy,
    ill,
    carrier,
    cured,
    dead,
    hospitalized
}

const colors = new Map([
    [State.healthy, "gray"],
    [State.ill, "red"],
    [State.carrier, "yellow"],
    [State.cured, "green"],
    [State.dead, "black"],
    [State.hospitalized, "blue"]
])

interface Sufferer {
    x: number
    y: number
    days: number
    state: State
}

function makeSufferer(x: number, y: number): Sufferer {
    return {
        x: x,
        y: y,
        days: 1,
        state: State.carrier
    }
}

class Simulation {

    public config = {
        incubationLength: 4,
        diseaseLength: 4,
        fatalityProbability: 0.05,
        diseaseProbabilities: new Map([
            [State.healthy, 0.13],
            [State.cured, 0.01]
        ]),
        quarantineStart: 20,
        quarantineFactor: 0.9,
        hospitalsCapacity: 25,
        hospitalFactor: 0.6
    }

    public readonly  width: number
    public readonly  height: number

    public step: number
    public world: State[][]

    public totalCount: number
    public healthyCount: number
    public carriesCount: number
    public illCount: number
    public curedCount: number
    public deadCount: number

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
        this.sufferers.push(makeSufferer(Math.round(this.height/2), Math.round(this.width/2)));

        this.totalCount = this.height * this.width
        this.step = 0

        this.updateStat()
    }

    update() {
        let affected: [number, number][] = []

        for (let s of this.sufferers) {
            if (this.infectCell(s.x, s.y - 1)) {
                affected.push([s.x, s.y - 1])
            }

            if (this.infectCell(s.x, s.y + 1)) {
                affected.push([s.x, s.y + 1])
            }

            if (this.infectCell(s.x - 1, s.y)) {
                affected.push([s.x - 1, s.y])
            }

            if (this.infectCell(s.x + 1, s.y)) {
                affected.push([s.x + 1, s.y])
            }
        }

        this.sufferers = this.sufferers.map((s) => {
            s.days += 1

            if (s.days == this.config.incubationLength) {
                s.state = State.ill
                if (this.hospitalized < this.config.hospitalsCapacity) {
                    s.state = State.hospitalized
                    this.hospitalIn()
                }
            }

            let isLastDiseaseDay = (s.days == this.config.diseaseLength + this.config.incubationLength);
            let isIll = s.state == State.ill || s.state == State.hospitalized;

            if (isIll && isLastDiseaseDay) {
                let fatalityProbability = this.config.fatalityProbability
                if (s.state == State.hospitalized) {
                    fatalityProbability *= this.config.hospitalFactor
                    this.hospitalOut()
                }

                if (Math.random() <= fatalityProbability) {
                    s.state = State.dead
                } else {
                    s.state = State.cured
                }
            }

            return s
        })

        this.sufferers.forEach((s) => {
            this.world[s.x][s.y] = s.state
        })

        this.sufferers = this.sufferers.filter((s) => {
            return s.state == State.ill || s.state == State.carrier || s.state == State.hospitalized
        })

        for (let p of affected) {
            this.sufferers.push(makeSufferer(p[0], p[1]))
        }

        this.step += 1

        if (this.step == this.config.quarantineStart) {
            this.config.diseaseProbabilities.set(State.healthy, this.config.diseaseProbabilities.get(State.healthy) * this.config.quarantineFactor);
            this.config.diseaseProbabilities.set(State.cured, this.config.diseaseProbabilities.get(State.cured) * this.config.quarantineFactor);
        }

        this.updateStat()
    }

    private updateStat() {
        this.healthyCount = 0
        this.carriesCount = 0
        this.illCount = 0
        this.curedCount = 0
        this.deadCount = 0

        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                switch (this.world[i][j]) {
                    case State.healthy:
                        this.healthyCount +=1
                        break
                    case State.carrier:
                        this.carriesCount += 1
                        break
                    case State.ill, State.hospitalized:
                        this.illCount += 1
                        break
                    case State.cured:
                        this.curedCount += 1
                        break
                    case State.dead:
                        this.deadCount += 1
                        break
                }
            }
        }
    }

    private infectCell(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false
        }

        let probability = this.config.diseaseProbabilities.get(this.world[x][y])
        if (probability != undefined) {
            if (Math.random() <= probability) {
                this.world[x][y] = State.carrier
                return true
            }
        }
        return false
    }

    private hospitalIn = () => {
        this.hospitalized += 1
    }

    private hospitalOut = () => {
        this.hospitalized -= 1
    }
}

class PandemicApp {
    private readonly context: CanvasRenderingContext2D;
    private simulation: Simulation
    private started: boolean = false

    constructor() {
        let canvas = document.getElementById('canvas') as  HTMLCanvasElement;
        let context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;

        this.context = context;

        this.simulation = new Simulation(Math.round(canvas.width / cellSize), Math.round(canvas.height / cellSize));

        this.createUserEvents();
        this.draw();
    }

    private createUserEvents() {
        document.getElementById('model-clear')
            .addEventListener("click", this.clearEventHandler);

        document.getElementById('model-run')
            .addEventListener("click", this.runEventHandler);

        document.getElementById('model-step')
            .addEventListener("click", this.stepEventHandler);
    }

    private clear() {
        this.lockSimulationParams(false)
        this.started = false

        this.simulation.reset()
        this.draw()
    }

    private runSimulation() {
        this.stepSimulation()

        if (this.simulation.illCount > 0 || this.simulation.carriesCount > 0) {
            window.requestAnimationFrame(() => this.runSimulation());
        }
    }

    private stepSimulation() {
        if (!this.started) {
            this.readSimulationParams()
            this.lockSimulationParams(true)
            this.started = true
        }

        this.simulation.update()
        this.draw()
    }

    private draw() {
        this.drawWorld()
        this.showStat()
    }

    private drawWorld() {
        let context = this.context
        for (let i = 0; i < this.simulation.height; ++i) {
            for (let j = 0; j < this.simulation.width; ++j) {
                context.fillStyle = colors.get(this.simulation.world[i][j])
                context.fillRect(i*cellSize, j*cellSize, cellSize-1, cellSize-1)
            }
        }
    }

    private showStat() {
        document.getElementById("total").innerHTML = String(this.simulation.totalCount)
        document.getElementById("step").innerHTML = String(this.simulation.step)
        document.getElementById("healthy").innerHTML = String(this.simulation.healthyCount)
        document.getElementById("carriers").innerHTML = String(this.simulation.carriesCount)
        document.getElementById("ill").innerHTML = String(this.simulation.illCount)
        document.getElementById("dead").innerHTML = String(this.simulation.deadCount)
        document.getElementById("cured").innerHTML = String(this.simulation.curedCount)
    }

    private readSimulationParams() {
        this.simulation.config.incubationLength = +(<HTMLInputElement>document.getElementById("incubation-length")).value;
        this.simulation.config.diseaseLength = +(<HTMLInputElement>document.getElementById("disease-length")).value;
        this.simulation.config.fatalityProbability = +(<HTMLInputElement>document.getElementById("mortality-prob")).value;

        this.simulation.config.diseaseProbabilities.set(State.healthy, +(<HTMLInputElement>document.getElementById("disease-prob")).value);
        this.simulation.config.diseaseProbabilities.set(State.cured, +(<HTMLInputElement>document.getElementById("cured-disease-prob")).value);

        this.simulation.config.quarantineStart = +(<HTMLInputElement>document.getElementById("quarantine-start-time")).value;
        this.simulation.config.quarantineFactor = +(<HTMLInputElement>document.getElementById("quarantine-factor")).value;

        this.simulation.config.hospitalsCapacity = +(<HTMLInputElement>document.getElementById("hospitals-capacity")).value;
        this.simulation.config.hospitalFactor = +(<HTMLInputElement>document.getElementById("hospital-factor")).value;
    }

    private lockSimulationParams(lock: boolean) {
        let els: string[] = ["incubation-length", "disease-length", "mortality-prob", "disease-prob", "cured-disease-prob",
            "quarantine-start-time", "quarantine-factor", "hospitals-capacity", "hospital-factor"];

        for (let s of els) {
            (document.getElementById(s) as any).disabled = lock
        }
    }

    private clearEventHandler = () => {
        this.clear()
    }

    private runEventHandler = () => {
        this.runSimulation();
    }

    private stepEventHandler = () => {
        this.stepSimulation();
    }
}

new PandemicApp();