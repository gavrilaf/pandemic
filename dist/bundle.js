/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _simulation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./simulation */ "./src/simulation.ts");

var cellSize = 5;
var colors = new Map([
    [_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].healthy, "gray"],
    [_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].ill, "red"],
    [_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].carrier, "yellow"],
    [_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].cured, "green"],
    [_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].dead, "black"],
    [_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].hospitalized, "blue"]
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
        this.simulation = new _simulation__WEBPACK_IMPORTED_MODULE_0__["Simulation"](Math.round(canvas.width / cellSize), Math.round(canvas.height / cellSize));
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
        document.getElementById("disease-prob").value = String(this.simulation.config.diseaseProbabilities.get(_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].healthy));
        document.getElementById("cured-disease-prob").value = String(this.simulation.config.diseaseProbabilities.get(_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].cured));
        document.getElementById("quarantine-start-time").value = String(this.simulation.config.quarantineStart);
        document.getElementById("quarantine-factor").value = String(this.simulation.config.quarantineFactor);
        document.getElementById("hospitals-capacity").value = String(this.simulation.config.hospitalsCapacity);
        document.getElementById("hospital-factor").value = String(this.simulation.config.hospitalFactor);
    };
    PandemicApp.prototype.readSimulationParams = function () {
        this.simulation.config.incubationLength = +document.getElementById("incubation-length").value;
        this.simulation.config.diseaseLength = +document.getElementById("disease-length").value;
        this.simulation.config.mortalityProbability = +document.getElementById("mortality-prob").value;
        this.simulation.config.diseaseProbabilities.set(_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].healthy, +document.getElementById("disease-prob").value);
        this.simulation.config.diseaseProbabilities.set(_simulation__WEBPACK_IMPORTED_MODULE_0__["State"].cured, +document.getElementById("cured-disease-prob").value);
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


/***/ }),

/***/ "./src/simulation.ts":
/*!***************************!*\
  !*** ./src/simulation.ts ***!
  \***************************/
