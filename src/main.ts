import {State, Simulation} from "./simulation"

const cellSize = 5;

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
        this.setSimulationParams();

         this.createChart()

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

    private createChart() {
       /* var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });*/
    }

    private clear() {
        this.lockSimulationParams(false)
        this.started = false

        this.simulation.reset()
        this.draw()
    }

    private runSimulation() {
        this.stepSimulation()

        if (this.simulation.isEligibleForContinue) {
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
        document.getElementById("step").innerHTML = String(this.simulation.step)

        document.getElementById("total").innerHTML = String(this.simulation.statistics.totalCount)
        document.getElementById("healthy").innerHTML = String(this.simulation.statistics.healthyCount)
        document.getElementById("carriers").innerHTML = String(this.simulation.statistics.carriesCount)
        document.getElementById("ill").innerHTML = String(this.simulation.statistics.illCount)
        document.getElementById("dead").innerHTML = String(this.simulation.statistics.deadCount)
        document.getElementById("cured").innerHTML = String(this.simulation.statistics.curedCount)
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