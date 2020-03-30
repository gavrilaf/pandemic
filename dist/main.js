import { State, Simulation } from "./simulation";
import { Charts } from "./chart";
var cellSize = 10;
var simulationDeep = 400;
var colors = new Map([
    [State.healthy, "gray"],
    [State.ill, "red"],
    [State.carrier, "yellow"],
    [State.cured, "green"],
    [State.dead, "black"],
    [State.hospitalized, "blue"]
]);
var PandemicApp = /** @class */ (function () {
    function PandemicApp() {
        var _this = this;
        this.initialized = false;
        this.perfomed = false;
        this.clearEventHandler = function () {
            _this.clear();
        };
        this.runEventHandler = function () {
            _this.perfomed = !_this.perfomed;
            if (_this.perfomed) {
                _this.runSimulation();
            }
            _this.updateRunButton();
        };
        this.stepEventHandler = function () {
            _this.stepSimulation();
        };
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        this.context = context;
        this.simulation = new Simulation(Math.round(canvas.width / cellSize), Math.round(canvas.height / cellSize));
        this.setSimulationParams();
        this.charts = new Charts();
        this.addListeners();
        this.draw();
    }
    PandemicApp.prototype.clear = function () {
        this.lockSimulationParams(false);
        this.initialized = false;
        this.perfomed = false;
        this.simulation.reset();
        this.charts.clear();
        this.draw();
    };
    PandemicApp.prototype.runSimulation = function () {
        var _this = this;
        this.stepSimulation();
        if (this.perfomed && this.simulation.isEligibleForContinue && this.simulation.step < simulationDeep) {
            window.requestAnimationFrame(function () { return _this.runSimulation(); });
        }
        else {
            this.perfomed = false;
            this.updateRunButton();
        }
    };
    PandemicApp.prototype.stepSimulation = function () {
        if (!this.initialized) {
            this.readSimulationParams();
            this.lockSimulationParams(true);
            this.initialized = true;
        }
        this.simulation.update();
        this.draw();
    };
    PandemicApp.prototype.draw = function () {
        this.drawWorld();
        this.showStat();
        this.updateCharts();
    };
    PandemicApp.prototype.drawWorld = function () {
        var context = this.context;
        for (var i = 0; i < this.simulation.height; ++i) {
            for (var j = 0; j < this.simulation.width; ++j) {
                context.fillStyle = colors.get(this.simulation.world[i][j]);
                context.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    };
    PandemicApp.prototype.showStat = function () {
        document.getElementById("step").innerHTML = String(this.simulation.step);
        document.getElementById("total").innerHTML = String(this.simulation.statistics.total);
        document.getElementById("healthy").innerHTML = String(this.simulation.statistics.healthy);
        document.getElementById("carriers").innerHTML = String(this.simulation.statistics.carries);
        document.getElementById("ill").innerHTML = String(this.simulation.statistics.ill);
        document.getElementById("dead").innerHTML = String(this.simulation.statistics.dead);
        document.getElementById("cured").innerHTML = String(this.simulation.statistics.cured);
    };
    PandemicApp.prototype.updateCharts = function () {
        this.charts.pushStep({
            step: this.simulation.step,
            totalInfected: this.simulation.statistics.infected,
            totalDead: this.simulation.statistics.dead,
            dayInfected: this.simulation.statistics.day.infected,
            dayDead: this.simulation.statistics.day.dead,
            isQuarantineStep: this.simulation.step == this.simulation.config.quarantineStart
        });
    };
    PandemicApp.prototype.setSimulationParams = function () {
        document.getElementById("incubation-length").value = String(this.simulation.config.incubationLength);
        document.getElementById("disease-length").value = String(this.simulation.config.diseaseLength);
        document.getElementById("mortality-prob").value = String(this.simulation.config.mortalityProbability);
        document.getElementById("disease-prob").value = String(this.simulation.config.diseaseProbabilities.get(State.healthy));
        document.getElementById("cured-disease-prob").value = String(this.simulation.config.diseaseProbabilities.get(State.cured));
        document.getElementById("quarantine-start-time").value = String(this.simulation.config.quarantineStart);
        document.getElementById("quarantine-factor").value = String(this.simulation.config.quarantineFactor);
        document.getElementById("hospitals-capacity").value = String(this.simulation.config.hospitalsCapacity);
        document.getElementById("hospital-factor").value = String(this.simulation.config.hospitalFactor);
    };
    PandemicApp.prototype.readSimulationParams = function () {
        this.simulation.config.incubationLength = +document.getElementById("incubation-length").value;
        this.simulation.config.diseaseLength = +document.getElementById("disease-length").value;
        this.simulation.config.mortalityProbability = +document.getElementById("mortality-prob").value;
        this.simulation.config.diseaseProbabilities.set(State.healthy, +document.getElementById("disease-prob").value);
        this.simulation.config.diseaseProbabilities.set(State.cured, +document.getElementById("cured-disease-prob").value);
        this.simulation.config.quarantineStart = +document.getElementById("quarantine-start-time").value;
        this.simulation.config.quarantineFactor = +document.getElementById("quarantine-factor").value;
        this.simulation.config.hospitalsCapacity = +document.getElementById("hospitals-capacity").value;
        this.simulation.config.hospitalFactor = +document.getElementById("hospital-factor").value;
    };
    PandemicApp.prototype.lockSimulationParams = function (lock) {
        var els = ["incubation-length", "disease-length", "mortality-prob", "disease-prob", "cured-disease-prob",
            "quarantine-start-time", "quarantine-factor", "hospitals-capacity", "hospital-factor"];
        for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
            var s = els_1[_i];
            document.getElementById(s).disabled = lock;
        }
    };
    PandemicApp.prototype.addListeners = function () {
        document.getElementById('model-clear')
            .addEventListener("click", this.clearEventHandler);
        document.getElementById('model-run')
            .addEventListener("click", this.runEventHandler);
        document.getElementById('model-step')
            .addEventListener("click", this.stepEventHandler);
    };
    PandemicApp.prototype.updateRunButton = function () {
        if (this.perfomed) {
            document.getElementById("model-run").innerHTML = "Stop";
        }
        else {
            document.getElementById("model-run").innerHTML = "Run";
        }
    };
    return PandemicApp;
}());
new PandemicApp();
//# sourceMappingURL=main.js.map