/*! exports provided: State, Simulation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Simulation", function() { return Simulation; });
var State;
(function (State) {
    State[State["healthy"] = 0] = "healthy";
    State[State["ill"] = 1] = "ill";
    State[State["carrier"] = 2] = "carrier";
    State[State["cured"] = 3] = "cured";
    State[State["dead"] = 4] = "dead";
    State[State["hospitalized"] = 5] = "hospitalized";
})(State || (State = {}));
var Coordinate = /** @class */ (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Coordinate.prototype, "top", {
        get: function () {
            return new Coordinate(this.x, this.y - 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coordinate.prototype, "bottom", {
        get: function () {
            return new Coordinate(this.x, this.y + 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coordinate.prototype, "left", {
        get: function () {
            return new Coordinate(this.x - 1, this.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coordinate.prototype, "right", {
        get: function () {
            return new Coordinate(this.x + 1, this.y);
        },
        enumerable: true,
        configurable: true
    });
    return Coordinate;
}());
function newSufferer(c) {
    return {
        c: c,
        days: 1,
        state: State.carrier
    };
}
var Simulation = /** @class */ (function () {
    function Simulation(width, height) {
        this.config = {
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
        };
        this.statistics = {
            totalCount: 0,
            healthyCount: 0,
            carriesCount: 0,
            illCount: 0,
            curedCount: 0,
            deadCount: 0
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
        this.sufferers.push(newSufferer(new Coordinate(Math.round(this.height / 2), Math.round(this.width / 2))));
        this.statistics.totalCount = this.height * this.width;
        this.step = 0;
        this.updateStat();
    };
    Simulation.prototype.update = function () {
        var _this = this;
        var infected = [];
        for (var _i = 0, _a = this.sufferers; _i < _a.length; _i++) {
            var s = _a[_i];
            if (this.infectCell(s.c.top)) {
                infected.push(s.c.top);
            }
            if (this.infectCell(s.c.bottom)) {
                infected.push(s.c.bottom);
            }
            if (this.infectCell(s.c.left)) {
                infected.push(s.c.left);
            }
            if (this.infectCell(s.c.right)) {
                infected.push(s.c.right);
            }
        }
        for (var _b = 0, _c = this.sufferers; _b < _c.length; _b++) {
            var s = _c[_b];
            s.days += 1;
            if (s.days == this.config.incubationLength) {
                s.state = State.ill;
                if (this.hospitalized < this.config.hospitalsCapacity) {
                    s.state = State.hospitalized;
                    this.hospitalized += 1;
                }
            }
            var isLastDiseaseDay = (s.days == this.config.diseaseLength + this.config.incubationLength);
            var isIll = s.state == State.ill || s.state == State.hospitalized;
            if (isIll && isLastDiseaseDay) {
                var mortalityProbability = this.config.mortalityProbability;
                if (s.state == State.hospitalized) {
                    mortalityProbability *= this.config.hospitalFactor;
                    this.hospitalized -= 1;
                }
                if (Math.random() <= mortalityProbability) {
                    s.state = State.dead;
                }
                else {
                    s.state = State.cured;
                }
            }
        }
        this.sufferers.forEach(function (s) {
            _this.world[s.c.x][s.c.y] = s.state;
        });
        this.sufferers = this.sufferers.filter(function (s) {
            return s.state == State.ill || s.state == State.carrier || s.state == State.hospitalized;
        });
        for (var _d = 0, infected_1 = infected; _d < infected_1.length; _d++) {
            var c = infected_1[_d];
            this.sufferers.push(newSufferer(c));
        }
        this.step += 1;
        if (this.step == this.config.quarantineStart) {
            this.config.diseaseProbabilities.set(State.healthy, this.config.diseaseProbabilities.get(State.healthy) * this.config.quarantineFactor);
            this.config.diseaseProbabilities.set(State.cured, this.config.diseaseProbabilities.get(State.cured) * this.config.quarantineFactor);
        }
        this.updateStat();
    };
    Object.defineProperty(Simulation.prototype, "isEligibleForContinue", {
        get: function () {
            return this.statistics.illCount > 0 || this.statistics.carriesCount > 0 || this.hospitalized > 0;
        },
        enumerable: true,
        configurable: true
    });
    Simulation.prototype.updateStat = function () {
        this.statistics.healthyCount = 0;
        this.statistics.carriesCount = 0;
        this.statistics.illCount = 0;
        this.statistics.curedCount = 0;
        this.statistics.deadCount = 0;
        for (var i = 0; i < this.height; ++i) {
            for (var j = 0; j < this.width; ++j) {
                switch (this.world[i][j]) {
                    case State.healthy:
                        this.statistics.healthyCount += 1;
                        break;
                    case State.carrier:
                        this.statistics.carriesCount += 1;
                        break;
                    case State.ill, State.hospitalized:
                        this.statistics.illCount += 1;
                        break;
                    case State.cured:
                        this.statistics.curedCount += 1;
                        break;
                    case State.dead:
                        this.statistics.deadCount += 1;
                        break;
                }
            }
        }
    };
    Simulation.prototype.infectCell = function (c) {
        if (c.x < 0 || c.y < 0 || c.x >= this.width || c.y >= this.height) {
            return false;
        }
        var probability = this.config.diseaseProbabilities.get(this.world[c.x][c.y]);
        if (probability != undefined) {
            if (Math.random() <= probability) {
                this.world[c.x][c.y] = State.carrier;
                return true;
            }
        }
        return false;
    };
    return Simulation;
}());



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NpbXVsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQThDO0FBRTlDLElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztBQUVuQixJQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUNuQixDQUFDLGlEQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztJQUN2QixDQUFDLGlEQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztJQUNsQixDQUFDLGlEQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUN6QixDQUFDLGlEQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztJQUN0QixDQUFDLGlEQUFLLENB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LElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxJQUFJLFdBQVcsSUFBSSxTQUFTLEVBQUU7WUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksV0FBVyxFQUFFO2dCQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU87Z0JBQ3BDLE9BQU8sSUFBSTthQUNkO1NBQ0o7UUFDRCxPQUFPLEtBQUs7SUFDaEIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiaW1wb3J0IHtTdGF0ZSwgU2ltdWxhdGlvbn0gZnJvbSBcIi4vc2ltdWxhdGlvblwiXG5cbmNvbnN0IGNlbGxTaXplID0gNTtcblxuY29uc3QgY29sb3JzID0gbmV3IE1hcChbXG4gICAgW1N0YXRlLmhlYWx0aHksIFwiZ3JheVwiXSxcbiAgICBbU3RhdGUuaWxsLCBcInJlZFwiXSxcbiAgICBbU3RhdGUuY2FycmllciwgXCJ5ZWxsb3dcIl0sXG4gICAgW1N0YXRlLmN1cmVkLCBcImdyZWVuXCJdLFxuICAgIFtTdGF0ZS5kZWFkLCBcImJsYWNrXCJdLFxuICAgIFtTdGF0ZS5ob3NwaXRhbGl6ZWQsIFwiYmx1ZVwiXVxuXSlcblxuY2xhc3MgUGFuZGVtaWNBcHAge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgc2ltdWxhdGlvbjogU2ltdWxhdGlvblxuICAgIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyAgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgY29udGV4dC5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICAgICAgY29udGV4dC5saW5lSm9pbiA9ICdyb3VuZCc7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcblxuICAgICAgICB0aGlzLnNpbXVsYXRpb24gPSBuZXcgU2ltdWxhdGlvbihNYXRoLnJvdW5kKGNhbnZhcy53aWR0aCAvIGNlbGxTaXplKSwgTWF0aC5yb3VuZChjYW52YXMuaGVpZ2h0IC8gY2VsbFNpemUpKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVVzZXJFdmVudHMoKTtcbiAgICAgICAgdGhpcy5zZXRTaW11bGF0aW9uUGFyYW1zKCk7XG5cbiAgICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKVxuXG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVXNlckV2ZW50cygpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVsLWNsZWFyJylcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGVhckV2ZW50SGFuZGxlcik7XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVsLXJ1bicpXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMucnVuRXZlbnRIYW5kbGVyKTtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZWwtc3RlcCcpXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuc3RlcEV2ZW50SGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDaGFydCgpIHtcbiAgICAgICAvKiB2YXIgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215Q2hhcnQnKTtcbiAgICAgICAgdmFyIG15Q2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBsYWJlbHM6IFsnUmVkJywgJ0JsdWUnLCAnWWVsbG93JywgJ0dyZWVuJywgJ1B1cnBsZScsICdPcmFuZ2UnXSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0czogW3tcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICcjIG9mIFZvdGVzJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogWzEyLCAxOSwgMywgNSwgMiwgM10sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3JnYmEoMjU1LCA5OSwgMTMyLCAwLjIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdyZ2JhKDU0LCAxNjIsIDIzNSwgMC4yKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAncmdiYSgyNTUsIDIwNiwgODYsIDAuMiknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3JnYmEoNzUsIDE5MiwgMTkyLCAwLjIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdyZ2JhKDE1MywgMTAyLCAyNTUsIDAuMiknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3JnYmEoMjU1LCAxNTksIDY0LCAwLjIpJ1xuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3JnYmEoMjU1LCA5OSwgMTMyLCAxKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAncmdiYSg1NCwgMTYyLCAyMzUsIDEpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdyZ2JhKDI1NSwgMjA2LCA4NiwgMSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3JnYmEoNzUsIDE5MiwgMTkyLCAxKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAncmdiYSgxNTMsIDEwMiwgMjU1LCAxKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAncmdiYSgyNTUsIDE1OSwgNjQsIDEpJ1xuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHNjYWxlczoge1xuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyovXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5sb2NrU2ltdWxhdGlvblBhcmFtcyhmYWxzZSlcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2VcblxuICAgICAgICB0aGlzLnNpbXVsYXRpb24ucmVzZXQoKVxuICAgICAgICB0aGlzLmRyYXcoKVxuICAgIH1cblxuICAgIHByaXZhdGUgcnVuU2ltdWxhdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdGVwU2ltdWxhdGlvbigpXG5cbiAgICAgICAgaWYgKHRoaXMuc2ltdWxhdGlvbi5pc0VsaWdpYmxlRm9yQ29udGludWUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5ydW5TaW11bGF0aW9uKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGVwU2ltdWxhdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZFNpbXVsYXRpb25QYXJhbXMoKVxuICAgICAgICAgICAgdGhpcy5sb2NrU2ltdWxhdGlvblBhcmFtcyh0cnVlKVxuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaW11bGF0aW9uLnVwZGF0ZSgpXG4gICAgICAgIHRoaXMuZHJhdygpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3KCkge1xuICAgICAgICB0aGlzLmRyYXdXb3JsZCgpXG4gICAgICAgIHRoaXMuc2hvd1N0YXQoKVxuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1dvcmxkKCkge1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMuY29udGV4dFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2ltdWxhdGlvbi5oZWlnaHQ7ICsraSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnNpbXVsYXRpb24ud2lkdGg7ICsraikge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JzLmdldCh0aGlzLnNpbXVsYXRpb24ud29ybGRbaV1bal0pXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdChpKmNlbGxTaXplLCBqKmNlbGxTaXplLCBjZWxsU2l6ZS0xLCBjZWxsU2l6ZS0xKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG93U3RhdCgpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGVwXCIpLmlubmVySFRNTCA9IFN0cmluZyh0aGlzLnNpbXVsYXRpb24uc3RlcClcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvdGFsXCIpLmlubmVySFRNTCA9IFN0cmluZyh0aGlzLnNpbXVsYXRpb24uc3RhdGlzdGljcy50b3RhbENvdW50KVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWx0aHlcIikuaW5uZXJIVE1MID0gU3RyaW5nKHRoaXMuc2ltdWxhdGlvbi5zdGF0aXN0aWNzLmhlYWx0aHlDb3VudClcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJyaWVyc1wiKS5pbm5lckhUTUwgPSBTdHJpbmcodGhpcy5zaW11bGF0aW9uLnN0YXRpc3RpY3MuY2Fycmllc0NvdW50KVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlsbFwiKS5pbm5lckhUTUwgPSBTdHJpbmcodGhpcy5zaW11bGF0aW9uLnN0YXRpc3RpY3MuaWxsQ291bnQpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZFwiKS5pbm5lckhUTUwgPSBTdHJpbmcodGhpcy5zaW11bGF0aW9uLnN0YXRpc3RpY3MuZGVhZENvdW50KVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cmVkXCIpLmlubmVySFRNTCA9IFN0cmluZyh0aGlzLnNpbXVsYXRpb24uc3RhdGlzdGljcy5jdXJlZENvdW50KVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U2ltdWxhdGlvblBhcmFtcygpIHtcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5jdWJhdGlvbi1sZW5ndGhcIikpLnZhbHVlID0gU3RyaW5nKHRoaXMuc2ltdWxhdGlvbi5jb25maWcuaW5jdWJhdGlvbkxlbmd0aCk7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpc2Vhc2UtbGVuZ3RoXCIpKS52YWx1ZSA9IFN0cmluZyh0aGlzLnNpbXVsYXRpb24uY29uZmlnLmRpc2Vhc2VMZW5ndGgpO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3J0YWxpdHktcHJvYlwiKSkudmFsdWUgPSBTdHJpbmcodGhpcy5zaW11bGF0aW9uLmNvbmZpZy5tb3J0YWxpdHlQcm9iYWJpbGl0eSk7XG5cbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlzZWFzZS1wcm9iXCIpKS52YWx1ZSA9IFN0cmluZyh0aGlzLnNpbXVsYXRpb24uY29uZmlnLmRpc2Vhc2VQcm9iYWJpbGl0aWVzLmdldChTdGF0ZS5oZWFsdGh5KSk7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cmVkLWRpc2Vhc2UtcHJvYlwiKSkudmFsdWUgPSBTdHJpbmcodGhpcy5zaW11bGF0aW9uLmNvbmZpZy5kaXNlYXNlUHJvYmFiaWxpdGllcy5nZXQoU3RhdGUuY3VyZWQpKTtcblxuICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVhcmFudGluZS1zdGFydC10aW1lXCIpKS52YWx1ZSA9IFN0cmluZyh0aGlzLnNpbXVsYXRpb24uY29uZmlnLnF1YXJhbnRpbmVTdGFydCk7XG4gICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWFyYW50aW5lLWZhY3RvclwiKSkudmFsdWUgPSBTdHJpbmcodGhpcy5zaW11bGF0aW9uLmNvbmZpZy5xdWFyYW50aW5lRmFjdG9yKTtcblxuICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9zcGl0YWxzLWNhcGFjaXR5XCIpKS52YWx1ZSA9IFN0cmluZyh0aGlzLnNpbXVsYXRpb24uY29uZmlnLmhvc3BpdGFsc0NhcGFjaXR5KTtcbiAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvc3BpdGFsLWZhY3RvclwiKSkudmFsdWUgPSBTdHJpbmcodGhpcy5zaW11bGF0aW9uLmNvbmZpZy5ob3NwaXRhbEZhY3Rvcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWFkU2ltdWxhdGlvblBhcmFtcygpIHtcbiAgICAgICAgdGhpcy5zaW11bGF0aW9uLmNvbmZpZy5pbmN1YmF0aW9uTGVuZ3RoID0gKyg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluY3ViYXRpb24tbGVuZ3RoXCIpKS52YWx1ZTtcbiAgICAgICAgdGhpcy5zaW11bGF0aW9uLmNvbmZpZy5kaXNlYXNlTGVuZ3RoID0gKyg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpc2Vhc2UtbGVuZ3RoXCIpKS52YWx1ZTtcbiAgICAgICAgdGhpcy5zaW11bGF0aW9uLmNvbmZpZy5tb3J0YWxpdHlQcm9iYWJpbGl0eSA9ICsoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3J0YWxpdHktcHJvYlwiKSkudmFsdWU7XG5cbiAgICAgICAgdGhpcy5zaW11bGF0aW9uLmNvbmZpZy5kaXNlYXNlUHJvYmFiaWxpdGllcy5zZXQoU3RhdGUuaGVhbHRoeSwgKyg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpc2Vhc2UtcHJvYlwiKSkudmFsdWUpO1xuICAgICAgICB0aGlzLnNpbXVsYXRpb24uY29uZmlnLmRpc2Vhc2VQcm9iYWJpbGl0aWVzLnNldChTdGF0ZS5jdXJlZCwgKyg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cmVkLWRpc2Vhc2UtcHJvYlwiKSkudmFsdWUpO1xuXG4gICAgICAgIHRoaXMuc2ltdWxhdGlvbi5jb25maWcucXVhcmFudGluZVN0YXJ0ID0gKyg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1YXJhbnRpbmUtc3RhcnQtdGltZVwiKSkudmFsdWU7XG4gICAgICAgIHRoaXMuc2ltdWxhdGlvbi5jb25maWcucXVhcmFudGluZUZhY3RvciA9ICsoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWFyYW50aW5lLWZhY3RvclwiKSkudmFsdWU7XG5cbiAgICAgICAgdGhpcy5zaW11bGF0aW9uLmNvbmZpZy5ob3NwaXRhbHNDYXBhY2l0eSA9ICsoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3NwaXRhbHMtY2FwYWNpdHlcIikpLnZhbHVlO1xuICAgICAgICB0aGlzLnNpbXVsYXRpb24uY29uZmlnLmhvc3BpdGFsRmFjdG9yID0gKyg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvc3BpdGFsLWZhY3RvclwiKSkudmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2NrU2ltdWxhdGlvblBhcmFtcyhsb2NrOiBib29sZWFuKSB7XG4gICAgICAgIGxldCBlbHM6IHN0cmluZ1tdID0gW1wiaW5jdWJhdGlvbi1sZW5ndGhcIiwgXCJkaXNlYXNlLWxlbmd0aFwiLCBcIm1vcnRhbGl0eS1wcm9iXCIsIFwiZGlzZWFzZS1wcm9iXCIsIFwiY3VyZWQtZGlzZWFzZS1wcm9iXCIsXG4gICAgICAgICAgICBcInF1YXJhbnRpbmUtc3RhcnQtdGltZVwiLCBcInF1YXJhbnRpbmUtZmFjdG9yXCIsIFwiaG9zcGl0YWxzLWNhcGFjaXR5XCIsIFwiaG9zcGl0YWwtZmFjdG9yXCJdO1xuXG4gICAgICAgIGZvciAobGV0IHMgb2YgZWxzKSB7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocykgYXMgYW55KS5kaXNhYmxlZCA9IGxvY2tcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJFdmVudEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2xlYXIoKVxuICAgIH1cblxuICAgIHByaXZhdGUgcnVuRXZlbnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnJ1blNpbXVsYXRpb24oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0ZXBFdmVudEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RlcFNpbXVsYXRpb24oKTtcbiAgICB9XG59XG5cbm5ldyBQYW5kZW1pY0FwcCgpOyIsImV4cG9ydCBlbnVtIFN0YXRlIHtcbiAgICBoZWFsdGh5LFxuICAgIGlsbCxcbiAgICBjYXJyaWVyLFxuICAgIGN1cmVkLFxuICAgIGRlYWQsXG4gICAgaG9zcGl0YWxpemVkXG59XG5cbmNsYXNzIENvb3JkaW5hdGUge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHtcbiAgICB9XG5cbiAgICBnZXQgdG9wKCk6IENvb3JkaW5hdGUge1xuICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGUodGhpcy54LCB0aGlzLnkgLSAxKTtcbiAgICB9XG5cbiAgICBnZXQgYm90dG9tKCk6IENvb3JkaW5hdGUge1xuICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGUodGhpcy54LCB0aGlzLnkgKyAxKTtcbiAgICB9XG5cbiAgICBnZXQgbGVmdCgpOiBDb29yZGluYXRlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlKHRoaXMueCAtIDEsIHRoaXMueSk7XG4gICAgfVxuXG4gICAgZ2V0IHJpZ2h0KCk6IENvb3JkaW5hdGUge1xuICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGUodGhpcy54ICsgMSwgdGhpcy55KTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBTdWZmZXJlciB7XG4gICAgYzogQ29vcmRpbmF0ZVxuICAgIGRheXM6IG51bWJlclxuICAgIHN0YXRlOiBTdGF0ZVxufVxuXG5mdW5jdGlvbiBuZXdTdWZmZXJlcihjOiBDb29yZGluYXRlKTogU3VmZmVyZXIge1xuICAgIHJldHVybiB7XG4gICAgICAgIGM6IGMsXG4gICAgICAgIGRheXM6IDEsXG4gICAgICAgIHN0YXRlOiBTdGF0ZS5jYXJyaWVyXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2ltdWxhdGlvbiB7XG5cbiAgICBwdWJsaWMgcmVhZG9ubHkgIHdpZHRoOiBudW1iZXJcbiAgICBwdWJsaWMgcmVhZG9ubHkgIGhlaWdodDogbnVtYmVyXG5cbiAgICBwdWJsaWMgY29uZmlnID0ge1xuICAgICAgICBpbmN1YmF0aW9uTGVuZ3RoOiA1LFxuICAgICAgICBkaXNlYXNlTGVuZ3RoOiA0LFxuICAgICAgICBtb3J0YWxpdHlQcm9iYWJpbGl0eTogMC4wNSxcbiAgICAgICAgZGlzZWFzZVByb2JhYmlsaXRpZXM6IG5ldyBNYXAoW1xuICAgICAgICAgICAgW1N0YXRlLmhlYWx0aHksIDAuMTRdLFxuICAgICAgICAgICAgW1N0YXRlLmN1cmVkLCAwLjAxXVxuICAgICAgICBdKSxcbiAgICAgICAgcXVhcmFudGluZVN0YXJ0OiA1MCxcbiAgICAgICAgcXVhcmFudGluZUZhY3RvcjogMC43NSxcbiAgICAgICAgaG9zcGl0YWxzQ2FwYWNpdHk6IDUsXG4gICAgICAgIGhvc3BpdGFsRmFjdG9yOiAwLjVcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RlcDogbnVtYmVyXG4gICAgcHVibGljIHdvcmxkOiBTdGF0ZVtdW11cblxuICAgIHB1YmxpYyBzdGF0aXN0aWNzID0ge1xuICAgICAgICB0b3RhbENvdW50OiAwLFxuICAgICAgICBoZWFsdGh5Q291bnQ6IDAsXG4gICAgICAgIGNhcnJpZXNDb3VudDogMCxcbiAgICAgICAgaWxsQ291bnQ6IDAsXG4gICAgICAgIGN1cmVkQ291bnQ6IDAsXG4gICAgICAgIGRlYWRDb3VudDogMFxuICAgIH1cblxuICAgIHByaXZhdGUgaG9zcGl0YWxpemVkOiBudW1iZXJcbiAgICBwcml2YXRlIHN1ZmZlcmVyczogU3VmZmVyZXJbXVxuXG4gICAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoXG5cbiAgICAgICAgdGhpcy5yZXNldCgpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMud29ybGQgPSBbXVxuICAgICAgICB0aGlzLnN1ZmZlcmVycyA9IFtdXG5cbiAgICAgICAgdGhpcy5ob3NwaXRhbGl6ZWQgPSAwXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLndvcmxkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFtpXVtqXSA9IFN0YXRlLmhlYWx0aHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud29ybGRbTWF0aC5yb3VuZCh0aGlzLmhlaWdodC8yKV1bTWF0aC5yb3VuZCh0aGlzLndpZHRoLzIpXSA9IFN0YXRlLmNhcnJpZXJcbiAgICAgICAgdGhpcy5zdWZmZXJlcnMucHVzaChuZXdTdWZmZXJlcihuZXcgQ29vcmRpbmF0ZShNYXRoLnJvdW5kKHRoaXMuaGVpZ2h0LzIpLCBNYXRoLnJvdW5kKHRoaXMud2lkdGgvMikpKSk7XG5cbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzLnRvdGFsQ291bnQgPSB0aGlzLmhlaWdodCAqIHRoaXMud2lkdGhcbiAgICAgICAgdGhpcy5zdGVwID0gMFxuXG4gICAgICAgIHRoaXMudXBkYXRlU3RhdCgpXG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBsZXQgaW5mZWN0ZWQ6IENvb3JkaW5hdGVbXSA9IFtdXG5cbiAgICAgICAgZm9yIChsZXQgcyBvZiB0aGlzLnN1ZmZlcmVycykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5mZWN0Q2VsbChzLmMudG9wKSkge1xuICAgICAgICAgICAgICAgIGluZmVjdGVkLnB1c2gocy5jLnRvcClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaW5mZWN0Q2VsbChzLmMuYm90dG9tKSkge1xuICAgICAgICAgICAgICAgIGluZmVjdGVkLnB1c2gocy5jLmJvdHRvbSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaW5mZWN0Q2VsbChzLmMubGVmdCkpIHtcbiAgICAgICAgICAgICAgICBpbmZlY3RlZC5wdXNoKHMuYy5sZWZ0KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pbmZlY3RDZWxsKHMuYy5yaWdodCkpIHtcbiAgICAgICAgICAgICAgICBpbmZlY3RlZC5wdXNoKHMuYy5yaWdodClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHMgb2YgdGhpcy5zdWZmZXJlcnMpIHtcbiAgICAgICAgICAgIHMuZGF5cyArPSAxXG5cbiAgICAgICAgICAgIGlmIChzLmRheXMgPT0gdGhpcy5jb25maWcuaW5jdWJhdGlvbkxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHMuc3RhdGUgPSBTdGF0ZS5pbGxcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ob3NwaXRhbGl6ZWQgPCB0aGlzLmNvbmZpZy5ob3NwaXRhbHNDYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgICAgICBzLnN0YXRlID0gU3RhdGUuaG9zcGl0YWxpemVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9zcGl0YWxpemVkICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpc0xhc3REaXNlYXNlRGF5ID0gKHMuZGF5cyA9PSB0aGlzLmNvbmZpZy5kaXNlYXNlTGVuZ3RoICsgdGhpcy5jb25maWcuaW5jdWJhdGlvbkxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgaXNJbGwgPSBzLnN0YXRlID09IFN0YXRlLmlsbCB8fCBzLnN0YXRlID09IFN0YXRlLmhvc3BpdGFsaXplZDtcblxuICAgICAgICAgICAgaWYgKGlzSWxsICYmIGlzTGFzdERpc2Vhc2VEYXkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbW9ydGFsaXR5UHJvYmFiaWxpdHkgPSB0aGlzLmNvbmZpZy5tb3J0YWxpdHlQcm9iYWJpbGl0eVxuICAgICAgICAgICAgICAgIGlmIChzLnN0YXRlID09IFN0YXRlLmhvc3BpdGFsaXplZCkge1xuICAgICAgICAgICAgICAgICAgICBtb3J0YWxpdHlQcm9iYWJpbGl0eSAqPSB0aGlzLmNvbmZpZy5ob3NwaXRhbEZhY3RvclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvc3BpdGFsaXplZCAtPSAxXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPD0gbW9ydGFsaXR5UHJvYmFiaWxpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5zdGF0ZSA9IFN0YXRlLmRlYWRcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzLnN0YXRlID0gU3RhdGUuY3VyZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1ZmZlcmVycy5mb3JFYWNoKChzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndvcmxkW3MuYy54XVtzLmMueV0gPSBzLnN0YXRlXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5zdWZmZXJlcnMgPSB0aGlzLnN1ZmZlcmVycy5maWx0ZXIoKHMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzLnN0YXRlID09IFN0YXRlLmlsbCB8fCBzLnN0YXRlID09IFN0YXRlLmNhcnJpZXIgfHwgcy5zdGF0ZSA9PSBTdGF0ZS5ob3NwaXRhbGl6ZWRcbiAgICAgICAgfSlcblxuICAgICAgICBmb3IgKGxldCBjIG9mIGluZmVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnN1ZmZlcmVycy5wdXNoKG5ld1N1ZmZlcmVyKGMpKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGVwICs9IDFcblxuICAgICAgICBpZiAodGhpcy5zdGVwID09IHRoaXMuY29uZmlnLnF1YXJhbnRpbmVTdGFydCkge1xuICAgICAgICAgICAgdGhpcy5jb25maWcuZGlzZWFzZVByb2JhYmlsaXRpZXMuc2V0KFN0YXRlLmhlYWx0aHksIHRoaXMuY29uZmlnLmRpc2Vhc2VQcm9iYWJpbGl0aWVzLmdldChTdGF0ZS5oZWFsdGh5KSAqIHRoaXMuY29uZmlnLnF1YXJhbnRpbmVGYWN0b3IpO1xuICAgICAgICAgICAgdGhpcy5jb25maWcuZGlzZWFzZVByb2JhYmlsaXRpZXMuc2V0KFN0YXRlLmN1cmVkLCB0aGlzLmNvbmZpZy5kaXNlYXNlUHJvYmFiaWxpdGllcy5nZXQoU3RhdGUuY3VyZWQpICogdGhpcy5jb25maWcucXVhcmFudGluZUZhY3Rvcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXQoKVxuICAgIH1cblxuICAgIGdldCBpc0VsaWdpYmxlRm9yQ29udGludWUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpc3RpY3MuaWxsQ291bnQgPiAwIHx8IHRoaXMuc3RhdGlzdGljcy5jYXJyaWVzQ291bnQgPiAwIHx8IHRoaXMuaG9zcGl0YWxpemVkID4gMFxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU3RhdCgpIHtcbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzLmhlYWx0aHlDb3VudCA9IDBcbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzLmNhcnJpZXNDb3VudCA9IDBcbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzLmlsbENvdW50ID0gMFxuICAgICAgICB0aGlzLnN0YXRpc3RpY3MuY3VyZWRDb3VudCA9IDBcbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzLmRlYWRDb3VudCA9IDBcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyArK2kpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLndvcmxkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuaGVhbHRoeTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGlzdGljcy5oZWFsdGh5Q291bnQgKz0xXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLmNhcnJpZXI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRpc3RpY3MuY2Fycmllc0NvdW50ICs9IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuaWxsLCBTdGF0ZS5ob3NwaXRhbGl6ZWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRpc3RpY3MuaWxsQ291bnQgKz0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5jdXJlZDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGlzdGljcy5jdXJlZENvdW50ICs9IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuZGVhZDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGlzdGljcy5kZWFkQ291bnQgKz0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGluZmVjdENlbGwoYzogQ29vcmRpbmF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoYy54IDwgMCB8fCBjLnkgPCAwIHx8IGMueCA+PSB0aGlzLndpZHRoIHx8IGMueSA+PSB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJvYmFiaWxpdHkgPSB0aGlzLmNvbmZpZy5kaXNlYXNlUHJvYmFiaWxpdGllcy5nZXQodGhpcy53b3JsZFtjLnhdW2MueV0pXG4gICAgICAgIGlmIChwcm9iYWJpbGl0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDw9IHByb2JhYmlsaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFtjLnhdW2MueV0gPSBTdGF0ZS5jYXJyaWVyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9