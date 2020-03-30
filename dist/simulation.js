export var State;
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
            incubationLength: 6,
            diseaseLength: 6,
            mortalityProbability: 0.02,
            diseaseProbabilities: new Map([
                [State.healthy, 0.13],
                [State.cured, 0.01]
            ]),
            quarantineStart: 50,
            quarantineFactor: 0.65,
            hospitalsCapacity: 50,
            hospitalFactor: 0.3
        };
        this.statistics = {
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
        this.statistics.total = this.height * this.width;
        this.step = 0;
        this.updateStat();
    };
    Simulation.prototype.update = function () {
        var _this = this;
        var infected = [];
        for (var _i = 0, _a = this.sufferers; _i < _a.length; _i++) {
            var s = _a[_i];
            var factor = 1;
            if (s.state == State.hospitalized) {
                factor = this.config.hospitalFactor;
            }
            if (this.infectCell(s.c.top, factor)) {
                infected.push(s.c.top);
            }
            if (this.infectCell(s.c.bottom, factor)) {
                infected.push(s.c.bottom);
            }
            if (this.infectCell(s.c.left, factor)) {
                infected.push(s.c.left);
            }
            if (this.infectCell(s.c.right, factor)) {
                infected.push(s.c.right);
            }
        }
        this.statistics.day = { infected: 0, dead: 0 };
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
                var mortalityFactor = 1;
                if (s.state == State.hospitalized) {
                    mortalityFactor = this.config.hospitalFactor;
                    this.hospitalized -= 1;
                }
                if (checkEventWithProbability(mortalityProbability, mortalityFactor)) {
                    s.state = State.dead;
                    this.statistics.day.dead += 1;
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
        this.statistics.day.infected = infected.length;
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
            return this.statistics.ill > 0 || this.statistics.carries > 0 || this.hospitalized > 0;
        },
        enumerable: true,
        configurable: true
    });
    Simulation.prototype.updateStat = function () {
        this.statistics.healthy = 0;
        this.statistics.carries = 0;
        this.statistics.ill = 0;
        this.statistics.cured = 0;
        this.statistics.dead = 0;
        for (var i = 0; i < this.height; ++i) {
            for (var j = 0; j < this.width; ++j) {
                switch (this.world[i][j]) {
                    case State.healthy:
                        this.statistics.healthy += 1;
                        break;
                    case State.carrier:
                        this.statistics.carries += 1;
                        break;
                    case State.ill:
                    case State.hospitalized:
                        this.statistics.ill += 1;
                        break;
                    case State.cured:
                        this.statistics.cured += 1;
                        break;
                    case State.dead:
                        this.statistics.dead += 1;
                        break;
                }
            }
        }
        this.statistics.infected = this.statistics.ill + this.statistics.carries;
    };
    Simulation.prototype.infectCell = function (c, factor) {
        if (c.x < 0 || c.y < 0 || c.x >= this.width || c.y >= this.height) {
            return false;
        }
        var probability = this.config.diseaseProbabilities.get(this.world[c.x][c.y]);
        if (checkEventWithProbability(probability, factor)) {
            this.world[c.x][c.y] = State.carrier;
            return true;
        }
        return false;
    };
    return Simulation;
}());
export { Simulation };
function checkEventWithProbability(p, f) {
    if (typeof p == "undefined") {
        return false;
    }
    var r = Math.random();
    var pf = p * f;
    if (r < pf) {
        return true;
    }
    return false;
}
//# sourceMappingURL=simulation.js.map