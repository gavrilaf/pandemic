import { State, Simulation } from "./simulation";
var cellSize = 5;
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
        this.started = false;
        this.clearEventHandler = function () {
            _this.clear();
        };
        this.runEventHandler = function () {
            _this.runSimulation();
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
        this.createUserEvents();
        this.setSimulationParams();
        this.createChart();
        this.draw();
    }
    PandemicApp.prototype.createUserEvents = function () {
        document.getElementById('model-clear')
            .addEventListener("click", this.clearEventHandler);
        document.getElementById('model-run')
            .addEventListener("click", this.runEventHandler);
        document.getElementById('model-step')
            .addEventListener("click", this.stepEventHandler);
    };
    PandemicApp.prototype.createChart = function () {
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
    };
    PandemicApp.prototype.clear = function () {
        this.lockSimulationParams(false);
        this.started = false;
        this.simulation.reset();
        this.draw();
    };
    PandemicApp.prototype.runSimulation = function () {
        var _this = this;
        this.stepSimulation();
        if (this.simulation.isEligibleForContinue) {
            window.requestAnimationFrame(function () { return _this.runSimulation(); });
        }
    };
    PandemicApp.prototype.stepSimulation = function () {
        if (!this.started) {
            this.readSimulationParams();
            this.lockSimulationParams(true);
            this.started = true;
        }
        this.simulation.update();
        this.draw();
    };
    PandemicApp.prototype.draw = function () {
        this.drawWorld();
        this.showStat();
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
        document.getElementById("total").innerHTML = String(this.simulation.statistics.totalCount);
        document.getElementById("healthy").innerHTML = String(this.simulation.statistics.healthyCount);
        document.getElementById("carriers").innerHTML = String(this.simulation.statistics.carriesCount);
        document.getElementById("ill").innerHTML = String(this.simulation.statistics.illCount);
        document.getElementById("dead").innerHTML = String(this.simulation.statistics.deadCount);
        document.getElementById("cured").innerHTML = String(this.simulation.statistics.curedCount);
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
    return PandemicApp;
}());
new PandemicApp();
//# sourceMappingURL=main.js.map