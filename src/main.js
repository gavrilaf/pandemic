var cellSize = 10;
var State;
(function (State) {
    State[State["healthy"] = 0] = "healthy";
    State[State["ill"] = 1] = "ill";
    State[State["carrier"] = 2] = "carrier";
    State[State["cured"] = 3] = "cured";
    State[State["dead"] = 4] = "dead";
    State[State["hospitalized"] = 5] = "hospitalized";
})(State || (State = {}));
var colors = new Map([
    [State.healthy, "gray"],
    [State.ill, "red"],
    [State.carrier, "yellow"],
    [State.cured, "green"],
    [State.dead, "black"],
    [State.hospitalized, "blue"]
]);
function makeSufferer(x, y) {
    return {
        x: x,
        y: y,
        days: 1,
        state: State.carrier
    };
}
var Simulation = /** @class */ (function () {
    function Simulation(width, height) {
        var _this = this;
        this.config = {
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
        };
        this.hospitalIn = function () {
            _this.hospitalized += 1;
        };
        this.hospitalOut = function () {
            _this.hospitalized -= 1;
        };
        this.height = height;
        this.width = width;
        this.reset();
    }
    Simulation.prototype.reset = function () {
        this.world = [];
        this.sufferers = [];
        this.hospitalized = 0;
        for (var i = 0; i < this.height; ++i) {
            this.world[i] = [];
            for (var j = 0; j < this.width; ++j) {
                this.world[i][j] = State.healthy;
            }
        }
        this.world[Math.round(this.height / 2)][Math.round(this.width / 2)] = State.carrier;
        this.sufferers.push(makeSufferer(Math.round(this.height / 2), Math.round(this.width / 2)));
        this.totalCount = this.height * this.width;
        this.step = 0;
        this.updateStat();
    };
    Simulation.prototype.update = function () {
        var _this = this;
        var affected = [];
        for (var _i = 0, _a = this.sufferers; _i < _a.length; _i++) {
            var s = _a[_i];
            if (this.infectCell(s.x, s.y - 1)) {
                affected.push([s.x, s.y - 1]);
            }
            if (this.infectCell(s.x, s.y + 1)) {
                affected.push([s.x, s.y + 1]);
            }
            if (this.infectCell(s.x - 1, s.y)) {
                affected.push([s.x - 1, s.y]);
            }
            if (this.infectCell(s.x + 1, s.y)) {
                affected.push([s.x + 1, s.y]);
            }
        }
        this.sufferers = this.sufferers.map(function (s) {
            s.days += 1;
            if (s.days == _this.config.incubationLength) {
                s.state = State.ill;
                if (_this.hospitalized < _this.config.hospitalsCapacity) {
                    s.state = State.hospitalized;
                    _this.hospitalIn();
                }
            }
            var isLastDiseaseDay = (s.days == _this.config.diseaseLength + _this.config.incubationLength);
            var isIll = s.state == State.ill || s.state == State.hospitalized;
            if (isIll && isLastDiseaseDay) {
                var fatalityProbability = _this.config.fatalityProbability;
                if (s.state == State.hospitalized) {
                    fatalityProbability *= _this.config.hospitalFactor;
                    _this.hospitalOut();
                }
                if (Math.random() <= fatalityProbability) {
                    s.state = State.dead;
                }
                else {
                    s.state = State.cured;
                }
            }
            return s;
        });
        this.sufferers.forEach(function (s) {
            _this.world[s.x][s.y] = s.state;
        });
        this.sufferers = this.sufferers.filter(function (s) {
            return s.state == State.ill || s.state == State.carrier || s.state == State.hospitalized;
        });
        for (var _b = 0, affected_1 = affected; _b < affected_1.length; _b++) {
            var p = affected_1[_b];
            this.sufferers.push(makeSufferer(p[0], p[1]));
        }
        this.step += 1;
        if (this.step == this.config.quarantineStart) {
            this.config.diseaseProbabilities.set(State.healthy, this.config.diseaseProbabilities.get(State.healthy) * this.config.quarantineFactor);
            this.config.diseaseProbabilities.set(State.cured, this.config.diseaseProbabilities.get(State.cured) * this.config.quarantineFactor);
        }
        this.updateStat();
    };
    Simulation.prototype.updateStat = function () {
        this.healthyCount = 0;
        this.carriesCount = 0;
        this.illCount = 0;
        this.curedCount = 0;
        this.deadCount = 0;
        for (var i = 0; i < this.height; ++i) {
            for (var j = 0; j < this.width; ++j) {
                switch (this.world[i][j]) {
                    case State.healthy:
                        this.healthyCount += 1;
                        break;
                    case State.carrier:
                        this.carriesCount += 1;
                        break;
                    case State.ill, State.hospitalized:
                        this.illCount += 1;
                        break;
                    case State.cured:
                        this.curedCount += 1;
                        break;
                    case State.dead:
                        this.deadCount += 1;
                        break;
                }
            }
        }
    };
    Simulation.prototype.infectCell = function (x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false;
        }
        var probability = this.config.diseaseProbabilities.get(this.world[x][y]);
        if (probability != undefined) {
            if (Math.random() <= probability) {
                this.world[x][y] = State.carrier;
                return true;
            }
        }
        return false;
    };
    return Simulation;
}());
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
    PandemicApp.prototype.clear = function () {
        this.lockSimulationParams(false);
        this.started = false;
        this.simulation.reset();
        this.draw();
    };
    PandemicApp.prototype.runSimulation = function () {
        var _this = this;
        this.stepSimulation();
        if (this.simulation.illCount > 0 || this.simulation.carriesCount > 0) {
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
        document.getElementById("total").innerHTML = String(this.simulation.totalCount);
        document.getElementById("step").innerHTML = String(this.simulation.step);
        document.getElementById("healthy").innerHTML = String(this.simulation.healthyCount);
        document.getElementById("carriers").innerHTML = String(this.simulation.carriesCount);
        document.getElementById("ill").innerHTML = String(this.simulation.illCount);
        document.getElementById("dead").innerHTML = String(this.simulation.deadCount);
        document.getElementById("cured").innerHTML = String(this.simulation.curedCount);
    };
    PandemicApp.prototype.readSimulationParams = function () {
        this.simulation.config.incubationLength = +document.getElementById("incubation-length").value;
        this.simulation.config.diseaseLength = +document.getElementById("disease-length").value;
        this.simulation.config.fatalityProbability = +document.getElementById("mortality-prob").value;
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