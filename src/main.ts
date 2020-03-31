import {State, Simulation} from "./simulation";
import {Charts} from "./chart";

const cellSize = 10;
const simulationDeep = 400

const colors = new Map([
    [State.healthy, "gray"],
    [State.ill, "red"],
    [State.carrier, "yellow"],
    [State.cured, "green"],
    [State.dead, "black"],
    [State.hospitalized, "blue"]
])

class PandemicApp {
    private readonly context: CanvasRenderingContext2D;
    private simulation: Simulation

    private initialized: boolean = false
    private perfomed: boolean = false

    private charts: Charts
    private hospitalCapacityExhausted = false

    constructor() {
        let canvas = document.getElementById('canvas') as  HTMLCanvasElement;
        let context = canvas.getContext("2d")!;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;

        this.context = context;

        this.simulation = new Simulation(Math.round(canvas.width / cellSize), Math.round(canvas.height / cellSize));
        this.setSimulationParams();

        this.charts = new Charts();

        this.addListeners()

        this.draw();
    }

    private clear() {
        this.lockSimulationParams(false)
        this.initialized = false
        this.perfomed = false

        this.simulation.reset()
        this.charts.clear()
        this.draw()
    }

    private runSimulation() {
        this.stepSimulation()

        if (this.perfomed && this.simulation.isEligibleForContinue && this.simulation.step < simulationDeep) {
            window.requestAnimationFrame(() => this.runSimulation());
        } else {
            this.perfomed = false
            this.updateRunButton()
        }
    }

    private stepSimulation() {
        if (!this.initialized) {
            this.readSimulationParams()
            this.lockSimulationParams(true)
            this.initialized = true
        }

        this.simulation.update()
        this.draw()
    }

    private draw() {
        this.drawWorld()
        this.showStat()
        this.updateCharts()
    }

    private drawWorld() {
        let context = this.context
        for (let i = 0; i < this.simulation.height; ++i) {
            for (let j = 0; j < this.simulation.width; ++j) {
                context.fillStyle = colors.get(this.simulation.world[i][j])!
                context.fillRect(i*cellSize, j*cellSize, cellSize-1, cellSize-1)
            }
        }
    }

    private showStat() {
        let total = this.simulation.stat.total
        let cured = this.simulation.stat.cured
        let dead = this.simulation.stat.dead

        let curedPercent = (cured / total) * 100
        let deadPercent = (dead / total) * 100

        let curedStr = cured + " (" + curedPercent + "%)"
        let deadStr = dead + " (" + deadPercent + "%)"

        document.getElementById("step")!.innerHTML = String(this.simulation.step)
        document.getElementById("total")!.innerHTML = String(total)
        document.getElementById("healthy")!.innerHTML = String(this.simulation.stat.healthy)
        document.getElementById("carriers")!.innerHTML = String(this.simulation.stat.carries)
        document.getElementById("ill")!.innerHTML = String(this.simulation.stat.ill)
        document.getElementById("dead")!.innerHTML = deadStr
        document.getElementById("cured")!.innerHTML = curedStr
    }

    private updateCharts() {
        let isQuarantine = this.simulation.step == this.simulation.config.quarantineStart
        let hospitalCapacityExhausted = this.simulation.stat.hospitalized >= this.simulation.config.hospitalsCapacity &&
            this.simulation.config.hospitalsCapacity != 0

        if (this.hospitalCapacityExhausted) {
            hospitalCapacityExhausted = false
        } else if (hospitalCapacityExhausted) {
            this.hospitalCapacityExhausted = true
        }

        this.charts.pushStep({
            step: this.simulation.step,
            totalInfected: this.simulation.stat.infected,
            totalDead: this.simulation.stat.dead,
            dayInfected: this.simulation.stat.day.infected,
            dayDead: this.simulation.stat.day.dead,
            isQuarantineStep: isQuarantine,
            hospitalCapacityExhausted: hospitalCapacityExhausted
        })
    }

    private setSimulationParams() {
        (<HTMLInputElement>document.getElementById("incubation-length")).value = String(this.simulation.config.incubationLength);
        (<HTMLInputElement>document.getElementById("disease-length")).value = String(this.simulation.config.diseaseLength);
        (<HTMLInputElement>document.getElementById("mortality-prob")).value = String(this.simulation.config.mortalityProbability);

        (<HTMLInputElement>document.getElementById("disease-prob")).value = String(this.simulation.config.diseaseProbabilities.get(State.healthy));
        (<HTMLInputElement>document.getElementById("cured-disease-prob")).value = String(this.simulation.config.diseaseProbabilities.get(State.cured));

         (<HTMLInputElement>document.getElementById("quarantine-start-time")).value = String(this.simulation.config.quarantineStart);
         (<HTMLInputElement>document.getElementById("quarantine-factor")).value = String(this.simulation.config.quarantineFactor);

         (<HTMLInputElement>document.getElementById("hospitals-capacity")).value = String(this.simulation.config.hospitalsCapacity);
         (<HTMLInputElement>document.getElementById("hospital-factor")).value = String(this.simulation.config.hospitalFactor);
    }

    private readSimulationParams() {
        this.simulation.config.incubationLength = +(<HTMLInputElement>document.getElementById("incubation-length")).value;
        this.simulation.config.diseaseLength = +(<HTMLInputElement>document.getElementById("disease-length")).value;
        this.simulation.config.mortalityProbability = +(<HTMLInputElement>document.getElementById("mortality-prob")).value;

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

    private addListeners() {
        document.getElementById('model-clear')!
            .addEventListener("click", this.clearEventHandler);

        document.getElementById('model-run')!
            .addEventListener("click", this.runEventHandler);

        document.getElementById('model-step')!
            .addEventListener("click", this.stepEventHandler);
    }

    private clearEventHandler = () => {
        this.clear()
    }

    private runEventHandler = () => {
        this.perfomed = !this.perfomed

        if (this.perfomed) {
            this.runSimulation();
        }

        this.updateRunButton()
    }

    private stepEventHandler = () => {
        this.stepSimulation();
    }

    private updateRunButton() {
        if (this.perfomed) {
            document.getElementById("model-run")!.innerHTML = "Stop"
        } else {
            document.getElementById("model-run")!.innerHTML = "Run"
        }
    }
}

new PandemicApp();