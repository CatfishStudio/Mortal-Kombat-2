var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MortalKombat;
(function (MortalKombat) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, {
                enableDebug: false,
                width: Constants.GAME_WIDTH,
                height: Constants.GAME_HEIGHT,
                renderer: Phaser.AUTO,
                parent: 'content',
                transparent: true,
                antialias: true,
                forceSetTimeOut: false
            }) || this;
            _this.state.add(MortalKombat.Boot.Name, MortalKombat.Boot, false);
            _this.state.add(MortalKombat.Preloader.Name, MortalKombat.Preloader, false);
            _this.state.add(MortalKombat.Menu.Name, MortalKombat.Menu, false);
            _this.state.add(MortalKombat.Fighters.Name, MortalKombat.Fighters, false);
            _this.state.add(MortalKombat.Tournament.Name, MortalKombat.Tournament, false);
            _this.state.add(MortalKombat.Level.Name, MortalKombat.Level, false);
            _this.state.add(MortalKombat.GameOver.Name, MortalKombat.GameOver, false);
            return _this;
        }
        Game.getInstance = function () {
            if (MortalKombat.Game.instance === null) {
                Game.instance = new Game();
            }
            return Game.instance;
        };
        Game.prototype.start = function () {
            this.state.start(MortalKombat.Boot.Name);
        };
        Game.instance = null;
        return Game;
    }(Phaser.Game));
    MortalKombat.Game = Game;
})(MortalKombat || (MortalKombat = {}));
var Match3;
(function (Match3) {
    var Timer = /** @class */ (function (_super) {
        __extends(Timer, _super);
        function Timer(game, x, y, imageTablo) {
            var _this = _super.call(this, game, x, y, imageTablo) || this;
            _this.init();
            return _this;
        }
        Timer.prototype.shutdown = function () {
            this.timer.stop(true);
            this.removeChildren();
        };
        Timer.prototype.init = function () {
            this.event = new Phaser.Signal();
            this.count = 10;
            this.timer = this.game.time.create(false);
            this.timer.loop(1000, this.onTimerComplete, this);
            this.timerText = this.game.add.text(75, 55, "0:" + this.count.toString(), { font: "bold 24px arial", fill: "#FFFFFF", align: "left" });
            this.timerText.alpha = 0.7;
            this.addChild(this.timerText);
            this.messageText = this.game.add.text(52, 85, "............................", { font: "bold 12px arial", fill: "#FFFFFF", align: "left" });
            this.messageText.alpha = 0.7;
            this.addChild(this.messageText);
        };
        Timer.prototype.onTimerComplete = function () {
            this.count--;
            if (this.timerText !== undefined && this.timerText !== null) {
                if (this.count > 9)
                    this.timerText.text = "0:" + this.count.toString();
                else
                    this.timerText.text = "0:0" + this.count.toString();
            }
            if (this.count === 0) {
                this.event.dispatch(Timer.TIMER_END);
                this.count = 10;
                //Utilits.Data.debugLog("TIMER:", "ON COMPLETE");
            }
        };
        Timer.prototype.run = function () {
            this.timer.start(this.count);
        };
        Timer.prototype.runTimer = function () {
            this.resetTimer();
            this.run();
            this.status = Timer.STATUS_RUN;
        };
        Timer.prototype.pauseTimer = function (value) {
            if (value === void 0) { value = true; }
            if (value === true)
                this.timer.stop(false);
            else
                this.timer.start(this.count);
            //Utilits.Data.debugLog("TIMER PAUSE:", value);
            this.status = Timer.STATUS_PAUSE;
        };
        Timer.prototype.stopTimer = function () {
            this.timer.stop(false);
            this.count = 10;
            this.setMessage("............................");
            //Utilits.Data.debugLog("TIMER:", "STOP");
            this.status = Timer.STATUS_STOP;
        };
        Timer.prototype.resetTimer = function () {
            this.count = 10;
        };
        Timer.prototype.destroyTimer = function () {
            this.timer.stop(true);
            this.timer.destroy();
            this.count = 0;
            this.setMessage("............................");
            //Utilits.Data.debugLog("TIMER:", "STOP");
            this.status = Timer.STATUS_STOP;
        };
        Timer.prototype.setMessage = function (value) {
            if (this.messageText !== undefined && this.messageText !== null) {
                this.messageText.text = value;
                if (value.length < 10)
                    this.messageText.x = 72;
                else
                    this.messageText.x = 52;
            }
        };
        Timer.prototype.getStatusTimer = function () {
            return this.status;
        };
        Timer.TIMER_END = "timer_end";
        Timer.STATUS_RUN = "status_run";
        Timer.STATUS_PAUSE = "status_pause";
        Timer.STATUS_STOP = "status_stop";
        return Timer;
    }(Phaser.Sprite));
    Match3.Timer = Timer;
})(Match3 || (Match3 = {}));
var Match3;
(function (Match3) {
    var Cell = /** @class */ (function (_super) {
        __extends(Cell, _super);
        function Cell(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this.init();
            return _this;
        }
        Cell.prototype.init = function () {
            this.flastSprite = new Phaser.Sprite(this.game, -45, -25, Atlases.Flash, 0);
            this.flastSprite.alpha = 0;
            this.addChild(this.flastSprite);
            this.animation = this.flastSprite.animations.add(Atlases.Flash, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            this.animation.onComplete.add(this.onComplete, this);
            this.lineStyle(1, 0x000000, 0.85);
            this.beginFill(0x000000, 0.50);
            this.drawRoundedRect(0, 0, Match3.Field.MATCH_CELL_WIDTH, Match3.Field.MATCH_CELL_HEIGHT, 15);
            this.endFill();
        };
        Cell.prototype.onComplete = function (sprite, animation) {
            this.flastSprite.alpha = 0;
        };
        Cell.prototype.flash = function () {
            this.flastSprite.alpha = 1;
            this.animation.play(10, false, false);
        };
        Cell.prototype.changeUnit = function (unitType) {
            this.clear();
            this.lineStyle(1, 0x000000, 0.85);
            if (unitType === Constants.LEG)
                this.beginFill(0xFFFF80, 0.50);
            if (unitType === Constants.HAND)
                this.beginFill(0xFF0000, 0.50);
            if (unitType === Constants.BLOCK)
                this.beginFill(0xFF00FF, 0.50);
            if (unitType === Constants.TWIST)
                this.beginFill(0x00FF80, 0.50);
            if (unitType === Constants.UPPERCUT)
                this.beginFill(0x0080FF, 0.50);
            this.drawRoundedRect(0, 0, Match3.Field.MATCH_CELL_WIDTH, Match3.Field.MATCH_CELL_HEIGHT, 15);
            this.endFill();
        };
        Cell.prototype.defaultCell = function () {
            this.clear();
            this.lineStyle(1, 0x000000, 0.85);
            this.beginFill(0x000000, 0.50);
            this.drawRoundedRect(0, 0, Match3.Field.MATCH_CELL_WIDTH, Match3.Field.MATCH_CELL_HEIGHT, 15);
            this.endFill();
        };
        return Cell;
    }(Phaser.Graphics));
    Match3.Cell = Cell;
})(Match3 || (Match3 = {}));
var Match3;
(function (Match3) {
    var Unit = /** @class */ (function (_super) {
        __extends(Unit, _super);
        function Unit(game, x, y, image) {
            var _this = _super.call(this, game, x, y, image) || this;
            _this.init();
            return _this;
        }
        Unit.prototype.init = function () {
            this.event = new Phaser.Signal();
            this.events.onInputUp.add(this.onClick, this);
        };
        Unit.prototype.onClick = function (sprite, pointer) {
            this.event.dispatch(this);
        };
        return Unit;
    }(Phaser.Button));
    Match3.Unit = Unit;
})(Match3 || (Match3 = {}));
/*
 * https://github.com/CatfishStudio/swq/blob/master/html5/public_html/js/game/match3/match.js
 */
var Match3;
(function (Match3) {
    var Cell = Match3.Cell;
    var Unit = Match3.Unit;
    var Timer = Match3.Timer;
    var Field = /** @class */ (function (_super) {
        __extends(Field, _super);
        function Field(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.updateTransform();
            _this.init();
            _this.createTimers();
            return _this;
        }
        Field.prototype.init = function () {
            this.gameOver = false;
            this.matchSelectUnit1 = null;
            this.matchSelectUnit2 = null;
            this.matchFieldBlocked = false;
            this.modeAI = false;
            this.statusAction = Field.ACTION_PLAYER;
            this.event = new Phaser.Signal();
        };
        Field.prototype.shutdown = function () {
            this.timer.shutdown();
            if (this.tween1 != undefined)
                this.tween1.stop();
            this.tween1 = null;
            if (this.tween2 != undefined)
                this.tween2.stop();
            this.tween2 = null;
            this.removeChildren();
            this.removeAll();
        };
        /* Таймер */
        Field.prototype.createTimers = function () {
            this.timerAI = this.game.time.create(false);
            this.timerAI.loop(1000, this.onTimerComplete, this);
            this.timer = new Timer(this.game, 335, 0, Images.Tablo);
            this.timer.event.add(this.onTimerEnd, this);
            this.addChild(this.timer);
            this.timer.setMessage("Ваш ход");
            this.timer.runTimer();
        };
        Field.prototype.onTimerComplete = function (event) {
            //Utilits.Data.debugLog("timerAI", this.statusAction + " | " + this.matchFieldBlocked);
            if (this.gameOver === true)
                return;
            if (this.tween1 !== undefined && this.tween2 !== undefined) {
                if (this.tween1.isRunning === false && this.tween2.isRunning === false) {
                    this.timerAI.stop();
                    this.matchActionAI();
                }
            }
            else {
                this.timerAI.stop();
                this.matchActionAI();
            }
        };
        Field.prototype.onTimerEnd = function (event) {
            if (this.gameOver === true)
                return;
            if (event === Timer.TIMER_END) {
                this.endTurn();
            }
        };
        Field.prototype.endTurn = function () {
            //Utilits.Data.debugLog("endTurn", this.statusAction);
            if (this.gameOver === true)
                return;
            if (this.statusAction === Field.ACTION_PLAYER) {
                this.timer.setMessage("Ход противника");
                this.statusAction = Field.ACTION_AI;
                this.matchCellColorBack();
                this.matchFieldBlocked = true;
                this.matchSelectUnit1 = null;
                this.matchSelectUnit2 = null;
                this.timerAI.loop(1000, this.onTimerComplete, this);
                this.timerAI.start(1000);
            }
            else {
                this.statusAction = Field.ACTION_PLAYER;
                this.timer.setMessage("Ваш ход");
                this.matchCellColorBack();
                this.matchFieldBlocked = false;
                this.matchSelectUnit1 = null;
                this.matchSelectUnit2 = null;
            }
            this.event.dispatch(null, null, this.statusAction);
        };
        /* Инициализация матриц позиций ================================================================ */
        Field.prototype.initMatchMatrixPosition = function () {
            this.matchMatrixFrontPosition = [];
            this.matchMatrixBackPosition = [];
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                for (var j = 0; j < Field.MATCH_ROWS; j++) {
                    var point = {};
                    point.x = 184 + (Field.MATCH_CELL_WIDTH * i);
                    point.y = 120 + (Field.MATCH_CELL_HEIGHT * j);
                    this.matchMatrixFrontPosition["i" + i + ":j" + j] = point;
                    point = {};
                    point.x = 180 + (Field.MATCH_CELL_WIDTH * i);
                    point.y = -372 + (Field.MATCH_CELL_HEIGHT * j);
                    this.matchMatrixBackPosition["i" + i + ":j" + j] = point;
                }
            }
            //Utilits.Data.debugLog("matchMatrixFrontPosition:", this.matchMatrixFrontPosition);
            //Utilits.Data.debugLog("matchMatrixBackPosition:", this.matchMatrixBackPosition);
        };
        /* Создание игрового поля ====================================================================== */
        Field.prototype.createMatchField = function (valueJSON) {
            this.matchLevelJSON = valueJSON;
            //Utilits.Data.debugLog('matchLevelJSON:', this.matchLevelJSON);
            this.initMatchMatrixPosition();
            this.matchMatrixCell = [];
            this.matchMatrixUnit = [];
            // CELLS
            var index = 0;
            for (var iCell = 0; iCell < Field.MATCH_COLUMNS; iCell++) {
                for (var jCell = 0; jCell < Field.MATCH_ROWS; jCell++) {
                    if (valueJSON.Level.cell[index].cellType !== Field.MATCH_CELL_TYPE_DROP) {
                        var cell = new Cell(this.game, this.matchMatrixFrontPosition["i" + iCell + ":j" + jCell].x, this.matchMatrixFrontPosition["i" + iCell + ":j" + jCell].y);
                        cell.cellType = valueJSON.Level.cell[index].cellType;
                        this.matchMatrixCell["i" + iCell + ":j" + jCell] = cell;
                        this.addChild(this.matchMatrixCell["i" + iCell + ":j" + jCell]);
                    }
                    else {
                        this.matchMatrixCell["i" + iCell + ":j" + jCell] = null;
                    }
                    index++;
                }
            }
            // UNITS
            index = 0;
            for (var iUnit = 0; iUnit < Field.MATCH_COLUMNS; iUnit++) {
                for (var jUnit = 0; jUnit < Field.MATCH_ROWS; jUnit++) {
                    var unit = void 0;
                    var xUnit = this.matchMatrixFrontPosition["i" + iUnit + ":j" + jUnit].x;
                    var yUnit = this.matchMatrixFrontPosition["i" + iUnit + ":j" + jUnit].y;
                    if (valueJSON.Level.cell[index].cellObject !== Field.MATCH_HIT_0) {
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_1) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capShangTsung);
                            unit.unitType = Constants.LEG;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_2) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capJax);
                            unit.unitType = Constants.HAND;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_3) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capMileena);
                            unit.unitType = Constants.BLOCK;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_4) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capRaiden);
                            unit.unitType = Constants.UPPERCUT;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_5) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capReptile);
                            unit.unitType = Constants.TWIST;
                        }
                        unit.name = "i" + iUnit + ":j" + jUnit;
                        unit.interactive = true;
                        unit.buttonMode = true;
                        unit.flagRemove = false;
                        unit.posColumnI = iUnit;
                        unit.posRowJ = jUnit;
                        unit.event.add(this.onMatchUnitClick, this);
                        this.matchMatrixUnit["i" + iUnit + ":j" + jUnit] = unit;
                        this.addChild(this.matchMatrixUnit["i" + iUnit + ":j" + jUnit]);
                    }
                    else {
                        unit = new Unit(this.game, xUnit, yUnit, Images.capShangTsung);
                        unit.name = "i" + iUnit + ":j" + jUnit;
                        unit.unitType = Field.MATCH_HIT_0;
                        unit.flagRemove = false;
                        unit.posColumnI = iUnit;
                        unit.posRowJ = jUnit;
                        this.matchMatrixUnit["i" + iUnit + ":j" + jUnit] = unit;
                    }
                    index++;
                }
            }
        };
        /* Событие: нажатие на юнит */
        Field.prototype.onMatchUnitClick = function (unit) {
            //Utilits.Data.debugLog('onMatchUnitClick: CLICK', unit);
            if (this.matchFieldBlocked === false) {
                this.matchCellColorSelect(unit.unitType, unit.posColumnI, unit.posRowJ);
                if (this.matchSelectUnit1 === null || this.matchSelectUnit1 === undefined) {
                    this.matchSelectUnit1 = unit;
                }
                else {
                    if (this.matchSelectUnit1.name === unit.name) {
                        this.matchCellColorBack();
                        this.matchSelectUnit1 = null;
                        this.matchSelectUnit2 = null;
                        if (this.statusAction === Field.ACTION_PLAYER)
                            this.matchFieldBlocked = false;
                        //Utilits.Data.debugLog('onMatchUnitClick: RESET', [this.matchSelectUnit1, this.matchSelectUnit2]);
                    }
                    else {
                        if (this.matchSelectUnit2 === null || this.matchSelectUnit2 === undefined) {
                            this.matchSelectUnit2 = unit;
                            this.matchExchangeUnits(); // меняем юниты местами
                        }
                    }
                }
            }
            //Utilits.Data.debugLog('onMatchUnitClick: TOTAL', [this.matchSelectUnit1, this.matchSelectUnit2]);
        };
        /* Событие: свайп кристалов */
        Field.prototype.onMatchUnitEndClick = function (unit) {
        };
        /* Определение цвета ячеек Cell игрового поля ================================================= */
        Field.prototype.matchCellColorSelect = function (unitType, colI, rowJ) {
            this.matchMatrixCell["i" + colI + ":j" + rowJ].changeUnit(unitType);
        };
        Field.prototype.matchCellColorBack = function () {
            if (this.matchSelectUnit1 !== null) {
                this.matchMatrixCell["i" + this.matchSelectUnit1.posColumnI + ":j" + this.matchSelectUnit1.posRowJ].defaultCell();
            }
            if (this.matchSelectUnit2 !== null) {
                this.matchMatrixCell["i" + this.matchSelectUnit2.posColumnI + ":j" + this.matchSelectUnit2.posRowJ].defaultCell();
            }
        };
        /* Обмен местами в массиве выбранных пользователем  объектов =================================== */
        Field.prototype.matchExchangeUnits = function () {
            this.playSound();
            this.matchFieldBlocked = true;
            var iUnit1 = this.matchSelectUnit1.posColumnI;
            var jUnit1 = this.matchSelectUnit1.posRowJ;
            var iUnit2 = this.matchSelectUnit2.posColumnI;
            var jUnit2 = this.matchSelectUnit2.posRowJ;
            //Utilits.Data.debugLog("UNITS", [iUnit1, jUnit1, iUnit2, jUnit2]);
            if (iUnit2 > (iUnit1 - 2) && iUnit2 < (iUnit1 + 2)
                && jUnit2 > (jUnit1 - 2) && jUnit2 < (jUnit1 + 2)
                && ((iUnit2 === iUnit1 && jUnit2 !== jUnit1) || (jUnit2 === jUnit1 && iUnit2 !== iUnit1))) {
                this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1] = this.matchSelectUnit2;
                this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1].posColumnI = iUnit1;
                this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1].posRowJ = jUnit1;
                this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1].name = "i" + iUnit1 + ":j" + jUnit1;
                this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2] = this.matchSelectUnit1;
                this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2].posColumnI = iUnit2;
                this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2].posRowJ = jUnit2;
                this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2].name = "i" + iUnit2 + ":j" + jUnit2;
                this.tween1 = this.game.add.tween(this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1]);
                this.tween1.to({ x: this.matchMatrixFrontPosition["i" + iUnit1 + ":j" + jUnit1].x, y: this.matchMatrixFrontPosition["i" + iUnit1 + ":j" + jUnit1].y }, 250, 'Linear');
                this.tween1.onComplete.add(this.onCompleteMatchExchangeUnits, this);
                this.tween2 = this.game.add.tween(this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2]);
                this.tween2.to({ x: this.matchMatrixFrontPosition["i" + iUnit2 + ":j" + jUnit2].x, y: this.matchMatrixFrontPosition["i" + iUnit2 + ":j" + jUnit2].y }, 250, 'Linear');
                this.tween2.onComplete.add(this.onCompleteMatchExchangeUnits, this);
                this.tween1.start();
                this.tween2.start();
                //Utilits.Data.debugLog("matchExchangeUnits", "Tween: START");
            }
            else {
                this.matchCellColorBack();
                this.matchSelectUnitsClear();
            }
        };
        Field.prototype.onCompleteMatchExchangeUnits = function (event) {
            if (this.tween1.isRunning === false && this.tween2.isRunning === false) {
                this.matchCellColorBack();
                this.matchCheckField(false);
                //Utilits.Data.debugLog("onCompleteMatchExchangeUnits", "Tween: STOP");
            }
        };
        Field.prototype.matchBackExchangeUnits = function () {
            this.playSound();
            var iUnit1 = this.matchSelectUnit1.posColumnI;
            var jUnit1 = this.matchSelectUnit1.posRowJ;
            var iUnit2 = this.matchSelectUnit2.posColumnI;
            var jUnit2 = this.matchSelectUnit2.posRowJ;
            this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1] = this.matchSelectUnit2;
            this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1].posColumnI = iUnit1;
            this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1].posRowJ = jUnit1;
            this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1].name = "i" + iUnit1 + ":j" + jUnit1;
            this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2] = this.matchSelectUnit1;
            this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2].posColumnI = iUnit2;
            this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2].posRowJ = jUnit2;
            this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2].name = "i" + iUnit2 + ":j" + jUnit2;
            this.tween1 = this.game.add.tween(this.matchMatrixUnit["i" + iUnit1 + ":j" + jUnit1]);
            this.tween1.to({ x: this.matchMatrixFrontPosition["i" + iUnit1 + ":j" + jUnit1].x, y: this.matchMatrixFrontPosition["i" + iUnit1 + ":j" + jUnit1].y }, 250, 'Linear');
            this.tween1.onComplete.add(this.matchSelectUnitsClear, this);
            this.tween2 = this.game.add.tween(this.matchMatrixUnit["i" + iUnit2 + ":j" + jUnit2]);
            this.tween2.to({ x: this.matchMatrixFrontPosition["i" + iUnit2 + ":j" + jUnit2].x, y: this.matchMatrixFrontPosition["i" + iUnit2 + ":j" + jUnit2].y }, 250, 'Linear');
            this.tween2.onComplete.add(this.matchSelectUnitsClear, this);
            this.tween1.start();
            this.tween2.start();
            //Utilits.Data.debugLog("matchBackExchangeUnits", "Tween: START");
        };
        Field.prototype.matchSelectUnitsClear = function () {
            if (this.tween1 === undefined || this.tween2 === undefined) {
                this.matchSelectUnit1 = null;
                this.matchSelectUnit2 = null;
                if (this.statusAction === Field.ACTION_PLAYER)
                    this.matchFieldBlocked = false;
            }
            else {
                if (this.tween1.isRunning === false && this.tween2.isRunning === false) {
                    this.matchSelectUnit1 = null;
                    this.matchSelectUnit2 = null;
                    if (this.statusAction === Field.ACTION_PLAYER)
                        this.matchFieldBlocked = false;
                    //Utilits.Data.debugLog("matchSelectUnitsClear", "Tween: STOP");
                }
            }
        };
        /* Поиск групп ============================================================================== */
        Field.prototype.matchCheckField = function (afterDown) {
            if (this.parent !== null) {
                this.matchMoveDownProcesses = [];
                if (this.matchCheckFieldFull()) // группы были найдены
                 {
                    this.timer.stopTimer(); // останавливаем таймер
                    this.matchMoveDownUnits(); // спускаем юниты
                }
                else { // группы не найдены
                    if (afterDown === false) // первый спуск юнитов
                     {
                        this.matchBackExchangeUnits(); // возвращаем выбранные юниты на места
                    }
                    else {
                        //this.matchSelectUnitsClear();   // очистка и разблокировка поля
                        this.timerAI.stop();
                        this.endTurn();
                        this.timer.runTimer(); // запускаем таймер
                    }
                }
            }
            else {
                // УДАЛЯЕТСЯ ТРИ В РЯД ЕСЛИ НЕТ УРОВНЯ
                this.shutdown();
            }
        };
        /* Общая проверка колонок и строк (3-и и более в ряд) */
        Field.prototype.matchCheckFieldFull = function () {
            var resultCheck = false;
            /* i - столбец; j - строка */
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                if (this.matchCheckColumn(i) === true)
                    resultCheck = true;
            }
            for (var j = 0; j < Field.MATCH_ROWS; j++) {
                if (this.matchCheckRow(j) === true)
                    resultCheck = true;
            }
            return resultCheck;
        };
        /* Проверка колонки (3-и и более в ряд) */
        Field.prototype.matchCheckColumn = function (column) {
            var resultCheckColumn = false;
            /* просматриваем  в столбце (по строкам) */
            for (var j = 0; j < Field.MATCH_ROWS; j++) {
                if (j < Field.MATCH_ROWS - 2) {
                    if (this.matchMatrixUnit["i" + column + ":j" + j].unitType !== Field.MATCH_HIT_0) {
                        /* Группа из 3-х объектов */
                        if (this.matchMatrixUnit["i" + column + ":j" + j].unitType === this.matchMatrixUnit["i" + column + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + column + ":j" + j].unitType === this.matchMatrixUnit["i" + column + ":j" + (j + 2)].unitType) {
                            resultCheckColumn = true;
                            /* Группа из 4-х кристалов */
                            if (j < Field.MATCH_ROWS - 3) {
                                if (this.matchMatrixUnit["i" + column + ":j" + j].unitType === this.matchMatrixUnit["i" + column + ":j" + (j + 3)].unitType) {
                                    /* Группа из 5-ти кристалов */
                                    if (j < Field.MATCH_ROWS - 4) {
                                        if (this.matchMatrixUnit["i" + column + ":j" + j].unitType === this.matchMatrixUnit["i" + column + ":j" + (j + 4)].unitType) {
                                            /* Удаляем группу из 5 юнитов */
                                            this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i" + column + ":j" + j].unitType, 5);
                                            j += 2;
                                        }
                                        else {
                                            /* Удаляем группу из 4 юнитов */
                                            this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i" + column + ":j" + j].unitType, 4);
                                            j += 1;
                                        }
                                    }
                                    else {
                                        /* Удаляем группу из 4 юнитов */
                                        this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i" + column + ":j" + j].unitType, 4);
                                        j += 1;
                                    }
                                }
                                else {
                                    /* Удаляем группу из 3 юнитов */
                                    this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i" + column + ":j" + j].unitType, 3);
                                }
                            }
                            else {
                                /* Удаляем группу из 3 юнитов */
                                this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i" + column + ":j" + j].unitType, 3);
                            }
                        }
                    }
                }
                else {
                    break;
                }
            }
            return resultCheckColumn;
        };
        /* Проверка строки (3-и и более в ряд) */
        Field.prototype.matchCheckRow = function (row) {
            var resultCheckRow = false;
            /* просматриваем в строке (по столбцам) */
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                if (i < Field.MATCH_COLUMNS - 2) {
                    if (this.matchMatrixUnit["i" + i + ":j" + row].unitType !== Field.MATCH_HIT_0) {
                        /* Группа из 3-х объектов */
                        if (this.matchMatrixUnit["i" + i + ":j" + row].unitType === this.matchMatrixUnit["i" + (i + 1) + ":j" + row].unitType && this.matchMatrixUnit["i" + i + ":j" + row].unitType === this.matchMatrixUnit["i" + (i + 2) + ":j" + row].unitType) {
                            resultCheckRow = true;
                            /* Группа из 4-х кристалов */
                            if (i < Field.MATCH_COLUMNS - 3) {
                                if (this.matchMatrixUnit["i" + i + ":j" + row].unitType === this.matchMatrixUnit["i" + (i + 3) + ":j" + row].unitType) {
                                    /* Группа из 5-ти кристалов */
                                    if (i < Field.MATCH_COLUMNS - 4) {
                                        if (this.matchMatrixUnit["i" + i + ":j" + row].unitType === this.matchMatrixUnit["i" + (i + 4) + ":j" + row].unitType) {
                                            /* Удаляем группу из 5 юнитов */
                                            this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i" + i + ":j" + row].unitType, 5);
                                            i += 2;
                                        }
                                        else {
                                            /* Удаляем группу из 4 юнитов */
                                            this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i" + i + ":j" + row].unitType, 4);
                                            i += 1;
                                        }
                                    }
                                    else {
                                        /* Удаляем группу из 4 юнитов */
                                        this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i" + i + ":j" + row].unitType, 4);
                                        i += 1;
                                    }
                                }
                                else {
                                    /* Удаляем группу из 3 юнитов */
                                    this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i" + i + ":j" + row].unitType, 3);
                                }
                            }
                            else {
                                /* Удаляем группу из 3 юнитов */
                                this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i" + i + ":j" + row].unitType, 3);
                            }
                        }
                    }
                }
                else {
                    break;
                }
            }
            return resultCheckRow;
        };
        /* Удаление юнитов */
        Field.prototype.matchRemoveUnit = function (col, row, check, hitType, hitCount) {
            this.event.dispatch(hitType, hitCount, this.statusAction); // возвращаем событие в Level
            if (check === "row") {
                if (hitCount === 3) {
                    this.matchMatrixUnit["i" + col + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + row].flash();
                    this.matchMatrixUnit["i" + col + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.x = this.matchMatrixBackPosition["i" + col + ":j" + row].x;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.y = this.matchMatrixBackPosition["i" + col + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 1) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 1) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 1) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 1) + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 2) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 2) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 2) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 2) + ":j" + row] = true;
                }
                if (hitCount === 4) {
                    this.matchMatrixUnit["i" + col + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + row].flash();
                    this.matchMatrixUnit["i" + col + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.x = this.matchMatrixBackPosition["i" + col + ":j" + row].x;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.y = this.matchMatrixBackPosition["i" + col + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 1) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 1) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 1) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 1) + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 2) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 2) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 2) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 2) + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 3) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 3) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 3) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 3) + ":j" + row] = true;
                }
                if (hitCount === 5) {
                    this.matchMatrixUnit["i" + col + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + row].flash();
                    this.matchMatrixUnit["i" + col + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.x = this.matchMatrixBackPosition["i" + col + ":j" + row].x;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.y = this.matchMatrixBackPosition["i" + col + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 1) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 1) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 1) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 1) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 1) + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 2) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 2) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 2) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 2) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 2) + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 3) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 3) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 3) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 3) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 3) + ":j" + row] = true;
                    this.matchMatrixUnit["i" + (col + 4) + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + (col + 4) + ":j" + row].flash();
                    this.matchMatrixUnit["i" + (col + 4) + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + (col + 4) + ":j" + row].position.x = this.matchMatrixBackPosition["i" + (col + 4) + ":j" + row].x;
                    this.matchMatrixUnit["i" + (col + 4) + ":j" + row].position.y = this.matchMatrixBackPosition["i" + (col + 4) + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + (col + 4) + ":j" + row] = true;
                }
            }
            if (check === "col") {
                if (hitCount === 3) {
                    this.matchMatrixUnit["i" + col + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + row].flash();
                    this.matchMatrixUnit["i" + col + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.x = this.matchMatrixBackPosition["i" + col + ":j" + row].x;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.y = this.matchMatrixBackPosition["i" + col + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + row] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 1)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 1)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 1)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 1)] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 2)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 2)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 2)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 2)] = true;
                }
                if (hitCount === 4) {
                    this.matchMatrixUnit["i" + col + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + row].flash();
                    this.matchMatrixUnit["i" + col + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.x = this.matchMatrixBackPosition["i" + col + ":j" + row].x;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.y = this.matchMatrixBackPosition["i" + col + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + row] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 1)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 1)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 1)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 1)] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 2)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 2)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 2)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 2)] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 3)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 3)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 3)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 3)] = true;
                }
                if (hitCount === 5) {
                    this.matchMatrixUnit["i" + col + ":j" + row].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + row].flash();
                    this.matchMatrixUnit["i" + col + ":j" + row].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.x = this.matchMatrixBackPosition["i" + col + ":j" + row].x;
                    this.matchMatrixUnit["i" + col + ":j" + row].position.y = this.matchMatrixBackPosition["i" + col + ":j" + row].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + row] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 1)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 1)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 1)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 1)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 1)] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 2)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 2)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 2)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 2)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 2)] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 3)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 3)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 3)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 3)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 3)] = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 4)].alpha = 0.0;
                    this.matchMatrixCell["i" + col + ":j" + (row + 4)].flash();
                    this.matchMatrixUnit["i" + col + ":j" + (row + 4)].flagRemove = true;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 4)].position.x = this.matchMatrixBackPosition["i" + col + ":j" + (row + 4)].x;
                    this.matchMatrixUnit["i" + col + ":j" + (row + 4)].position.y = this.matchMatrixBackPosition["i" + col + ":j" + (row + 4)].y;
                    this.matchMoveDownProcesses["i" + col + ":j" + (row + 4)] = true;
                }
            }
        };
        /* Спуск юнитов вниз на свободные позиции */
        Field.prototype.matchMoveDownUnits = function () {
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                for (var j = Field.MATCH_ROWS - 1; j >= 0; j--) {
                    if (this.matchMatrixUnit["i" + i + ":j" + j].flagRemove === true && this.matchMatrixUnit["i" + i + ":j" + j].unitType !== Field.MATCH_HIT_0) {
                        for (var k = j; k >= 0; k--) {
                            if (this.matchMatrixUnit["i" + i + ":j" + k].flagRemove === false && this.matchMatrixUnit["i" + i + ":j" + k].unitType !== Field.MATCH_HIT_0) {
                                var removeUnit = this.matchMatrixUnit["i" + i + ":j" + j]; // удалённый юнит
                                this.matchMatrixUnit["i" + i + ":j" + j] = this.matchMatrixUnit["i" + i + ":j" + k]; // перемещаем не удалённый юнит
                                this.matchMatrixUnit["i" + i + ":j" + j].name = "i" + i + ":j" + j;
                                this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                                this.matchMatrixUnit["i" + i + ":j" + j].posColumnI = i;
                                this.matchMatrixUnit["i" + i + ":j" + j].posRowJ = j;
                                this.matchMoveDownProcesses["i" + i + ":j" + j] = true;
                                this.matchMatrixUnit["i" + i + ":j" + k] = removeUnit; // удалённый юнит ставим на место перемещённой
                                this.matchMatrixUnit["i" + i + ":j" + k].name = "i" + i + ":j" + k;
                                this.matchMatrixUnit["i" + i + ":j" + k].flagRemove = true;
                                this.matchMatrixUnit["i" + i + ":j" + k].posColumnI = i;
                                this.matchMatrixUnit["i" + i + ":j" + k].posRowJ = k;
                                this.matchMoveDownProcesses["i" + i + ":j" + k] = true;
                                break;
                            }
                        }
                    }
                }
            }
            this.matchMoveDownNewUnits();
        };
        Field.prototype.onCompleteMatchMoveDownUnits = function () {
            this.matchMoveDownNewUnits();
        };
        Field.prototype.matchMoveDownNewUnits = function () {
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                for (var j = Field.MATCH_ROWS - 1; j >= 0; j--) {
                    if (this.matchMoveDownProcesses["i" + i + ":j" + j] === true && this.matchMatrixUnit["i" + i + ":j" + j].flagRemove === false && this.matchMatrixUnit["i" + i + ":j" + j].unitType !== Field.MATCH_HIT_0) {
                        this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                        this.tweenDown = this.game.add.tween(this.matchMatrixUnit["i" + i + ":j" + j]);
                        this.tweenDown.to({ x: this.matchMatrixFrontPosition["i" + i + ":j" + j].x, y: this.matchMatrixFrontPosition["i" + i + ":j" + j].y, alpha: 1.0 }, 500);
                        this.tweenDown.to({ x: this.matchMatrixFrontPosition["i" + i + ":j" + j].x, y: this.matchMatrixFrontPosition["i" + i + ":j" + j].y - 5 }, 100);
                        this.tweenDown.to({ x: this.matchMatrixFrontPosition["i" + i + ":j" + j].x, y: this.matchMatrixFrontPosition["i" + i + ":j" + j].y }, 50);
                        this.tweenDown.onComplete.add(this.onCompleteMatchMoveDownNewUnits, this);
                        this.tweenDown.start();
                    }
                    else {
                        if (this.matchMoveDownProcesses["i" + i + ":j" + j] === true && this.matchMatrixUnit["i" + i + ":j" + j].flagRemove === true && this.matchMatrixUnit["i" + i + ":j" + j].unitType !== Field.MATCH_HIT_0) {
                            var indexRandom = Math.random() / 0.1;
                            var index = Math.round(indexRandom);
                            if (index >= 0 && index <= 2) {
                                this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capShangTsung);
                                this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.LEG;
                                this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                            }
                            if (index > 2 && index <= 4) {
                                this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capJax);
                                this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.HAND;
                                this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                            }
                            if (index > 4 && index <= 6) {
                                this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capMileena);
                                this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.BLOCK;
                                this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                            }
                            if (index > 6 && index <= 8) {
                                this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capRaiden);
                                this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.UPPERCUT;
                                this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                            }
                            if (index > 8 && index <= 10) {
                                this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capReptile);
                                this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.TWIST;
                                this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                            }
                            this.tweenDown = this.game.add.tween(this.matchMatrixUnit["i" + i + ":j" + j]);
                            this.tweenDown.to({ x: this.matchMatrixFrontPosition["i" + i + ":j" + j].x, y: this.matchMatrixFrontPosition["i" + i + ":j" + j].y, alpha: 1.0 }, 500);
                            this.tweenDown.to({ x: this.matchMatrixFrontPosition["i" + i + ":j" + j].x, y: this.matchMatrixFrontPosition["i" + i + ":j" + j].y - 5 }, 100);
                            this.tweenDown.to({ x: this.matchMatrixFrontPosition["i" + i + ":j" + j].x, y: this.matchMatrixFrontPosition["i" + i + ":j" + j].y }, 50);
                            this.tweenDown.onComplete.add(this.onCompleteMatchMoveDownNewUnits, this);
                            this.tweenDown.start();
                        }
                    }
                }
            }
        };
        Field.prototype.onCompleteMatchMoveDownNewUnits = function (unit) {
            //Utilits.Data.debugLog("onCompleteMatchMoveDownNewUnits", unit.name);
            if (this.matchMoveDownProcesses !== undefined) {
                var result = false;
                this.matchMoveDownProcesses[unit.name] = false;
                //Utilits.Data.debugLog("onCompleteMatchMoveDownNewUnits", this.matchMoveDownProcesses);
                for (var key in this.matchMoveDownProcesses) {
                    var value = this.matchMoveDownProcesses[key];
                    //Utilits.Data.debugLog("onCompleteMatchMoveDownNewUnits", key.toString() + ": " + value.toString());
                    if (value === true) {
                        result = true;
                        break;
                    }
                }
                //Utilits.Data.debugLog("onCompleteMatchMoveDownNewUnits", result);
                if (result === false) // анимация завершена
                 {
                    if (this.matchCheckCombinations() === true) // Возможные ходы определены
                     {
                        this.matchCheckField(true); // проверка групп 3-и в ряд
                    }
                    else { // нет возможности ходов
                        this.matchUpdateField(); // обновление игрового поля
                    }
                }
            }
        };
        Field.prototype.matchCheckCombinations = function () {
            /*	   0  1  2  3  4  5
            * 	0:[0][0][0][0][1][0]
                1:[0][0][1][1][0][1]
                2:[0][0][0][0][1][0]
                3:[0][0][0][0][0][0]
                4:[0][0][0][0][0][0]
                5:[0][0][0][0][0][0]
             * */
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                for (var j = 0; j < Field.MATCH_ROWS; j++) {
                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0) {
                        // ПРОВЕРКА СТРОКИ
                        if (j == 0) {
                            //[1][1][X][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1][X][1][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][1][X][1]
                            //[0][0][1][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][1][1][X]
                            //[0][0][0][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][X][1][1]
                            //[0][1][0][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                        }
                        else {
                            //[1][1][X][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1][X][1][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][1][1][X]
                            //[0][0][0][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][0][0][1]
                            //[0][1][1][X]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + (j - 1)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j - 1)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][X][1][1]
                            //[0][1][0][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][1][0][0]
                            //[0][X][1][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][0][1][0]
                            //[0][1][X][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j - 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j - 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][1][X][1]
                            //[0][0][1][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        return true;
                                    }
                                }
                            }
                        }
                        // ПРОВЕРКА КОЛОНКИ
                        if (i == 0) {
                            //[1]
                            //[1]
                            //[X]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1]
                            //[X]
                            //[1]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1][0]
                            //[X][1]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1][0]
                            //[1][0]
                            //[X][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[X][1]
                            //[1][0]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                        }
                        else {
                            //[1]
                            //[1]
                            //[X]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1]
                            //[X]
                            //[1]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1][0]
                            //[X][1]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][1]
                            //[1][X]
                            //[0][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1][0]
                            //[1][0]
                            //[X][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[X][1]
                            //[1][0]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[0][1]
                            //[0][1]
                            //[1][X]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                            //[1][X]
                            //[0][1]
                            //[0][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i - 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + (i - 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + (i - 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };
        Field.prototype.matchUpdateField = function () {
            this.matchMoveDownProcesses = [];
            var indexRandom = Math.random() / 0.1;
            var indexLevel = Math.round(indexRandom);
            var valueJSON = this.game.cache.getJSON(GameData.Data.levels[indexLevel][1]);
            var index = 0;
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                for (var j = 0; j < Field.MATCH_ROWS; j++) {
                    if (this.matchLevelJSON.Level.cell[index].cellObject !== Field.MATCH_HIT_0) {
                        this.matchMatrixUnit["i" + i + ":j" + j].flagRemove = false;
                        this.matchMatrixUnit["i" + i + ":j" + j].position.x = this.matchMatrixBackPosition["i" + i + ":j" + j].x;
                        this.matchMatrixUnit["i" + i + ":j" + j].position.y = this.matchMatrixBackPosition["i" + i + ":j" + j].y;
                        this.matchMoveDownProcesses["i" + i + ":j" + j] = true;
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_1) {
                            this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capShangTsung);
                            this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.LEG;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_2) {
                            this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capJax);
                            this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.HAND;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_3) {
                            this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capMileena);
                            this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.BLOCK;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_4) {
                            this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capRaiden);
                            this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.UPPERCUT;
                        }
                        if (valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_5) {
                            this.matchMatrixUnit["i" + i + ":j" + j].loadTexture(Images.capReptile);
                            this.matchMatrixUnit["i" + i + ":j" + j].unitType = Constants.TWIST;
                        }
                        /* Спускаем удалённые юниты */
                        this.tweenDown = this.game.add.tween(this.matchMatrixUnit["i" + i + ":j" + j]);
                        this.tweenDown.to({ x: this.matchMatrixFrontPosition["i" + i + ":j" + j].x, y: this.matchMatrixFrontPosition["i" + i + ":j" + j].y, alpha: 1.0 }, 500);
                        this.tweenDown.onComplete.add(this.onCompleteMatchMoveDownNewUnits, this.matchMatrixUnit["i" + i + ":j" + j]);
                        this.tweenDown.start();
                        /* Возвращаем цвет ячейки по умолчанию */
                        this.matchMatrixCell["i" + i + ":j" + j].defaultCell();
                    }
                    index++;
                }
            }
            if (this.timer.getStatusTimer() === Timer.STATUS_STOP) {
                this.endTurn();
                this.timer.runTimer();
            }
        };
        /* Ход искусственного интеллекта ============================================================== */
        Field.prototype.matchGetPriorityUnit = function (unitType) {
            if (unitType === Constants.LEG) {
                return 1;
            }
            if (unitType === Constants.HAND) {
                return 2;
            }
            if (unitType === Constants.BLOCK) {
                var typeRandom = Math.random() / 0.1;
                var uType = Math.round(typeRandom);
                return uType;
            }
            if (unitType === Constants.UPPERCUT) {
                return 4;
            }
            if (unitType === Constants.TWIST) {
                return 5;
            }
            return 0;
        };
        Field.prototype.matchActionAI = function () {
            /*	   0  1  2  3  4  5
            * 	0:[0][0][0][0][1][0]
                1:[0][0][1][1][0][1]
                2:[0][0][0][0][1][0]
                3:[0][0][0][0][0][0]
                4:[0][0][0][0][0][0]
                5:[0][0][0][0][0][0]
             * */
            var priorityUnit = 0;
            var lastpriorityUnit = 0;
            for (var i = 0; i < Field.MATCH_COLUMNS; i++) {
                for (var j = 0; j < Field.MATCH_ROWS; j++) {
                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0) {
                        // ПРОВЕРКА СТРОКИ
                        if (j == 0) {
                            //[1][1][X][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 2) + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 3) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1][X][1][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][1][X][1]
                            //[0][0][1][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 1) + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][1][1][X]
                            //[0][0][0][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 2) + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][X][1][1]
                            //[0][1][0][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            //[1][1][X][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 2) + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 3) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1][X][1][1]
                            if ((i + 3) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 3) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][1][1][X]
                            //[0][0][0][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 2) + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][0][0][1]
                            //[0][1][1][X]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + (j - 1)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j - 1)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 2) + ":j" + (j - 1)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 2) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][X][1][1]
                            //[0][1][0][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][1][0][0]
                            //[0][X][1][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + (j + 1)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][0][1][0]
                            //[0][1][X][1]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j - 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j - 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 1) + ":j" + (j - 1)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][1][X][1]
                            //[0][0][1][0]
                            if ((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 2) + ":j" + j].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i + 1) + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                        }
                        // ПРОВЕРКА КОЛОНКИ
                        if (i == 0) {
                            //[1]
                            //[1]
                            //[X]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + (j + 2)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 3)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1]
                            //[X]
                            //[1]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1][0]
                            //[X][1]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1][0]
                            //[1][0]
                            //[X][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + (j + 2)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[X][1]
                            //[1][0]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            //[1]
                            //[1]
                            //[X]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + (j + 2)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 3)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1]
                            //[X]
                            //[1]
                            //[1]
                            if ((j + 3) < Field.MATCH_ROWS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 3)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1][0]
                            //[X][1]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][1]
                            //[1][X]
                            //[0][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 1)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 1)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1][0]
                            //[1][0]
                            //[X][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + (j + 2)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + (j + 2)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[X][1]
                            //[1][0]
                            //[1][0]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + (i + 1) + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + (i + 1) + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[0][1]
                            //[0][1]
                            //[1][X]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + i + ":j" + j].unitType == this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + i + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i - 1) + ":j" + (j + 2)];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + (j + 2)];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                            //[1][X]
                            //[0][1]
                            //[0][1]
                            //[0][0]
                            if ((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0) {
                                if (this.matchMatrixUnit["i" + i + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + (i - 1) + ":j" + j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType != Field.MATCH_HIT_0) {
                                    if (this.matchMatrixUnit["i" + (i - 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 1)].unitType && this.matchMatrixUnit["i" + (i - 1) + ":j" + j].unitType == this.matchMatrixUnit["i" + i + ":j" + (j + 2)].unitType) {
                                        priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i" + (i - 1) + ":j" + j].unitType);
                                        if (priorityUnit > lastpriorityUnit) {
                                            this.matchSelectUnit1 = this.matchMatrixUnit["i" + (i - 1) + ":j" + j];
                                            this.matchSelectUnit2 = this.matchMatrixUnit["i" + i + ":j" + j];
                                            lastpriorityUnit = priorityUnit;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.matchSelectUnit1 !== null && this.matchSelectUnit2 !== null) {
                this.matchExchangeUnits(); // меняем юниты местами
            }
            else {
                this.matchActionAI();
            }
        };
        Field.prototype.isGameOver = function () {
            this.gameOver = true;
            this.matchFieldBlocked = true;
            this.timerAI.stop(true);
            this.timerAI.destroy();
            this.timer.destroyTimer();
            this.timer.event.remove(this.onTimerEnd);
            this.removeChild(this.timer);
            //Utilits.Data.debugLog("GAME:", "OVER");
        };
        Field.prototype.timerPause = function (status) {
            this.timer.pauseTimer(status);
        };
        Field.prototype.playSound = function () {
            if (Config.settingSound) {
                GameData.Data.iconSound.loop = false;
                GameData.Data.iconSound.volume = 1.0;
                GameData.Data.iconSound.play();
            }
        };
        Field.MATCH_COLUMNS = 6;
        Field.MATCH_ROWS = 6;
        Field.MATCH_CELL_WIDTH = 82;
        Field.MATCH_CELL_HEIGHT = 82;
        Field.MATCH_CELL_TYPE_DROP = "CELL_TYPE_DROP";
        Field.MATCH_CELL_TYPE_CLEAR = "CELL_TYPE_CLEAR";
        Field.MATCH_CELL_TYPE_EMPTY = "CELL_TYPE_EMPTY";
        Field.MATCH_HIT_0 = "HIT_0";
        Field.MATCH_HIT_1 = "HIT_1";
        Field.MATCH_HIT_2 = "HIT_2";
        Field.MATCH_HIT_3 = "HIT_3";
        Field.MATCH_HIT_4 = "HIT_4";
        Field.MATCH_HIT_5 = "HIT_5";
        Field.ACTION_PLAYER = "action_player";
        Field.ACTION_AI = "action_ai";
        return Field;
    }(Phaser.Group));
    Match3.Field = Field;
})(Match3 || (Match3 = {}));
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.GAME_WIDTH = 860;
    Constants.GAME_HEIGHT = 730;
    Constants.START = 'start';
    Constants.BACK_MENU = 'back_menu';
    Constants.SETTINGS = 'settings';
    Constants.SETTINGS_CLOSE = 'settings_close';
    Constants.HELP = 'help';
    Constants.HELP_CLOSE = 'help_close';
    Constants.SELECT_FIGHTER = 'select_fighter';
    Constants.SOUND = 'sound';
    Constants.MUSIC = 'music';
    Constants.TUTORIAL = 'tutorial';
    Constants.INVITE = 'invite';
    Constants.CONTINUE = 'continue';
    Constants.SURRENDER = 'surrender';
    Constants.CLOSE = 'close';
    Constants.ANIMATION_TYPE_STANCE = "animation_type_stance";
    Constants.ANIMATION_TYPE_BLOCK = "animation_type_block";
    Constants.ANIMATION_TYPE_HIT_HAND = "animation_type_hit_hand";
    Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT = "animation_type_hit_hand_uppercut";
    Constants.ANIMATION_TYPE_HIT_LEG = "animation_type_hit_leg";
    Constants.ANIMATION_TYPE_HIT_LEG_TWIST = "animation_type_hit_leg_twist";
    Constants.ANIMATION_TYPE_DAMAGE = "animation_type_damage";
    Constants.ANIMATION_TYPE_LOSE = "animation_type_lose";
    Constants.ANIMATION_TYPE_WIN = "animation_type_win";
    Constants.DAMAGE_HAND = 3;
    Constants.DAMAGE_LEG = 5;
    Constants.DAMAGE_BLOCK = 3;
    Constants.DAMAGE_UPPERCUT = 6;
    Constants.DAMAGE_TWIST = 10;
    Constants.MAX_HIT_HAND = 12;
    Constants.MAX_HIT_LEG = 6;
    Constants.MAX_HIT_BLOCK = 12;
    Constants.MAX_HIT_UPPERCUT = 5;
    Constants.MAX_HIT_TWIST = 3;
    Constants.HAND = "hand";
    Constants.LEG = "leg";
    Constants.BLOCK = "block";
    Constants.UPPERCUT = "uppercut";
    Constants.TWIST = "twist";
    Constants.ID_BARAKA = 'baraka';
    Constants.ID_GORO = 'goro';
    Constants.ID_JAX = 'jax';
    Constants.ID_JOHNYCAGE = 'johnnycage';
    Constants.ID_KITANA = 'kitana';
    Constants.ID_KUNGLAO = 'kunglao';
    Constants.ID_LIUKANG = 'liukang';
    Constants.ID_MILEENA = 'mileena';
    Constants.ID_RAIDEN = 'raiden';
    Constants.ID_REPTILE = 'reptile';
    Constants.ID_SCORPION = 'scorpion';
    Constants.ID_SHANGTSUNG = 'shangtsung';
    Constants.ID_SHAOKAHN = 'shaokahn';
    Constants.ID_SUBZERO = 'subzero';
    return Constants;
}());
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.buildDev = false;
    Config.settingSound = true;
    Config.settingMusic = true;
    Config.settingTutorial = true;
    Config.version = "1.0.5";
    return Config;
}());
var Utilits;
(function (Utilits) {
    var Data = /** @class */ (function () {
        function Data() {
        }
        /* Debug отладка */
        Data.debugLog = function (title, value) {
            if (Config.buildDev)
                console.log(title, value);
        };
        /* Проверка четности и нечетности */
        Data.checkEvenOrOdd = function (n) {
            if (n & 1) {
                return false; // odd (нечетное число)
            }
            else {
                return true; // even (четное число)
            }
        };
        /* Генератор случайных чисел */
        Data.getRandomIndex = function () {
            var index = Math.round(Math.random() / 0.1);
            return index;
        };
        /* Генератор случайных чисел из диапазона чисел мин/макс */
        Data.getRandomRangeIndex = function (min, max) {
            max -= min;
            var index = (Math.random() * ++max) + min;
            return Math.floor(index);
        };
        /* Функция перемешивает элементы массива */
        Data.compareRandom = function (a, b) {
            return Math.random() - 0.5;
        };
        return Data;
    }());
    Utilits.Data = Data;
})(Utilits || (Utilits = {}));
var Images = /** @class */ (function () {
    function Images() {
    }
    Images.PreloaderImage = 'preloader.jpg';
    Images.BackgroundImage = 'background.png';
    Images.MenuImage = 'menu.png';
    Images.LogoImage = 'logo.png';
    Images.StartLogoImage = 'start_logo.png';
    Images.FightersImage = 'fighters.png';
    Images.UpgradeImage = 'upgrade.png';
    Images.ButtonOn = 'buttons_on.png';
    Images.ButtonOff = 'buttons_off.png';
    Images.Title = 'title.png';
    Images.ButtonLeft = 'button_left.png';
    Images.ButtonRight = 'button_right.png';
    Images.WindowBackground = 'window_background.png';
    Images.WindowBorder = 'window_border.png';
    Images.WindowBackground2 = 'window_2_background.png';
    Images.WindowBorder2 = 'window_2_border.png';
    Images.capJax = 'jax_cap.png';
    Images.capMileena = 'mileena_cap.png';
    Images.capRaiden = 'raiden_cap.png';
    Images.capReptile = 'reptile_cap.png';
    Images.capShangTsung = 'shangtsung_cap.png';
    Images.towerHeader = 'tower_header.png';
    Images.towerContent = 'tower_content.png';
    Images.towerFooter = 'tower_footer.png';
    Images.ButtonPlus = 'button_plus.png';
    Images.Tablo = 'tablo.png';
    Images.Lifebar = 'life_bar.png';
    Images.fight = 'fight.png';
    Images.wins = 'wins.png';
    Images.died = 'you_died.png';
    Images.game_win = 'game_win.png';
    Images.game_lose = 'game_lose.png';
    Images.BarakaIcon = 'baraka.png';
    Images.GoroIcon = 'goro.png';
    Images.JaxIcon = 'jax.png';
    Images.JohnnyCageIcon = 'johnnycage.png';
    Images.KitanaIcon = 'kitana.png';
    Images.KungLaoIcon = 'kunglao.png';
    Images.LiuKangIcon = 'liukang.png';
    Images.MileenaIcon = 'mileena.png';
    Images.RaidenIcon = 'raiden.png';
    Images.ReptileIcon = 'reptile.png';
    Images.ScorpionIcon = 'scorpion.png';
    Images.ShangTsungIcon = 'shangtsung.png';
    Images.ShaoKahnIcon = 'shaokahn.png';
    Images.SubZeroIcon = 'subzero.png';
    Images.level1 = 'level_1.png';
    Images.level2 = 'level_2.png';
    Images.level3 = 'level_3.png';
    Images.level4 = 'level_4.png';
    Images.level5 = 'level_5.png';
    Images.level6 = 'level_6.png';
    Images.level7 = 'level_7.png';
    Images.level8 = 'level_8.png';
    Images.level9 = 'level_9.png';
    Images.level10 = 'level_10.png';
    Images.level11 = 'level_11.png';
    Images.level12 = 'level_12.png';
    Images.level13 = 'level_13.png';
    Images.preloadList = [
        Images.BackgroundImage,
        Images.MenuImage,
        Images.LogoImage,
        Images.StartLogoImage,
        Images.FightersImage,
        Images.UpgradeImage,
        Images.ButtonOn,
        Images.ButtonOff,
        Images.Title,
        Images.ButtonLeft,
        Images.ButtonRight,
        Images.WindowBackground,
        Images.WindowBorder,
        Images.WindowBackground2,
        Images.WindowBorder2,
        Images.capJax,
        Images.capMileena,
        Images.capRaiden,
        Images.capReptile,
        Images.capShangTsung,
        Images.towerHeader,
        Images.towerContent,
        Images.towerFooter,
        Images.ButtonPlus,
        Images.Tablo,
        Images.Lifebar,
        Images.fight,
        Images.wins,
        Images.died,
        Images.game_win,
        Images.game_lose,
        Images.BarakaIcon,
        Images.GoroIcon,
        Images.JaxIcon,
        Images.JohnnyCageIcon,
        Images.KitanaIcon,
        Images.KungLaoIcon,
        Images.LiuKangIcon,
        Images.MileenaIcon,
        Images.RaidenIcon,
        Images.ReptileIcon,
        Images.ScorpionIcon,
        Images.ShangTsungIcon,
        Images.ShaoKahnIcon,
        Images.SubZeroIcon,
        Images.level1,
        Images.level2,
        Images.level3,
        Images.level4,
        Images.level5,
        Images.level6,
        Images.level7,
        Images.level8,
        Images.level9,
        Images.level10,
        Images.level11,
        Images.level12,
        Images.level13
    ];
    return Images;
}());
var Sounds = /** @class */ (function () {
    function Sounds() {
    }
    Sounds.music_menu = 'music_menu';
    Sounds.music_1 = 'music1';
    Sounds.music_2 = 'music2';
    Sounds.button = 'button';
    Sounds.fight = 'fight';
    Sounds.lost = 'Lost';
    Sounds.wins = 'wins';
    Sounds.hit_1_5 = 'hit_1_5';
    Sounds.hit_2_4 = 'hit_2_4';
    Sounds.hit_block = 'hit_block';
    Sounds.hit_move = 'hit_move';
    Sounds.f_01 = 'f_01';
    Sounds.f_02 = 'f_02';
    Sounds.f_d_03 = 'f_d_03';
    Sounds.m_01 = 'm_01';
    Sounds.m_02 = 'm_02';
    Sounds.m_d_03 = 'm_d_03';
    Sounds.preloadList = [
        Sounds.music_menu,
        Sounds.music_1,
        Sounds.music_2,
        Sounds.button,
        Sounds.fight,
        Sounds.lost,
        Sounds.wins,
        Sounds.hit_1_5,
        Sounds.hit_2_4,
        Sounds.hit_block,
        Sounds.hit_move,
        Sounds.f_01,
        Sounds.f_02,
        Sounds.f_d_03,
        Sounds.m_01,
        Sounds.m_02,
        Sounds.m_d_03
    ];
    return Sounds;
}());
var Atlases = /** @class */ (function () {
    function Atlases() {
    }
    Atlases.LogoAtlas = 'logo_atlas';
    Atlases.Video1 = 'video1';
    Atlases.Video2 = 'video2';
    Atlases.Video3 = 'video3';
    Atlases.VideoHelp = 'video_help';
    Atlases.BarakaAnimation = 'baraka';
    Atlases.GoroAnimation = 'goro';
    Atlases.JaxAnimation = 'jax';
    Atlases.JohnnyCageAnimation = 'johnnycage';
    Atlases.KitanaAnimation = 'kitana';
    Atlases.KungLaoAnimation = 'kunglao';
    Atlases.LiuKangAnimation = 'liukang';
    Atlases.MileenaAnimation = 'mileena';
    Atlases.RaidenAnimation = 'raiden';
    Atlases.ReptileAnimation = 'reptile';
    Atlases.ScorpionAnimation = 'scorpion';
    Atlases.ShangtsungAnimation = 'shangtsung';
    Atlases.ShaokahnAnimation = 'shaokahn';
    Atlases.SubzeroAnimation = 'subzero';
    Atlases.Blood = 'blood';
    Atlases.Flash = 'flash';
    Atlases.preloadList = [
        Atlases.Video1,
        Atlases.Video2,
        Atlases.Video3,
        Atlases.VideoHelp,
        Atlases.Blood,
        Atlases.Flash,
        Atlases.BarakaAnimation,
        Atlases.GoroAnimation,
        Atlases.JaxAnimation,
        Atlases.JohnnyCageAnimation,
        Atlases.KitanaAnimation,
        Atlases.KungLaoAnimation,
        Atlases.LiuKangAnimation,
        Atlases.MileenaAnimation,
        Atlases.RaidenAnimation,
        Atlases.ReptileAnimation,
        Atlases.ScorpionAnimation,
        Atlases.ShangtsungAnimation,
        Atlases.ShaokahnAnimation,
        Atlases.SubzeroAnimation
    ];
    return Atlases;
}());
var Sheet = /** @class */ (function () {
    function Sheet() {
    }
    Sheet.ButtonStartNewGame = 'button_start_new_game_sheet.png';
    Sheet.ButtonСontinueGame = 'button_continue_game_sheet.png';
    Sheet.ButtonSettings = 'button_settings_sheet.png';
    Sheet.ButtonInvite = 'button_invite_sheet.png';
    Sheet.ButtonClose = 'button_close_sheet.png';
    Sheet.ButtonSelectFighter = 'button_select_fighter_sheet.png';
    Sheet.ButtonBackMenuMini = 'button_back_menu_mini_sheet.png';
    Sheet.ButtonBackMini = 'button_back_mini_sheet.png';
    Sheet.ButtonHelpMini = 'button_help_mini_sheet.png';
    Sheet.ButtonStartBattle = 'button_start_battle_sheet.png';
    Sheet.ButtonSurrender = 'button_surrender_sheet.png';
    Sheet.preloadList = [
        Sheet.ButtonStartNewGame,
        Sheet.ButtonСontinueGame,
        Sheet.ButtonSettings,
        Sheet.ButtonInvite,
        Sheet.ButtonClose,
        Sheet.ButtonSelectFighter,
        Sheet.ButtonBackMenuMini,
        Sheet.ButtonBackMini,
        Sheet.ButtonHelpMini,
        Sheet.ButtonStartBattle,
        Sheet.ButtonSurrender
    ];
    return Sheet;
}());
var Characteristics = /** @class */ (function () {
    function Characteristics() {
    }
    Characteristics.barakaJson = 'baraka_json.json';
    Characteristics.goroJson = 'goro_json.json';
    Characteristics.jaxJson = 'jax_json.json';
    Characteristics.johnnycageJson = 'johnnycage_json.json';
    Characteristics.kitanaJson = 'kitana_json.json';
    Characteristics.kunglaoJson = 'kunglao_json.json';
    Characteristics.liukangJson = 'liukang_json.json';
    Characteristics.mileenaJson = 'mileena_json.json';
    Characteristics.raidenJson = 'raiden_json.json';
    Characteristics.reptileJson = 'reptile_json.json';
    Characteristics.scorpionJson = 'scorpion_json.json';
    Characteristics.shangtsungJson = 'shangtsung_json.json';
    Characteristics.shaokahnJson = 'shaokahn_json.json';
    Characteristics.subzeroJson = 'subzero_json.json';
    Characteristics.preloadList = [
        Characteristics.barakaJson,
        Characteristics.goroJson,
        Characteristics.jaxJson,
        Characteristics.johnnycageJson,
        Characteristics.kitanaJson,
        Characteristics.kunglaoJson,
        Characteristics.liukangJson,
        Characteristics.mileenaJson,
        Characteristics.raidenJson,
        Characteristics.reptileJson,
        Characteristics.scorpionJson,
        Characteristics.shangtsungJson,
        Characteristics.shaokahnJson,
        Characteristics.subzeroJson
    ];
    return Characteristics;
}());
var Levels = /** @class */ (function () {
    function Levels() {
    }
    Levels.level0 = "level0.json";
    Levels.level1 = "level1.json";
    Levels.level2 = "level2.json";
    Levels.level3 = "level3.json";
    Levels.level4 = "level4.json";
    Levels.level5 = "level5.json";
    Levels.level6 = "level6.json";
    Levels.level7 = "level7.json";
    Levels.level8 = "level8.json";
    Levels.level9 = "level9.json";
    Levels.level10 = "level10.json";
    Levels.level11 = "level11.json";
    Levels.level12 = "level12.json";
    Levels.level13 = "level13.json";
    Levels.levelsList = [
        Levels.level0,
        Levels.level1,
        Levels.level2,
        Levels.level3,
        Levels.level4,
        Levels.level5,
        Levels.level6,
        Levels.level7,
        Levels.level8,
        Levels.level9,
        Levels.level10,
        Levels.level11,
        Levels.level12,
        Levels.level13
    ];
    return Levels;
}());
var Animations = /** @class */ (function () {
    function Animations() {
    }
    Animations.BarakaJson = 'baraka.json';
    Animations.GoroJson = 'goro.json';
    Animations.JaxJson = 'jax.json';
    Animations.JohnnyCageJson = 'johnnycage.json';
    Animations.KitanaJson = 'kitana.json';
    Animations.KungLaoJson = 'kunglao.json';
    Animations.LiuKangJson = 'liukang.json';
    Animations.MileenaJson = 'mileena.json';
    Animations.RaidenJson = 'raiden.json';
    Animations.ReptileJson = 'reptile.json';
    Animations.ScorpionJson = 'scorpion.json';
    Animations.ShangtsungJson = 'shangtsung.json';
    Animations.ShaokahnJson = 'shaokahn.json';
    Animations.SubzeroJson = 'subzero.json';
    Animations.preloadList = [
        Animations.BarakaJson,
        Animations.GoroJson,
        Animations.JaxJson,
        Animations.JohnnyCageJson,
        Animations.KitanaJson,
        Animations.KungLaoJson,
        Animations.LiuKangJson,
        Animations.MileenaJson,
        Animations.RaidenJson,
        Animations.ReptileJson,
        Animations.ScorpionJson,
        Animations.ShangtsungJson,
        Animations.ShaokahnJson,
        Animations.SubzeroJson
    ];
    return Animations;
}());
var GameData;
(function (GameData) {
    var Data = /** @class */ (function () {
        function Data() {
        }
        /* инициализация персонажей */
        Data.initPersonages = function (game) {
            var _this = this;
            GameData.Data.personages = [];
            var personage;
            Characteristics.preloadList.forEach(function (value) {
                personage = {};
                personage.id = game.cache.getJSON(value).id;
                personage.name = game.cache.getJSON(value).name;
                personage.hand = game.cache.getJSON(value).hand;
                personage.leg = game.cache.getJSON(value).leg;
                personage.block = game.cache.getJSON(value).block;
                personage.uppercut = game.cache.getJSON(value).uppercut;
                personage.twist = game.cache.getJSON(value).twist;
                personage.life = game.cache.getJSON(value).life;
                _this.loadAnimation(game, personage);
                GameData.Data.personages.push(personage);
            });
            Utilits.Data.debugLog("INIT PERSONAGES:", GameData.Data.personages);
        };
        /* инициализация новой игры */
        Data.initNewGame = function () {
            this.user_continue = 9;
            this.user_upgrade_points = 0;
            this.tournamentProgress = 0;
            this.id_enemies = [];
            this.saveData = "";
            var listIDs = [
                Constants.ID_BARAKA,
                Constants.ID_JAX,
                Constants.ID_JOHNYCAGE,
                Constants.ID_KITANA,
                Constants.ID_KUNGLAO,
                Constants.ID_LIUKANG,
                Constants.ID_MILEENA,
                Constants.ID_RAIDEN,
                Constants.ID_REPTILE,
                Constants.ID_SCORPION,
                Constants.ID_SHANGTSUNG,
                Constants.ID_SUBZERO
            ];
            var id;
            while (listIDs.length > 0) {
                id = listIDs.splice(Utilits.Data.getRandomRangeIndex(0, listIDs.length - 1), 1)[0];
                if (id === this.user_personage.id)
                    continue;
                this.id_enemies.push(id);
            }
            this.id_enemies.push(Constants.ID_GORO);
            this.id_enemies.push(Constants.ID_SHAOKAHN);
            Utilits.Data.debugLog("INIT NEW GAME - Tournament List:", this.id_enemies);
            this.enemiesUpgrade();
            this.initLevels();
        };
        /* получить данные персонажа по его ID */
        Data.getNewPersonage = function (personageID) {
            //let personageChange: IPersonage;
            var personageChange = {};
            GameData.Data.personages.forEach(function (personage) {
                if (personage.id === personageID) {
                    //personageChange = personage;
                    personageChange.id = personage.id;
                    personageChange.name = personage.name;
                    personageChange.hand = personage.hand;
                    personageChange.leg = personage.leg;
                    personageChange.block = personage.block;
                    personageChange.uppercut = personage.uppercut;
                    personageChange.twist = personage.twist;
                    personageChange.life = personage.life;
                    personageChange.animStance = personage.animStance;
                    personageChange.animHitHand = personage.animHitHand;
                    personageChange.animHitHandUppercut = personage.animHitHandUppercut;
                    personageChange.animHitLeg = personage.animHitLeg;
                    personageChange.animHitLegTwist = personage.animHitLegTwist;
                    personageChange.animBlock = personage.animBlock;
                    personageChange.animDamage = personage.animDamage;
                    personageChange.animLose = personage.animLose;
                    personageChange.animWin = personage.animWin;
                    return;
                }
            });
            return personageChange;
        };
        /* получить данные персонажа по его ID */
        Data.getPersonage = function (personageID) {
            var personageChange;
            GameData.Data.personages.forEach(function (personage) {
                if (personage.id === personageID) {
                    personageChange = personage;
                    return;
                }
            });
            return personageChange;
        };
        /* загрузка анимаций бойцов
            damage  - damage
            hit1 - hit_leg
            hit2 - hit_hand
            hit3 - block
            hit4 - hit_hand_uppercut
            hit5 - hit_leg_twist
            lost - lose
            stance - stance
            victory - win
        */
        Data.loadAnimation = function (game, personage) {
            try {
                var json = game.cache.getJSON(personage.id + '.json');
                var block = [];
                var damage = [];
                var hit_hand = [];
                var hit_hand_uppercut = [];
                var hit_leg = [];
                var hit_leg_twist = [];
                var lose = [];
                var stance = [];
                var win = [];
                for (var key in json.frames) {
                    if ('block' == key.substr(0, 5))
                        block.push(key);
                    if ('damage' == key.substr(0, 6))
                        damage.push(key);
                    if ('hit_hand' == key.substr(0, 8) && 'hit_hand_uppercut' != key.substr(0, 17))
                        hit_hand.push(key);
                    if ('hit_hand_uppercut' == key.substr(0, 17))
                        hit_hand_uppercut.push(key);
                    if ('hit_leg' == key.substr(0, 7) && 'hit_leg_twist' != key.substr(0, 13))
                        hit_leg.push(key);
                    if ('hit_leg_twist' == key.substr(0, 13))
                        hit_leg_twist.push(key);
                    if ('lose' == key.substr(0, 4))
                        lose.push(key);
                    if ('stance' == key.substr(0, 6))
                        stance.push(key);
                    if ('win' == key.substr(0, 3))
                        win.push(key);
                }
                personage.animBlock = block;
                personage.animDamage = damage;
                personage.animHitHand = hit_hand;
                personage.animHitHandUppercut = hit_hand_uppercut;
                personage.animHitLeg = hit_leg;
                personage.animHitLegTwist = hit_leg_twist;
                personage.animLose = lose;
                personage.animStance = stance;
                personage.animWin = win;
            }
            catch (error) {
                console.log(error);
            }
        };
        /* Прокачка врагов */
        Data.enemiesUpgrade = function () {
            var _this = this;
            var count = 1;
            var personage;
            this.id_enemies.forEach(function (personageID) {
                personage = _this.getPersonage(personageID);
                personage.life = personage.life + (75 * (count - 1));
                for (var i = 0; i < count; i++) {
                    if (_this.checkAccessPersonageUpgrade(personageID) === false) {
                        Utilits.Data.debugLog("NOT AVAILABLE - UPGRADE PERSONAGE CHARACTERISTICS", _this.getPersonage(personageID));
                        continue;
                    }
                    var index = Utilits.Data.getRandomRangeIndex(1, 5);
                    while (index > 0) {
                        if (index === 1) {
                            if (personage.leg < Constants.MAX_HIT_LEG) {
                                personage.leg++;
                                index = 0;
                            }
                        }
                        else if (index === 2) {
                            if (personage.hand < Constants.MAX_HIT_HAND) {
                                personage.hand++;
                                index = 0;
                            }
                        }
                        else if (index === 3) {
                            if (personage.block < Constants.MAX_HIT_BLOCK) {
                                personage.block++;
                                index = 0;
                            }
                        }
                        else if (index === 4) {
                            if (personage.uppercut < Constants.MAX_HIT_UPPERCUT) {
                                personage.uppercut++;
                                index = 0;
                            }
                        }
                        else if (index === 5) {
                            if (personage.twist < Constants.MAX_HIT_TWIST) {
                                personage.twist++;
                                index = 0;
                            }
                        }
                        if (index !== 0)
                            index = Utilits.Data.getRandomRangeIndex(1, 5);
                    }
                }
                count++;
            });
            Utilits.Data.debugLog("UPGRADE ENEMIES", this.personages);
        };
        /* Проверить доступен ли upgrade персонажа */
        Data.checkAccessPersonageUpgrade = function (personageID) {
            var personage;
            personage = this.getPersonage(personageID);
            if (personage.leg < Constants.MAX_HIT_LEG)
                return true;
            if (personage.hand < Constants.MAX_HIT_HAND)
                return true;
            if (personage.block < Constants.MAX_HIT_BLOCK)
                return true;
            if (personage.uppercut < Constants.MAX_HIT_UPPERCUT)
                return true;
            if (personage.twist < Constants.MAX_HIT_TWIST)
                return true;
            return false;
        };
        /* Список уровней */
        Data.initLevels = function () {
            this.levels = [];
            var images = [
                Images.level1, Images.level2, Images.level3, Images.level4, Images.level5, Images.level6, Images.level7,
                Images.level8, Images.level9, Images.level10, Images.level11, Images.level12, Images.level13
            ];
            var files = [
                Levels.level1, Levels.level2, Levels.level3, Levels.level4, Levels.level5, Levels.level6, Levels.level7,
                Levels.level8, Levels.level9, Levels.level10, Levels.level11, Levels.level12, Levels.level13
            ];
            images.sort(Utilits.Data.compareRandom);
            for (var i = 0; i < images.length; i++) {
                var img = images[i];
                var index = Utilits.Data.getRandomRangeIndex(0, files.length - 1);
                var file = files.splice(index, 1);
                this.levels.push([img, file[0]]);
            }
            Utilits.Data.debugLog('LEVELS:', this.levels);
        };
        /* Расчитать урон */
        Data.calcDamage = function (pers, block, hitType, hitCount) {
            var damage = 0;
            if (hitType === Constants.BLOCK)
                return damage;
            if (hitType === Constants.HAND && hitCount === 3)
                damage = pers.hand * Constants.DAMAGE_HAND;
            if (hitType === Constants.HAND && hitCount === 4)
                damage = (pers.hand + 1) * Constants.DAMAGE_HAND;
            if (hitType === Constants.HAND && hitCount >= 5)
                damage = (pers.hand + 2) * Constants.DAMAGE_HAND;
            if (hitType === Constants.LEG && hitCount === 3)
                damage = pers.leg * Constants.DAMAGE_LEG;
            if (hitType === Constants.LEG && hitCount === 4)
                damage = (pers.leg + 1) * Constants.DAMAGE_LEG;
            if (hitType === Constants.LEG && hitCount >= 5)
                damage = (pers.leg + 2) * Constants.DAMAGE_LEG;
            if (hitType === Constants.TWIST && hitCount === 3)
                damage = pers.twist * Constants.DAMAGE_TWIST;
            if (hitType === Constants.TWIST && hitCount === 4)
                damage = (pers.twist + 1) * Constants.DAMAGE_TWIST;
            if (hitType === Constants.TWIST && hitCount >= 5)
                damage = (pers.twist + 2) * Constants.DAMAGE_TWIST;
            if (hitType === Constants.UPPERCUT && hitCount === 3)
                damage = pers.uppercut * Constants.DAMAGE_UPPERCUT;
            if (hitType === Constants.UPPERCUT && hitCount === 4)
                damage = (pers.uppercut + 1) * Constants.DAMAGE_UPPERCUT;
            if (hitType === Constants.UPPERCUT && hitCount >= 5)
                damage = (pers.uppercut + 2) * Constants.DAMAGE_UPPERCUT;
            if (block === true) {
                damage = damage - (pers.block * Constants.DAMAGE_BLOCK);
                if (damage < 0)
                    damage = 0;
            }
            return damage;
        };
        Data.musicSelected = 1;
        Data.musicList = [
            [Sounds.music_menu, 0.4],
            [Sounds.music_1, 0.4],
            [Sounds.music_2, 0.4]
        ];
        return Data;
    }());
    GameData.Data = Data;
})(GameData || (GameData = {}));
var SocialVK = /** @class */ (function () {
    function SocialVK() {
    }
    /* Пригласить */
    SocialVK.vkInvite = function () {
        try {
            VK.callMethod("showInviteBox");
        }
        catch (e) {
            console.log(e);
        }
    };
    /* Пост на стену в соцсети */
    SocialVK.vkWallPost = function () {
        try {
            if (GameData.Data.tournamentProgress > 0) {
                var postPers = GameData.Data.getPersonage(GameData.Data.id_enemies[GameData.Data.tournamentProgress - 1]);
                VK.api("wall.post", { message: 'Я одержал победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239049' });
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    /* Пост на стену в соцсети */
    SocialVK.vkWallPostWin = function () {
        try {
            VK.api("wall.post", { message: 'Примите поздравления! Вы победили Шао Кана в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239049' });
        }
        catch (e) {
            console.log(e);
        }
    };
    /**
     * Сохранение данных на сервер VK --------------------------------------------------------------------------------------------
     */
    SocialVK.vkSaveData = function () {
        var jsonData = '{';
        jsonData += '"continue": ' + GameData.Data.user_continue.toString() + ',';
        jsonData += '"points": ' + GameData.Data.user_upgrade_points.toString() + ',';
        jsonData += '"progress": ' + GameData.Data.tournamentProgress.toString() + ',';
        jsonData += '"enemies": [';
        GameData.Data.id_enemies.forEach(function (name) {
            jsonData += "\"" + name + "\",";
        });
        jsonData = jsonData.slice(0, -1);
        jsonData += '],';
        jsonData += '"personage": {';
        jsonData += '"id": "' + GameData.Data.user_personage.id.toString() + '",';
        jsonData += '"name": "' + GameData.Data.user_personage.name.toString() + '",';
        jsonData += '"hand": ' + GameData.Data.user_personage.hand.toString() + ',';
        jsonData += '"leg": ' + GameData.Data.user_personage.leg.toString() + ',';
        jsonData += '"block": ' + GameData.Data.user_personage.block.toString() + ',';
        jsonData += '"uppercut": ' + GameData.Data.user_personage.uppercut.toString() + ',';
        jsonData += '"twist": ' + GameData.Data.user_personage.twist.toString() + ',';
        jsonData += '"life": ' + GameData.Data.user_personage.life.toString();
        jsonData += '}';
        jsonData += '}';
        try {
            VK.api('storage.set', { key: 'mk2q_data', value: jsonData, global: 0 }, SocialVK.onVkDataSet, SocialVK.onVkSetDataError);
        }
        catch (e) {
            console.log(e);
        }
        Utilits.Data.debugLog('VK SAVE DATA:', jsonData);
        return jsonData;
    };
    SocialVK.onVkDataSet = function (response) {
        //console.log(response);
    };
    SocialVK.onVkSetDataError = function (response) {
        //console.log(response);
    };
    /**
     * Загрузка данных с сервера VK --------------------------------------------------------------------------------------------
     */
    SocialVK.vkLoadData = function (onVkDataGet) {
        try {
            VK.api('storage.get', { key: 'mk2q_data' }, onVkDataGet, onVkDataGet);
        }
        catch (e) {
            console.log(e);
        }
    };
    SocialVK.LoadData = function (jsonData) {
        Utilits.Data.debugLog('jsonData', jsonData);
        if (jsonData === "" || jsonData === undefined)
            return false;
        JSON.parse(jsonData, function (key, value) {
            if (key === 'continue')
                GameData.Data.user_continue = value;
            if (key === 'points')
                GameData.Data.user_upgrade_points = value;
            if (key === 'progress')
                GameData.Data.tournamentProgress = value;
            if (key === 'enemies')
                GameData.Data.id_enemies = value;
            if (key === 'personage') {
                GameData.Data.user_personage = GameData.Data.getNewPersonage(value.id);
                GameData.Data.user_personage.hand = value.hand;
                GameData.Data.user_personage.leg = value.leg;
                GameData.Data.user_personage.block = value.block;
                GameData.Data.user_personage.uppercut = value.uppercut;
                GameData.Data.user_personage.twist = value.twist;
                GameData.Data.user_personage.life = value.life;
            }
            return value;
        });
        Utilits.Data.debugLog('LOAD DATA', GameData.Data.user_continue.toString() + " " +
            GameData.Data.user_upgrade_points.toString() + " " +
            GameData.Data.tournamentProgress.toString() + " " +
            GameData.Data.id_enemies.toString());
        Utilits.Data.debugLog('LOAD PERSONAGE', GameData.Data.user_personage);
        GameData.Data.enemiesUpgrade();
        GameData.Data.initLevels();
        if (GameData.Data.tournamentProgress > -1) {
            return true;
        }
        else {
            return false;
        }
    };
    return SocialVK;
}());
var Fabrique;
(function (Fabrique) {
    var Blood = /** @class */ (function (_super) {
        __extends(Blood, _super);
        function Blood(game) {
            var _this = _super.call(this, game, 0, 0, Atlases.Blood, 0) || this;
            _this.init();
            return _this;
        }
        Blood.prototype.init = function () {
            this.animation = this.animations.add(Atlases.Blood);
            this.animation.onComplete.add(this.onCompleteVideo, this);
            this.alpha = 0;
        };
        Blood.prototype.onCompleteVideo = function () {
            this.alpha = 0;
        };
        Blood.prototype.show = function () {
            this.alpha = 1;
            this.animation.play(10, false, false);
        };
        return Blood;
    }(Phaser.Sprite));
    Fabrique.Blood = Blood;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var DamageCounter = /** @class */ (function (_super) {
        __extends(DamageCounter, _super);
        function DamageCounter(game, x, y) {
            var _this = _super.call(this, game, x, y, "", { font: "36px Georgia", fill: "#FF0000", align: "left" }) || this;
            _this.updateTransform();
            _this.startPosX = x;
            _this.startPosY = y;
            _this.values = [];
            _this.status = "stop";
            _this.init();
            return _this;
        }
        DamageCounter.prototype.init = function () {
            this.alpha = 0;
            this.tween = this.game.add.tween(this);
            this.tween.to({ x: this.startPosX, y: this.startPosY - 250 }, 500, 'Linear');
        };
        DamageCounter.prototype.show = function (value, block) {
            if (this.status === "stop") {
                this.status = "start";
                this.values.push(value); // добавляет элемент в конец массива
                if (this.values.length > 0)
                    value = this.values[0];
                if (value !== "0")
                    this.text = "-" + value;
                else
                    this.text = value;
                if (block === false)
                    this.setStyle({ font: "36px Georgia", fill: "#FF0000", align: "left" }, true);
                else
                    this.setStyle({ font: "36px Georgia", fill: "#FFFF00", align: "left" }, true);
                this.alpha = 1;
                this.tween.onComplete.add(this.onCompleteVideo, this);
                this.tween.start();
            }
            else {
                this.values.push(value); // добавляет элемент в конец массива
            }
        };
        DamageCounter.prototype.onCompleteVideo = function () {
            this.status = "stop";
            this.values.shift(); // удаляет первый элемент в массиве
            this.x = this.startPosX;
            this.y = this.startPosY;
            this.alpha = 0;
            this.text = "";
            if (this.values.length > 0) {
                var value = this.values[0];
                if (value !== "0")
                    this.text = "-" + value;
                else
                    this.text = value;
                this.alpha = 1;
                this.tween.onComplete.add(this.onCompleteVideo, this);
                this.tween.start();
            }
        };
        return DamageCounter;
    }(Phaser.Text));
    Fabrique.DamageCounter = DamageCounter;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var DialodFightWinsDied = /** @class */ (function (_super) {
        __extends(DialodFightWinsDied, _super);
        function DialodFightWinsDied(game) {
            var _this = _super.call(this, game) || this;
            _this.init();
            return _this;
        }
        DialodFightWinsDied.prototype.init = function () {
            this.event = new Phaser.Signal();
            this.cX = this.game.width / 2;
            this.cY = this.game.height / 2;
            this.graphicOverlay = new Phaser.Graphics(this.game, 0, 0);
            this.graphicOverlay.beginFill(0x000000, 0.1);
            this.graphicOverlay.drawRect(0, 0, this.game.width, this.game.height);
            this.graphicOverlay.endFill();
            this.graphicOverlay.inputEnabled = true;
            this.updateTransform();
        };
        DialodFightWinsDied.prototype.showFight = function () {
            this.addChild(this.graphicOverlay);
            this.sprite = new Phaser.Sprite(this.game, this.cX, this.cY, Images.fight);
            this.sprite.width = 0;
            this.sprite.height = 0;
            this.addChild(this.sprite);
            this.tween = this.game.add.tween(this.sprite);
            this.tween.to({ width: 490, height: 170, x: (this.cX - 245), y: (this.cY - 85) }, 1000, 'Linear');
            this.tween.to({ width: 0, height: 0, x: this.cX, y: this.cY }, 1000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            this.tween.start();
        };
        DialodFightWinsDied.prototype.onTweenComplete = function (event) {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.removeChild(this.graphicOverlay);
            this.graphicOverlay.destroy();
        };
        DialodFightWinsDied.prototype.showWins = function () {
            this.addChild(this.graphicOverlay);
            this.sprite = new Phaser.Sprite(this.game, this.cX, this.cY, Images.wins);
            this.sprite.width = 0;
            this.sprite.height = 0;
            this.addChild(this.sprite);
            this.tween = this.game.add.tween(this.sprite);
            this.tween.to({ width: 490, height: 170, x: (this.cX - 245), y: (this.cY - 85) }, 2500, 'Linear');
            this.tween.to({ width: 0, height: 0, x: this.cX, y: this.cY }, 2500, 'Linear');
            this.tween.onComplete.add(this.onWins, this);
            this.tween.start();
        };
        DialodFightWinsDied.prototype.onWins = function (event) {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.event.dispatch(DialodFightWinsDied.WINS);
        };
        DialodFightWinsDied.prototype.showDied = function () {
            this.addChild(this.graphicOverlay);
            this.sprite = new Phaser.Sprite(this.game, this.cX, this.cY, Images.died);
            this.sprite.width = 0;
            this.sprite.height = 0;
            this.addChild(this.sprite);
            this.tween = this.game.add.tween(this.sprite);
            this.tween.to({ width: 720, height: 175, x: (this.cX - 360), y: (this.cY - 87) }, 2500, 'Linear');
            this.tween.to({ width: 0, height: 0, x: this.cX, y: this.cY }, 2500, 'Linear');
            this.tween.onComplete.add(this.onDied, this);
            this.tween.start();
        };
        DialodFightWinsDied.prototype.onDied = function (event) {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.event.dispatch(DialodFightWinsDied.DIED);
        };
        DialodFightWinsDied.WINS = "wins";
        DialodFightWinsDied.DIED = "died";
        return DialodFightWinsDied;
    }(Phaser.Group));
    Fabrique.DialodFightWinsDied = DialodFightWinsDied;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Blood = Fabrique.Blood;
    var AnimationFighter = /** @class */ (function (_super) {
        __extends(AnimationFighter, _super);
        function AnimationFighter(game, personageiD, personage, enableAnimationUpdate) {
            if (enableAnimationUpdate === void 0) { enableAnimationUpdate = false; }
            var _this = _super.call(this, game, 0, 0, personageiD, 1) || this;
            _this.personageAnimation = personage;
            _this.enableAnimationUpdate = enableAnimationUpdate;
            _this.init();
            return _this;
        }
        AnimationFighter.prototype.init = function () {
            this.block = false;
            this.stanceAnimation();
            this.blood = new Blood(this.game);
            this.blood.x = -100;
            this.blood.y = -50;
            this.addChild(this.blood);
        };
        AnimationFighter.prototype.stanceAnimation = function () {
            this.animationType = Constants.ANIMATION_TYPE_STANCE;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.onStart.addOnce(this.onStart, this);
            if (this.enableAnimationUpdate) {
                this.animation.enableUpdate = true;
                this.animation.onUpdate.add(this.onUpdate, this);
            }
            this.animation.play(10, true, false);
        };
        AnimationFighter.prototype.blockAnimation = function () {
            this.animationType = Constants.ANIMATION_TYPE_BLOCK;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animBlock);
            this.animation.onComplete.add(this.onComplete, this);
            this.frameName = this.personageAnimation.animBlock[this.personageAnimation.animBlock.length - 1];
        };
        AnimationFighter.prototype.changeAnimation = function (type) {
            this.animation.stop();
            this.animation.onComplete.removeAll();
            this.animation.destroy();
            this.animationType = type;
            if (this.animationType === Constants.ANIMATION_TYPE_STANCE)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            if (this.animationType === Constants.ANIMATION_TYPE_BLOCK)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animBlock);
            if (this.animationType === Constants.ANIMATION_TYPE_DAMAGE && this.block === false)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animDamage);
            if (this.animationType === Constants.ANIMATION_TYPE_DAMAGE && this.block === true)
                this.blockAnimation();
            if (this.animationType === Constants.ANIMATION_TYPE_HIT_HAND)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitHand);
            if (this.animationType === Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitHandUppercut);
            if (this.animationType === Constants.ANIMATION_TYPE_HIT_LEG)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitLeg);
            if (this.animationType === Constants.ANIMATION_TYPE_HIT_LEG_TWIST)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitLegTwist);
            if (this.animationType === Constants.ANIMATION_TYPE_LOSE)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animLose);
            if (this.animationType === Constants.ANIMATION_TYPE_WIN)
                this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animWin);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.onStart.addOnce(this.onStart, this);
            if (this.enableAnimationUpdate) {
                this.animation.enableUpdate = true;
                this.animation.onUpdate.add(this.onUpdate, this);
            }
            if (this.animationType === Constants.ANIMATION_TYPE_LOSE && this.personageAnimation.id !== Constants.ID_SHAOKAHN && this.personageAnimation.id !== Constants.ID_GORO)
                this.animation.play(10, true, true);
            else if (this.animationType === Constants.ANIMATION_TYPE_STANCE)
                this.animation.play(10, true, false);
            else
                this.animation.play(10, false, false);
        };
        AnimationFighter.prototype.onComplete = function (sprite, animation) {
            //console.log( (sprite as AnimationFighter).animation);
            if (this.animationType === Constants.ANIMATION_TYPE_BLOCK)
                this.block = true;
            if (this.animationType === Constants.ANIMATION_TYPE_LOSE && this.personageAnimation.id === Constants.ID_SHAOKAHN) {
                this.alpha = 0;
                return;
            }
            if (this.animationType === Constants.ANIMATION_TYPE_STANCE || this.animationType === Constants.ANIMATION_TYPE_WIN || this.animationType === Constants.ANIMATION_TYPE_LOSE)
                return;
            else {
                if (this.block === false)
                    this.changeAnimation(Constants.ANIMATION_TYPE_STANCE); //this.stanceAnimation();
                else {
                    this.changeAnimation(Constants.ANIMATION_TYPE_STANCE);
                    this.blockAnimation();
                }
            }
        };
        AnimationFighter.prototype.showBlood = function () {
            if (this.block === false)
                this.blood.show();
        };
        AnimationFighter.prototype.onStart = function (sprite, animation) {
            if (GameData.Data.user_personage === undefined)
                return;
            Utilits.Data.debugLog("ANIMATION currentFrame", animation.currentFrame);
            Utilits.Data.debugLog("SPRITE Type", sprite.animationType);
            Utilits.Data.debugLog("SPRITE width", sprite.width);
            Utilits.Data.debugLog("SPRITE height", sprite.height);
            if (animation.name === GameData.Data.user_personage.id) {
                this.x = 100 - (sprite.width / 2);
                this.y = Constants.GAME_HEIGHT - (sprite.height * 2) + 150;
            }
            else {
                this.x = Constants.GAME_WIDTH - 125 - (sprite.width / 2);
                this.y = Constants.GAME_HEIGHT - (sprite.height * 2) + 150;
            }
        };
        AnimationFighter.prototype.onUpdate = function (sprite, frame) {
            if (GameData.Data.user_personage === undefined)
                return;
            Utilits.Data.debugLog("FRAME", frame);
            if (sprite.name === GameData.Data.user_personage.id) {
                this.y = Constants.GAME_HEIGHT - (sprite.height * 2) + 150;
            }
            else {
                this.y = Constants.GAME_HEIGHT - (sprite.height * 2) + 150;
            }
        };
        return AnimationFighter;
    }(Phaser.Sprite));
    Fabrique.AnimationFighter = AnimationFighter;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Icon = /** @class */ (function (_super) {
        __extends(Icon, _super);
        function Icon(game, x, y, image, id) {
            var _this = _super.call(this, game, x, y, image, function () {
                _this.event.dispatch(Constants.SELECT_FIGHTER, _this.id);
            }) || this;
            _this.id = id;
            _this.init();
            return _this;
        }
        Icon.prototype.init = function () {
            this.event = new Phaser.Signal();
            this.graphics = this.game.add.graphics(0, 0);
            this.graphics.beginFill(0x000000, 0);
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0, 0, 90, 120);
            this.graphics.endFill();
            this.addChild(this.graphics);
        };
        Icon.prototype.select = function () {
            this.graphics.lineStyle(2, 0xFFFFFF, 1);
            this.graphics.drawRect(0, 0, 90, 120);
            this.graphics.lineStyle(1, 0x000000, 1);
            this.graphics.drawRect(0, 0, 90, 120);
        };
        Icon.prototype.unselect = function () {
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0, 0, 90, 120);
        };
        return Icon;
    }(Phaser.Button));
    Fabrique.Icon = Icon;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var LifeBar = /** @class */ (function (_super) {
        __extends(LifeBar, _super);
        function LifeBar(game, x, y, name, life) {
            var _this = _super.call(this, game) || this;
            _this.x = x;
            _this.y = y;
            _this.oneLife = (200 / life);
            _this.name = name;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        LifeBar.prototype.init = function () {
            this.lifebarImage = new Phaser.Sprite(this.game, this.x, this.y + 20, Images.Lifebar);
            this.addChild(this.lifebarImage);
            this.lineGraphics = this.game.add.graphics(this.x + 3, this.y + 23); // 200x10
            this.lineGraphics.beginFill(0x0000CD, 1);
            this.lineGraphics.lineStyle(0, 0x0000CD, 0);
            this.lineGraphics.drawRect(0, 0, 200, 10);
            this.lineGraphics.endFill();
            this.addChild(this.lineGraphics);
            var textLength = this.name.length * 8;
            var center = this.x + (this.width / 2);
            var posX = center - (textLength / 2);
            this.lifebarText = new Phaser.Text(this.game, posX, this.y, this.name, { font: "18px Georgia", fill: "#DDDDDD", align: "left" });
            this.addChild(this.lifebarText);
        };
        LifeBar.prototype.lifeUpdate = function (life) {
            if (life <= 0)
                life = 0;
            this.lineGraphics.clear();
            this.lineGraphics.beginFill(0x0000CD, 1);
            this.lineGraphics.lineStyle(0, 0x0000CD, 0);
            this.lineGraphics.drawRect(0, 0, (life * this.oneLife), 10);
            this.lineGraphics.endFill();
        };
        return LifeBar;
    }(Phaser.Group));
    Fabrique.LifeBar = LifeBar;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var PanelIcons = /** @class */ (function (_super) {
        __extends(PanelIcons, _super);
        function PanelIcons(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.defaultFighterID = Constants.ID_LIUKANG;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        PanelIcons.prototype.init = function () {
            var _this = this;
            this.icons = [
                [
                    new Fabrique.Icon(this.game, 0, 0, Images.LiuKangIcon, Constants.ID_LIUKANG),
                    new Fabrique.Icon(this.game, 95, 0, Images.KungLaoIcon, Constants.ID_KUNGLAO),
                    new Fabrique.Icon(this.game, 190, 0, Images.JohnnyCageIcon, Constants.ID_JOHNYCAGE),
                    new Fabrique.Icon(this.game, 285, 0, Images.ReptileIcon, Constants.ID_REPTILE)
                ],
                [
                    new Fabrique.Icon(this.game, 0, 125, Images.SubZeroIcon, Constants.ID_SUBZERO),
                    new Fabrique.Icon(this.game, 95, 125, Images.ShangTsungIcon, Constants.ID_SHANGTSUNG),
                    new Fabrique.Icon(this.game, 190, 125, Images.KitanaIcon, Constants.ID_KITANA),
                    new Fabrique.Icon(this.game, 285, 125, Images.JaxIcon, Constants.ID_JAX)
                ],
                [
                    new Fabrique.Icon(this.game, 0, 250, Images.MileenaIcon, Constants.ID_MILEENA),
                    new Fabrique.Icon(this.game, 95, 250, Images.BarakaIcon, Constants.ID_BARAKA),
                    new Fabrique.Icon(this.game, 190, 250, Images.ScorpionIcon, Constants.ID_SCORPION),
                    new Fabrique.Icon(this.game, 285, 250, Images.RaidenIcon, Constants.ID_RAIDEN)
                ]
            ];
            this.x = -400;
            this.y = 150;
            this.icons.forEach(function (iconsLine) {
                iconsLine.forEach(function (icon) {
                    icon.event.add(_this.onChange, _this);
                    _this.addChild(icon);
                });
            });
            this.icons[0][0].select();
            this.windowPersonage = new Fabrique.WindowPersonage(this.game, -225, 122);
            this.windowPersonage.showPersonage(this.defaultFighterID);
            this.addChild(this.windowPersonage);
            this.windowCharacteristics = new Fabrique.WindowCharacteristics(this.game, -225, 375);
            this.windowCharacteristics.showCharacteristics(this.defaultFighterID);
            this.addChild(this.windowCharacteristics);
            GameData.Data.user_personage = GameData.Data.getNewPersonage(this.defaultFighterID);
        };
        PanelIcons.prototype.onChange = function (target, id) {
            //Utilits.Data.debugLog('Change [target/type]:', [target, id]);
            this.playIconSound();
            this.icons.forEach(function (iconsLine) {
                iconsLine.forEach(function (icon) {
                    icon.unselect();
                    if (icon.id === id)
                        icon.select();
                });
            });
            this.windowPersonage.changePersonage(id);
            this.windowCharacteristics.showCharacteristics(id);
            GameData.Data.user_personage = GameData.Data.getPersonage(id);
        };
        PanelIcons.prototype.show = function () {
            var tween = this.game.add.tween(this);
            tween.to({ x: 245, y: 150 }, 500, 'Linear');
            tween.start();
        };
        PanelIcons.prototype.playIconSound = function () {
            if (Config.settingSound) {
                GameData.Data.iconSound.loop = false;
                GameData.Data.iconSound.volume = 1.0;
                GameData.Data.iconSound.play();
            }
        };
        return PanelIcons;
    }(Phaser.Group));
    Fabrique.PanelIcons = PanelIcons;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Settings = /** @class */ (function (_super) {
        __extends(Settings, _super);
        function Settings(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.init();
            return _this;
        }
        Settings.prototype.init = function () {
            this.event = new Phaser.Signal();
            var startX = (Constants.GAME_WIDTH / 2) - 150;
            var startY = (Constants.GAME_HEIGHT / 2) - 150;
            /* bacground and border */
            var polygon = new Phaser.Polygon([
                new Phaser.Point(startX, startY),
                new Phaser.Point(startX + 10, startY - 10),
                new Phaser.Point(startX + 300, startY - 10),
                new Phaser.Point(startX + 310, startY),
                new Phaser.Point(startX + 310, startY + 200),
                new Phaser.Point(startX + 300, startY + 210),
                new Phaser.Point(startX + 10, startY + 210),
                new Phaser.Point(startX, startY + 200)
            ]);
            var graphicOverlay = new Phaser.Graphics(this.game, 0, 0);
            graphicOverlay.beginFill(0x000000, 0.5);
            graphicOverlay.drawRect(0, 0, this.game.width, this.game.height);
            graphicOverlay.endFill();
            graphicOverlay.beginFill(0x000000, 0.8);
            graphicOverlay.lineStyle(2, 0x777777, 1);
            graphicOverlay.drawPolygon(polygon);
            graphicOverlay.endFill();
            graphicOverlay.inputEnabled = true;
            this.addChild(graphicOverlay);
            /* title */
            var title = new Phaser.Text(this.game, startX + 35, startY + 5, "НАСТРОЙКИ ИГРЫ", { font: "24px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(title);
            /* sound */
            var buttonSound;
            if (Config.settingSound === true)
                buttonSound = new Phaser.Button(this.game, startX + 25, startY + 50, Images.ButtonOn, this.onButtonClick, this);
            else
                buttonSound = new Phaser.Button(this.game, startX + 25, startY + 50, Images.ButtonOff, this.onButtonClick, this);
            buttonSound.name = Constants.SOUND;
            this.addChild(buttonSound);
            var labelSound = new Phaser.Text(this.game, startX + 90, startY + 55, "Звук", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelSound);
            /* music */
            var buttonMusic;
            if (Config.settingMusic === true)
                buttonMusic = new Phaser.Button(this.game, startX + 155, startY + 50, Images.ButtonOn, this.onButtonClick, this);
            else
                buttonMusic = new Phaser.Button(this.game, startX + 155, startY + 50, Images.ButtonOff, this.onButtonClick, this);
            buttonMusic.name = Constants.MUSIC;
            this.addChild(buttonMusic);
            var labelMusic = new Phaser.Text(this.game, startX + 220, startY + 55, "Музыка", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelMusic);
            /* tutorial */
            var buttonTutorial;
            if (Config.settingTutorial === true)
                buttonTutorial = new Phaser.Button(this.game, startX + 25, startY + 100, Images.ButtonOn, this.onButtonClick, this);
            else
                buttonTutorial = new Phaser.Button(this.game, startX + 25, startY + 100, Images.ButtonOff, this.onButtonClick, this);
            buttonTutorial.name = Constants.TUTORIAL;
            this.addChild(buttonTutorial);
            var labelTutorial = new Phaser.Text(this.game, startX + 90, startY + 105, "Обучение в игре", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelTutorial);
            /* button close */
            var buttonClose = new Phaser.Button(this.game, startX + 25, startY + 150, Sheet.ButtonClose, this.onButtonCloseClick, this, 1, 2);
            buttonClose.name = Constants.SETTINGS_CLOSE;
            this.addChild(buttonClose);
            this.updateTransform();
        };
        Settings.prototype.onButtonCloseClick = function (event) {
            this.playButtonSound();
            this.event.dispatch(event);
            this.removeAll();
        };
        Settings.prototype.onButtonClick = function (event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.SOUND:
                    {
                        if (Config.settingSound === true) {
                            Config.settingSound = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.SOUND;
                            this.addChild(event);
                        }
                        else {
                            Config.settingSound = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.SOUND;
                            this.addChild(event);
                        }
                        break;
                    }
                case Constants.MUSIC:
                    {
                        if (Config.settingMusic === true) {
                            this.stopMusic();
                            Config.settingMusic = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.MUSIC;
                            this.addChild(event);
                        }
                        else {
                            this.playMusic();
                            Config.settingMusic = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.MUSIC;
                            this.addChild(event);
                        }
                        break;
                    }
                case Constants.TUTORIAL:
                    {
                        if (Config.settingTutorial === true) {
                            Config.settingTutorial = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.TUTORIAL;
                            this.addChild(event);
                        }
                        else {
                            Config.settingTutorial = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.TUTORIAL;
                            this.addChild(event);
                        }
                        break;
                    }
                default:
                    break;
            }
        };
        Settings.prototype.stopMusic = function () {
            GameData.Data.music.stop();
        };
        Settings.prototype.playMusic = function () {
            GameData.Data.music.play();
        };
        Settings.prototype.playButtonSound = function () {
            if (Config.settingSound) {
                GameData.Data.buttonSound.loop = false;
                GameData.Data.buttonSound.volume = 0.5;
                GameData.Data.buttonSound.play();
            }
        };
        return Settings;
    }(Phaser.Group));
    Fabrique.Settings = Settings;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Help = /** @class */ (function (_super) {
        __extends(Help, _super);
        function Help(game, parent, text) {
            var _this = _super.call(this, game, parent) || this;
            _this.init(text);
            return _this;
        }
        Help.prototype.init = function (text) {
            this.event = new Phaser.Signal();
            var startX = (Constants.GAME_WIDTH / 2) - 310;
            var startY = (Constants.GAME_HEIGHT / 2) - 250;
            /* bacground and border */
            var polygon = new Phaser.Polygon([
                new Phaser.Point(startX, startY),
                new Phaser.Point(startX + 10, startY - 10),
                new Phaser.Point(startX + 600, startY - 10),
                new Phaser.Point(startX + 610, startY),
                new Phaser.Point(startX + 610, startY + 400),
                new Phaser.Point(startX + 600, startY + 410),
                new Phaser.Point(startX + 10, startY + 410),
                new Phaser.Point(startX, startY + 400)
            ]);
            var graphicOverlay = new Phaser.Graphics(this.game, 0, 0);
            graphicOverlay.beginFill(0x000000, 0.5);
            graphicOverlay.drawRect(0, 0, this.game.width, this.game.height);
            graphicOverlay.endFill();
            graphicOverlay.beginFill(0x000000, 0.9);
            graphicOverlay.lineStyle(2, 0x777777, 1);
            graphicOverlay.drawPolygon(polygon);
            graphicOverlay.endFill();
            graphicOverlay.inputEnabled = true;
            this.addChild(graphicOverlay);
            var labelText = new Phaser.Text(this.game, startX + 50, startY + 35, text, { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelText);
            /* button close */
            var buttonClose = new Phaser.Button(this.game, startX + 180, startY + 350, Sheet.ButtonClose, this.onButtonCloseClick, this, 1, 2);
            buttonClose.name = Constants.HELP_CLOSE;
            this.addChild(buttonClose);
            this.updateTransform();
        };
        Help.prototype.onButtonCloseClick = function (event) {
            this.event.dispatch(event);
        };
        return Help;
    }(Phaser.Group));
    Fabrique.Help = Help;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Title = /** @class */ (function (_super) {
        __extends(Title, _super);
        function Title(game, x, y, text) {
            var _this = _super.call(this, game, x, y, Images.Title) || this;
            _this.posX = 0;
            _this.posY = 0;
            _this.text = text;
            _this.posX = ((Constants.GAME_WIDTH / 2) - (_this.width / 2));
            _this.posY = Constants.GAME_HEIGHT / 10;
            if (x >= 0)
                _this.x = _this.posX;
            if (y >= 0)
                _this.y = _this.posY;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        Title.prototype.init = function () {
            var size = 12 * this.text.length;
            var posX = (this.width / 2) - (size / 2);
            var titleText = this.game.add.text(posX, 20, this.text, { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(titleText);
        };
        Title.prototype.show = function () {
            var tween = this.game.add.tween(this);
            tween.to({ x: this.posX, y: this.posY }, 500, 'Linear');
            tween.start();
        };
        return Title;
    }(Phaser.Sprite));
    Fabrique.Title = Title;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Tower = /** @class */ (function (_super) {
        __extends(Tower, _super);
        function Tower(game) {
            var _this = _super.call(this, game) || this;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        Tower.prototype.init = function () {
            var x = 0;
            var y = 0;
            this.towerHeader = new Phaser.Sprite(this.game, x, y, Images.towerHeader);
            this.addChild(this.towerHeader);
            y += 135;
            var count = GameData.Data.id_enemies.length - 1;
            while (count > 0) {
                var photo_1 = new Phaser.Sprite(this.game, 200, y + 15, GameData.Data.id_enemies[count] + '.png');
                photo_1.scale.x = 0.6;
                photo_1.scale.y = 0.6;
                this.addChild(photo_1);
                var towerContent = new Phaser.Sprite(this.game, 0, y, Images.towerContent);
                this.addChild(towerContent);
                y += 95;
                count--;
            }
            var photo = new Phaser.Sprite(this.game, 200, y + 15, GameData.Data.id_enemies[0] + '.png');
            photo.scale.x = 0.6;
            photo.scale.y = 0.6;
            this.addChild(photo);
            this.towerFooter = new Phaser.Sprite(this.game, 0, y, Images.towerFooter);
            this.addChild(this.towerFooter);
            this.personageIcon = new Phaser.Sprite(this.game, 125, y + 18, GameData.Data.user_personage.id + '.png');
            this.personageIcon.scale.x = 0.55;
            this.personageIcon.scale.y = 0.55;
            this.addChild(this.personageIcon);
        };
        Tower.prototype.show = function (x, y) {
            if (GameData.Data.tournamentProgress === 0) {
                var tween = this.game.add.tween(this);
                tween.to({ x: x, y: y - 725 }, 5000, 'Linear');
                tween.start();
            }
            else {
                this.y = y - 725 + (90 * (GameData.Data.tournamentProgress - 1));
                var tween = this.game.add.tween(this);
                tween.to({ x: x, y: this.y + 90 }, 1000, 'Linear');
                tween.start();
                this.personageIcon.y = this.personageIcon.y - (95 * (GameData.Data.tournamentProgress - 1));
                var tweenIcon = this.game.add.tween(this.personageIcon);
                tweenIcon.to({ y: this.personageIcon.y - 95 }, 1000, 'Linear');
                tweenIcon.start();
            }
        };
        return Tower;
    }(Phaser.Group));
    Fabrique.Tower = Tower;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Tutorial = /** @class */ (function (_super) {
        __extends(Tutorial, _super);
        function Tutorial(game, text) {
            var _this = _super.call(this, game, 0, 0, Atlases.VideoHelp, 0) || this;
            _this.text = text;
            _this.init();
            return _this;
        }
        Tutorial.prototype.init = function () {
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0x000000, 0);
            graphics.lineStyle(10, 0x000000, 1);
            graphics.drawRect(0, 0, 400, 116);
            graphics.endFill();
            graphics.beginFill(0x000000, 0.6);
            graphics.lineStyle(1, 0x000000, 1);
            graphics.drawRect(150, 0, 250, 116);
            graphics.endFill();
            graphics.beginFill(0x000000, 0.5);
            graphics.lineStyle(2, 0x999999, 0.5);
            graphics.drawRect(0, 0, 400, 116);
            graphics.endFill();
            this.addChild(graphics);
            this.messageText = this.game.add.text(175, 10, this.text, { font: "18px Georgia", fill: "#AAAAAA", align: "left" });
            this.addChild(this.messageText);
            var anim = this.animations.add(Atlases.VideoHelp);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(10, true, false);
        };
        Tutorial.prototype.onCompleteVideo = function () {
        };
        Tutorial.prototype.show = function (x, y) {
            var tween = this.game.add.tween(this);
            tween.to({ x: x, y: y }, 500, 'Linear');
            tween.start();
        };
        Tutorial.prototype.setText = function (text) {
            this.text = text;
            this.messageText.text = this.text;
        };
        return Tutorial;
    }(Phaser.Sprite));
    Fabrique.Tutorial = Tutorial;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var UpgradeCharacteristics = /** @class */ (function (_super) {
        __extends(UpgradeCharacteristics, _super);
        function UpgradeCharacteristics(game, thisIsPersonage, tournament) {
            if (thisIsPersonage === void 0) { thisIsPersonage = true; }
            if (tournament === void 0) { tournament = null; }
            var _this = _super.call(this, game) || this;
            _this.thisIsPersonage = thisIsPersonage;
            _this.tournament = tournament;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        UpgradeCharacteristics.prototype.init = function () {
            this.background = new Phaser.Sprite(this.game, 0, 0, Images.WindowBackground);
            this.addChild(this.background);
            this.cap1 = new Phaser.Sprite(this.game, 10, 10, Images.capShangTsung);
            this.cap1.scale.x = 0.5;
            this.cap1.scale.y = 0.5;
            this.addChild(this.cap1);
            this.cap2 = new Phaser.Sprite(this.game, 10, 55, Images.capJax);
            this.cap2.scale.x = 0.5;
            this.cap2.scale.y = 0.5;
            this.addChild(this.cap2);
            this.cap3 = new Phaser.Sprite(this.game, 10, 100, Images.capMileena);
            this.cap3.scale.x = 0.5;
            this.cap3.scale.y = 0.5;
            this.addChild(this.cap3);
            this.cap4 = new Phaser.Sprite(this.game, 10, 145, Images.capRaiden);
            this.cap4.scale.x = 0.5;
            this.cap4.scale.y = 0.5;
            this.addChild(this.cap4);
            this.cap5 = new Phaser.Sprite(this.game, 10, 190, Images.capReptile);
            this.cap5.scale.x = 0.5;
            this.cap5.scale.y = 0.5;
            this.addChild(this.cap5);
            this.textCap1 = new Phaser.Text(this.game, 50, 25, "Удар ногой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap1);
            this.textValueCap1 = new Phaser.Text(this.game, 150, 25, Constants.LEG + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap1);
            this.textCap2 = new Phaser.Text(this.game, 50, 70, "Удар рукой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap2);
            this.textValueCap2 = new Phaser.Text(this.game, 150, 70, Constants.HAND + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap2);
            this.textCap3 = new Phaser.Text(this.game, 50, 115, "Блок\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap3);
            this.textValueCap3 = new Phaser.Text(this.game, 150, 115, Constants.BLOCK + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap3);
            this.textCap4 = new Phaser.Text(this.game, 50, 160, "Апперкот\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap4);
            this.textValueCap4 = new Phaser.Text(this.game, 150, 160, Constants.UPPERCUT + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap4);
            this.textCap5 = new Phaser.Text(this.game, 50, 205, "С разворота\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap5);
            this.textValueCap5 = new Phaser.Text(this.game, 150, 205, Constants.TWIST + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap5);
            this.upgradePoints = new Phaser.Text(this.game, 50, 230, "Очки улучшений: 0", { font: "12px Arial", fill: "#B7B7B7", align: "left" });
            this.addChild(this.upgradePoints);
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
            this.addChild(this.border);
        };
        UpgradeCharacteristics.prototype.show = function (x, y) {
            if (this.thisIsPersonage) {
                /*
                this.textValueCap1.text = Constants.DAMAGE_LEG + " x"+ GameData.Data.user_personage.leg;
                this.textValueCap2.text = Constants.DAMAGE_HAND + " x"+ GameData.Data.user_personage.hand;
                this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x"+ GameData.Data.user_personage.block;
                this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x"+ GameData.Data.user_personage.uppercut;
                this.textValueCap5.text = Constants.DAMAGE_TWIST + " x"+ GameData.Data.user_personage.twist;
                this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                */
                this.textValueCap1.text = (Constants.DAMAGE_LEG * GameData.Data.user_personage.leg).toString();
                this.textValueCap2.text = (Constants.DAMAGE_HAND * GameData.Data.user_personage.hand).toString();
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK * GameData.Data.user_personage.block).toString();
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT * GameData.Data.user_personage.uppercut).toString();
                this.textValueCap5.text = (Constants.DAMAGE_TWIST * GameData.Data.user_personage.twist).toString();
                this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                if (GameData.Data.user_upgrade_points > 0) {
                    this.textValueCap1.x = 125;
                    this.textValueCap2.x = 125;
                    this.textValueCap3.x = 125;
                    this.textValueCap4.x = 125;
                    this.textValueCap5.x = 125;
                    if (GameData.Data.user_personage.leg < Constants.MAX_HIT_LEG) {
                        this.buttonLegPlus = new Phaser.Button(this.game, 160, 10, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonLegPlus.name = Constants.LEG;
                        this.addChild(this.buttonLegPlus);
                    }
                    else {
                        this.textValueCap1.text = Constants.DAMAGE_LEG + " x" + GameData.Data.user_personage.leg + " (макс.)";
                    }
                    if (GameData.Data.user_personage.hand < Constants.MAX_HIT_HAND) {
                        this.buttonHandPlus = new Phaser.Button(this.game, 160, 55, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonHandPlus.name = Constants.HAND;
                        this.addChild(this.buttonHandPlus);
                    }
                    else {
                        this.textValueCap2.text = Constants.DAMAGE_HAND + " x" + GameData.Data.user_personage.hand + " (макс.)";
                    }
                    if (GameData.Data.user_personage.block < Constants.MAX_HIT_BLOCK) {
                        this.buttonBlockPlus = new Phaser.Button(this.game, 160, 100, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonBlockPlus.name = Constants.BLOCK;
                        this.addChild(this.buttonBlockPlus);
                    }
                    else {
                        this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x" + GameData.Data.user_personage.block + " (макс.)";
                    }
                    if (GameData.Data.user_personage.uppercut < Constants.MAX_HIT_UPPERCUT) {
                        this.buttonUppercutPlus = new Phaser.Button(this.game, 160, 145, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonUppercutPlus.name = Constants.UPPERCUT;
                        this.addChild(this.buttonUppercutPlus);
                    }
                    else {
                        this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x" + GameData.Data.user_personage.uppercut + " (макс.)";
                    }
                    if (GameData.Data.user_personage.twist < Constants.MAX_HIT_TWIST) {
                        this.buttonTwistPlus = new Phaser.Button(this.game, 160, 190, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonTwistPlus.name = Constants.TWIST;
                        this.addChild(this.buttonTwistPlus);
                    }
                    else {
                        this.textValueCap5.text = Constants.DAMAGE_TWIST + " x" + GameData.Data.user_personage.twist + " (макс.)";
                    }
                }
            }
            else {
                var personageEnemies = GameData.Data.getPersonage(GameData.Data.id_enemies[GameData.Data.tournamentProgress]);
                this.textValueCap1.text = (Constants.DAMAGE_LEG * personageEnemies.leg).toString();
                this.textValueCap2.text = (Constants.DAMAGE_HAND * personageEnemies.hand).toString();
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK * personageEnemies.block).toString();
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT * personageEnemies.uppercut).toString();
                this.textValueCap5.text = (Constants.DAMAGE_TWIST * personageEnemies.twist).toString();
                this.upgradePoints.text = "";
            }
            var tween = this.game.add.tween(this);
            tween.to({ x: x, y: y }, 1000, 'Linear');
            tween.start();
        };
        UpgradeCharacteristics.prototype.onButtonClick = function (event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.LEG:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.leg++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap1.text = Constants.DAMAGE_LEG + " x" + GameData.Data.user_personage.leg;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.HAND:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.hand++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap2.text = Constants.DAMAGE_HAND + " x" + GameData.Data.user_personage.hand;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.BLOCK:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.block++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x" + GameData.Data.user_personage.block;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.UPPERCUT:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.uppercut++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x" + GameData.Data.user_personage.uppercut;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.TWIST:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.twist++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap5.text = Constants.DAMAGE_TWIST + " x" + GameData.Data.user_personage.twist;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                default:
                    break;
            }
        };
        UpgradeCharacteristics.prototype.playButtonSound = function () {
            if (Config.settingSound) {
                GameData.Data.iconSound.loop = false;
                GameData.Data.iconSound.volume = 1.0;
                GameData.Data.iconSound.play();
            }
        };
        UpgradeCharacteristics.prototype.removeUpgradeButtons = function () {
            if (GameData.Data.user_upgrade_points == 0) {
                this.tournament.updateTutorial();
                this.removeChild(this.buttonLegPlus);
                this.removeChild(this.buttonHandPlus);
                this.removeChild(this.buttonBlockPlus);
                this.removeChild(this.buttonUppercutPlus);
                this.removeChild(this.buttonTwistPlus);
                /*
                this.textValueCap1.text = (Constants.DAMAGE_LEG* GameData.Data.user_personage.leg).toString() + " x"+ GameData.Data.user_personage.leg;
                this.textValueCap2.text = (Constants.DAMAGE_HAND*GameData.Data.user_personage.hand).toString() + " x"+ GameData.Data.user_personage.hand;
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK*GameData.Data.user_personage.block).toString() + " x"+ GameData.Data.user_personage.block;
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT*GameData.Data.user_personage.uppercut).toString() + " x"+ GameData.Data.user_personage.uppercut;
                this.textValueCap5.text = (Constants.DAMAGE_TWIST*GameData.Data.user_personage.twist).toString() + " x"+ GameData.Data.user_personage.twist;
                */
                this.textValueCap1.text = (Constants.DAMAGE_LEG * GameData.Data.user_personage.leg).toString();
                this.textValueCap2.text = (Constants.DAMAGE_HAND * GameData.Data.user_personage.hand).toString();
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK * GameData.Data.user_personage.block).toString();
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT * GameData.Data.user_personage.uppercut).toString();
                this.textValueCap5.text = (Constants.DAMAGE_TWIST * GameData.Data.user_personage.twist).toString();
                this.textValueCap1.x = 150;
                this.textValueCap2.x = 150;
                this.textValueCap3.x = 150;
                this.textValueCap4.x = 150;
                this.textValueCap5.x = 150;
            }
            else {
                if (GameData.Data.user_personage.leg == Constants.MAX_HIT_LEG) {
                    this.removeChild(this.buttonLegPlus);
                    this.textValueCap1.text = Constants.DAMAGE_LEG + " x" + GameData.Data.user_personage.leg + " (макс.)";
                }
                if (GameData.Data.user_personage.hand == Constants.MAX_HIT_HAND) {
                    this.removeChild(this.buttonHandPlus);
                    this.textValueCap2.text = Constants.DAMAGE_HAND + " x" + GameData.Data.user_personage.hand + " (макс.)";
                }
                if (GameData.Data.user_personage.block == Constants.MAX_HIT_BLOCK) {
                    this.removeChild(this.buttonBlockPlus);
                    this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x" + GameData.Data.user_personage.block + " (макс.)";
                }
                if (GameData.Data.user_personage.uppercut == Constants.MAX_HIT_UPPERCUT) {
                    this.removeChild(this.buttonUppercutPlus);
                    this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x" + GameData.Data.user_personage.uppercut + " (макс.)";
                }
                if (GameData.Data.user_personage.twist == Constants.MAX_HIT_TWIST) {
                    this.removeChild(this.buttonTwistPlus);
                    this.textValueCap5.text = Constants.DAMAGE_TWIST + " x" + GameData.Data.user_personage.twist + " (макс.)";
                }
            }
        };
        return UpgradeCharacteristics;
    }(Phaser.Group));
    Fabrique.UpgradeCharacteristics = UpgradeCharacteristics;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var WindowPersonage = /** @class */ (function (_super) {
        __extends(WindowPersonage, _super);
        function WindowPersonage(game, x, y) {
            var _this = _super.call(this, game, x, y, Images.WindowBackground) || this;
            _this.init();
            return _this;
        }
        WindowPersonage.prototype.init = function () {
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
            this.fighter = new Phaser.Group(this.game, this);
        };
        WindowPersonage.prototype.showPersonage = function (personageID) {
            var personage;
            personage = GameData.Data.getPersonage(personageID);
            this.animPersonage = new Fabrique.AnimationFighter(this.game, personage.id, personage);
            this.animPersonage.x = (this.width - this.animPersonage.width) / 3;
            this.animPersonage.y = (this.height - this.animPersonage.height) / 4;
            this.animPersonage.scale.x = 1.5;
            this.animPersonage.scale.y = 1.5;
            this.fighter.addChild(this.animPersonage);
            this.addChild(this.border);
        };
        WindowPersonage.prototype.changePersonage = function (personageID) {
            var personage;
            personage = GameData.Data.getPersonage(personageID);
            this.animPersonage.destroy();
            this.fighter.removeAll();
            this.animPersonage = new Fabrique.AnimationFighter(this.game, personage.id, personage);
            this.animPersonage.x = (this.width - this.animPersonage.width) / 3;
            this.animPersonage.y = (this.height - this.animPersonage.height) / 4;
            this.animPersonage.scale.x = 1.5;
            this.animPersonage.scale.y = 1.5;
            this.fighter.addChild(this.animPersonage);
            Utilits.Data.debugLog("change personage", personage);
        };
        return WindowPersonage;
    }(Phaser.Sprite));
    Fabrique.WindowPersonage = WindowPersonage;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var WindowCharacteristics = /** @class */ (function (_super) {
        __extends(WindowCharacteristics, _super);
        function WindowCharacteristics(game, x, y) {
            var _this = _super.call(this, game, x, y, Images.WindowBackground2) || this;
            _this.init();
            return _this;
        }
        WindowCharacteristics.prototype.init = function () {
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder2);
            this.cap1 = new Phaser.Sprite(this.game, 15, 45, Images.capShangTsung);
            this.cap1.scale.x = 0.8;
            this.cap1.scale.y = 0.8;
            this.cap2 = new Phaser.Sprite(this.game, 90, 45, Images.capJax);
            this.cap2.scale.x = 0.8;
            this.cap2.scale.y = 0.8;
            this.cap3 = new Phaser.Sprite(this.game, 165, 45, Images.capMileena);
            this.cap3.scale.x = 0.8;
            this.cap3.scale.y = 0.8;
            this.cap4 = new Phaser.Sprite(this.game, 240, 45, Images.capRaiden);
            this.cap4.scale.x = 0.8;
            this.cap4.scale.y = 0.8;
            this.cap5 = new Phaser.Sprite(this.game, 315, 45, Images.capReptile);
            this.cap5.scale.x = 0.8;
            this.cap5.scale.y = 0.8;
            this.textCap1 = new Phaser.Text(this.game, 15, 110, "Удар ногой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap1 = new Phaser.Text(this.game, 40, 125, Constants.LEG + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap2 = new Phaser.Text(this.game, 90, 110, "Удар рукой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap2 = new Phaser.Text(this.game, 115, 125, Constants.HAND + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap3 = new Phaser.Text(this.game, 185, 110, "Блок\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap3 = new Phaser.Text(this.game, 195, 125, Constants.BLOCK + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap4 = new Phaser.Text(this.game, 245, 110, "Апперкот\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap4 = new Phaser.Text(this.game, 265, 125, Constants.UPPERCUT + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap5 = new Phaser.Text(this.game, 315, 110, "С разворота\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap5 = new Phaser.Text(this.game, 345, 125, Constants.TWIST + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.namePersonage = new Phaser.Text(this.game, 50, 15, "", { font: "22px Georgia", fill: "#B7B7B7", align: "left" });
            this.addChild(this.namePersonage);
            this.addChild(this.cap1);
            this.addChild(this.textCap1);
            this.addChild(this.textValueCap1);
            this.addChild(this.cap2);
            this.addChild(this.textCap2);
            this.addChild(this.textValueCap2);
            this.addChild(this.cap3);
            this.addChild(this.textCap3);
            this.addChild(this.textValueCap3);
            this.addChild(this.cap4);
            this.addChild(this.textCap4);
            this.addChild(this.textValueCap4);
            this.addChild(this.cap5);
            this.addChild(this.textCap5);
            this.addChild(this.textValueCap5);
            this.addChild(this.border);
        };
        WindowCharacteristics.prototype.showCharacteristics = function (personageID) {
            var _this = this;
            GameData.Data.personages.forEach(function (personage) {
                if (personage.id === personageID) {
                    /*
                    this.textValueCap1.text = (Constants.LEG*personage.leg)+" ["+Constants.LEG+" x "+personage.leg+"]";
                    this.textValueCap2.text = (Constants.HAND*personage.hand)+" ["+Constants.HAND+" x "+personage.hand+"]";
                    this.textValueCap3.text = (Constants.BLOCK*personage.block)+"["+Constants.BLOCK+" x "+personage.block+"]";
                    this.textValueCap4.text = (Constants.UPPERCUT*personage.uppercut)+"["+Constants.UPPERCUT+" x "+personage.uppercut+"]";
                    this.textValueCap5.text = (Constants.TWIST*personage.twist)+"["+Constants.TWIST+" x "+personage.twist+"]";
                    */
                    _this.namePersonage.text = personage.name;
                    _this.namePersonage.x = (400 / 2) - (_this.namePersonage.text.length * 5);
                    _this.textValueCap1.text = (Constants.DAMAGE_LEG * personage.leg).toString();
                    _this.textValueCap2.text = (Constants.DAMAGE_HAND * personage.hand).toString();
                    _this.textValueCap3.text = (Constants.DAMAGE_BLOCK * personage.block).toString();
                    _this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT * personage.uppercut).toString();
                    _this.textValueCap5.text = (Constants.DAMAGE_TWIST * personage.twist).toString();
                    return;
                }
            });
        };
        return WindowCharacteristics;
    }(Phaser.Sprite));
    Fabrique.WindowCharacteristics = WindowCharacteristics;
})(Fabrique || (Fabrique = {}));
var MortalKombat;
(function (MortalKombat) {
    var Boot = /** @class */ (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            var _this = _super.call(this) || this;
            _this.name = Boot.Name;
            return _this;
        }
        /*
        * Загружаем ассеты необходимые для прелоадера
        */
        Boot.prototype.init = function () {
            // отключаем контекстное меню
            this.game.canvas.oncontextmenu = function (e) {
                e.preventDefault();
            };
        };
        Boot.prototype.preload = function () {
            this.game.load.image(Images.PreloaderImage, 'assets/images/' + Images.PreloaderImage);
            this.game.load.atlas(Atlases.LogoAtlas, 'assets/atlas/' + Atlases.LogoAtlas + '.png', 'assets/atlas/' + Atlases.LogoAtlas + '.json');
        };
        Boot.prototype.create = function () {
            var _this = this;
            this.game.state.start(MortalKombat.Preloader.Name, true, false, {
                nextStage: MortalKombat.Menu.Name,
                preloadHandler: function () {
                    Images.preloadList.forEach(function (assetName) {
                        _this.game.load.image(assetName, 'assets/images/' + assetName);
                    });
                    Atlases.preloadList.forEach(function (assetName) {
                        _this.game.load.atlas(assetName, 'assets/atlas/' + assetName + '.png', 'assets/atlas/' + assetName + '.json');
                    });
                    Sheet.preloadList.forEach(function (assetName) {
                        _this.game.load.spritesheet(assetName, 'assets/images/' + assetName, 255, 50);
                    });
                    Animations.preloadList.forEach(function (assetName) {
                        _this.game.load.json(assetName, 'assets/atlas/' + assetName);
                    });
                    Characteristics.preloadList.forEach(function (assetName) {
                        _this.game.load.json(assetName, 'assets/data/' + assetName);
                    });
                    Levels.levelsList.forEach(function (assetName) {
                        _this.game.load.json(assetName, 'assets/levels/' + assetName);
                    });
                    Sounds.preloadList.forEach(function (assetName) {
                        _this.game.load.audio(assetName, ['assets/sounds/' + assetName + '.mp3', 'assets/sounds/' + assetName + '.ogg']);
                    });
                }
            });
        };
        Boot.prototype.shutdown = function () {
            //this.game.stage.removeChildren();
        };
        Boot.Name = 'booter';
        return Boot;
    }(Phaser.State));
    MortalKombat.Boot = Boot;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Preloader = /** @class */ (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            var _this = _super.call(this) || this;
            _this.name = Preloader.Name;
            _this.loadPercent = 0;
            return _this;
        }
        Preloader.prototype.init = function (config) {
            console.log("Mortal Kombat 2 Quest - Version - " + Config.version);
            this.config = config;
        };
        Preloader.prototype.preload = function () {
            this.game.add.sprite(0, 0, Images.PreloaderImage);
            this.logo = this.game.add.sprite(0, 0, Atlases.LogoAtlas, "load_1.png");
            this.logo.x = (this.game.world.width / 2) - (this.logo.width / 2);
            this.logo.y = (this.game.world.height / 2) - (this.logo.height / 2);
            this.preloadProcessText = this.game.add.text(330, 650, '. . . . . . . . . . . . . . . . . . . . . .', { font: "18px Georgia", fill: "#505050", align: "left" });
            this.preloadProcessCount = 7;
            this.preloadtimer = this.game.time.create(false);
            this.preloadtimer.loop(1000, this.onTimerComplete, this);
            this.preloadtimer.start(this.preloadProcessCount);
            this.game.load.onLoadStart.add(this.onLoadStart, this);
            this.game.load.onFileComplete.add(this.onFileComplete, this);
            this.game.load.onLoadComplete.add(this.onLoadComplete, this);
            this.config.preloadHandler();
            if (this.game.load.totalQueuedFiles() === 0) {
                this.onLoadComplete();
            }
        };
        Preloader.prototype.onTimerComplete = function () {
            this.preloadProcessCount++;
            if (this.preloadProcessCount >= 7) {
                this.preloadProcessText.text = " ";
                this.preloadProcessCount = 1;
            }
            else {
                for (var i = 0; i < this.preloadProcessCount; i++) {
                    this.preloadProcessText.text += ". ";
                }
            }
        };
        Preloader.prototype.onLoadStart = function () {
            this.preloadText = this.game.add.text(335, 600, "ЗАГРУЗКА 0%", { font: "24px Georgia", fill: "#505050" });
        };
        Preloader.prototype.onFileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            this.loadPercent = Math.round(progress * 0.1);
            if (this.loadPercent <= 0)
                this.loadPercent = 1;
            if (this.preloadText !== null) {
                this.logo.frameName = "load_" + this.loadPercent + ".png";
                this.preloadText.text = "ЗАГРУЗКА " + this.loadPercent + "0 %";
            }
        };
        Preloader.prototype.onLoadComplete = function () {
            this.preloadtimer.stop();
            this.preloadProcessText.text = " ";
            this.preloadtimer.destroy();
            this.logo.frameName = "load_" + this.loadPercent + ".png";
            this.game.stage.removeChildren();
            this.game.state.start(this.config.nextStage, true, false);
        };
        Preloader.Name = "preloader";
        return Preloader;
    }(Phaser.State));
    MortalKombat.Preloader = Preloader;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Tutorial = Fabrique.Tutorial;
    var Settings = Fabrique.Settings;
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            var _this = _super.call(this) || this;
            _this.name = Menu.Name;
            return _this;
        }
        Menu.prototype.create = function () {
            GameData.Data.initPersonages(this.game);
            this.initSounds();
            this.groupMenu = new Phaser.Group(this.game, this.stage);
            this.menuSprite = new Phaser.Sprite(this.game, -5, -5, Images.MenuImage);
            this.menuSprite.scale.set(1.025);
            this.groupMenu.addChild(this.menuSprite);
            this.videoSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Video1, 0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupMenu.addChild(this.videoSprite);
            this.startLogoSprite = new Phaser.Sprite(this.game, 125, 150, Images.StartLogoImage);
            this.startLogoSprite.alpha = 0;
            this.groupMenu.addChild(this.startLogoSprite);
            this.tween = this.game.add.tween(this.startLogoSprite);
            this.tween.to({ alpha: 1 }, 2500, 'Linear');
            this.tween.to({ alpha: 0 }, 2500, 'Linear');
            this.tween.start();
            var anim = this.videoSprite.animations.add(Atlases.Video1);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);
            this.createButtons();
            this.groupMenu.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        };
        Menu.prototype.shutdown = function () {
            this.tween.stop();
            this.tween = null;
            this.groupButtons.removeAll();
            this.groupMenu.removeAll();
            this.game.stage.removeChildren();
        };
        Menu.prototype.initSounds = function () {
            var _this = this;
            // восстановление звука при запуске игры
            this.game.input.onDown.addOnce(function () {
                _this.game.sound.context.resume();
            });
            if (GameData.Data.music === undefined || GameData.Data.music === null) {
                GameData.Data.music = this.game.add.audio(GameData.Data.musicList[0][0]);
                GameData.Data.buttonSound = this.game.add.audio(Sounds.button);
                GameData.Data.iconSound = this.game.add.audio(Sounds.hit_move);
                GameData.Data.voiceSound = this.game.add.audio(Sounds.fight);
                GameData.Data.userSound = this.game.add.audio(Sounds.hit_block);
                GameData.Data.enemieSound = this.game.add.audio(Sounds.hit_block);
            }
            else {
                GameData.Data.music.stop();
                GameData.Data.music.key = GameData.Data.musicList[0][0];
            }
            GameData.Data.music.loop = true;
            GameData.Data.music.volume = GameData.Data.musicList[0][1];
            if (Config.settingMusic)
                GameData.Data.music.play();
        };
        Menu.prototype.createButtons = function () {
            this.groupButtons = new Phaser.Group(this.game, this.groupMenu);
            this.groupButtons.x = -500;
            this.groupButtons.y = 0;
            this.groupButtons.visible = false;
            this.groupButtons.addChild(new Phaser.Sprite(this.game, 35, 80, Images.LogoImage));
            this.buttonStart = new Phaser.Button(this.game, 75, 400, Sheet.ButtonStartNewGame, this.onButtonClick, this, 1, 2);
            this.buttonStart.name = Constants.START;
            this.groupButtons.addChild(this.buttonStart);
            this.buttonSettings = new Phaser.Button(this.game, 75, 475, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.buttonSettings.name = Constants.SETTINGS;
            this.groupButtons.addChild(this.buttonSettings);
            this.buttonInvite = new Phaser.Button(this.game, 75, 550, Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
            this.buttonInvite.name = Constants.INVITE;
            this.groupButtons.addChild(this.buttonInvite);
            if (GameData.Data.saveData !== undefined) {
                SocialVK.LoadData(GameData.Data.saveData);
                this.buttonContinue = new Phaser.Button(this.game, 75, 400, Sheet.ButtonСontinueGame, this.onButtonClick, this, 1, 2);
                this.buttonContinue.name = Constants.CONTINUE;
                this.groupButtons.addChild(this.buttonContinue);
                this.buttonStart.x = 75;
                this.buttonStart.y = 475;
                this.buttonSettings.x = 75;
                this.buttonSettings.y = 550;
                this.buttonInvite.x = 75;
                this.buttonInvite.y = 625;
            }
            else {
                SocialVK.vkLoadData(this.onVkDataGet.bind(this));
            }
            this.tutorial = new Tutorial(this.game, 'Сразись с бойцами\nШао Кана. Победи его\nна турнире чтобы спасти\nземное царство.');
            if (GameData.Data.saveData !== undefined)
                this.tutorial.setText('Продолжайте битву\nна турнире.\nПобеди Шао Кана.\nСпаси земное царство.');
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupMenu.addChild(this.tutorial);
        };
        Menu.prototype.onVkDataGet = function (object) {
            //console.log(object);
            try {
                if (SocialVK.LoadData(object.response.toString()) === true) {
                    this.buttonContinue = new Phaser.Button(this.game, 75, 400, Sheet.ButtonСontinueGame, this.onButtonClick, this, 1, 2);
                    this.buttonContinue.name = Constants.CONTINUE;
                    this.groupButtons.addChild(this.buttonContinue);
                    this.buttonStart.x = 75;
                    this.buttonStart.y = 475;
                    this.buttonSettings.x = 75;
                    this.buttonSettings.y = 550;
                    this.buttonInvite.x = 75;
                    this.buttonInvite.y = 625;
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        Menu.prototype.onCompleteVideo = function () {
            var _this = this;
            this.groupButtons.visible = true;
            this.tween = this.game.add.tween(this.menuSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0 }, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            var tweenButtons = this.game.add.tween(this.groupButtons);
            tweenButtons.to({ x: 0, y: 0 }, 500, 'Linear');
            tweenButtons.onComplete.add(function () {
                _this.tween.start();
                if (Config.settingTutorial === true)
                    _this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));
            }, this);
            tweenButtons.start();
        };
        Menu.prototype.onTweenComplete = function (event) {
            this.tween.start();
        };
        Menu.prototype.onButtonClick = function (event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.START:
                    {
                        GameData.Data.initPersonages(this.game);
                        this.game.state.start(MortalKombat.Fighters.Name, true, false);
                        break;
                    }
                case Constants.CONTINUE:
                    {
                        if (GameData.Data.user_continue <= 0)
                            this.game.state.start(MortalKombat.GameOver.Name, true, false);
                        else if (GameData.Data.tournamentProgress > 12)
                            this.game.state.start(MortalKombat.GameOver.Name, true, false);
                        else
                            this.game.state.start(MortalKombat.Tournament.Name, true, false);
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.settingsClose();
                        break;
                    }
                case Constants.INVITE:
                    {
                        SocialVK.vkInvite();
                        break;
                    }
                default:
                    break;
            }
        };
        Menu.prototype.playButtonSound = function () {
            if (Config.settingSound) {
                GameData.Data.buttonSound.loop = false;
                GameData.Data.buttonSound.volume = 0.5;
                GameData.Data.buttonSound.play();
            }
        };
        Menu.prototype.settingsCreate = function () {
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.settings = new Settings(this.game, this.groupMenu);
            this.settings.event.add(this.onButtonClick.bind(this));
        };
        Menu.prototype.settingsClose = function () {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupMenu.removeChild(this.settings);
            if (Config.settingTutorial === true) {
                var tweenTutorial = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175) }, 500, 'Linear');
                tweenTutorial.start();
            }
        };
        Menu.Name = "menu";
        return Menu;
    }(Phaser.State));
    MortalKombat.Menu = Menu;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Tutorial = Fabrique.Tutorial;
    var Settings = Fabrique.Settings;
    var Help = Fabrique.Help;
    var Title = Fabrique.Title;
    var PanelIcons = Fabrique.PanelIcons;
    var Fighters = /** @class */ (function (_super) {
        __extends(Fighters, _super);
        function Fighters() {
            var _this = _super.call(this) || this;
            _this.name = MortalKombat.Menu.Name;
            return _this;
        }
        Fighters.prototype.create = function () {
            this.groupFighters = new Phaser.Group(this.game, this.stage);
            this.fightersSprite = new Phaser.Sprite(this.game, -5, -5, Images.FightersImage);
            this.fightersSprite.scale.set(1.025);
            this.groupFighters.addChild(this.fightersSprite);
            this.tween = this.game.add.tween(this.fightersSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0 }, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            this.videoSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Video2, 0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupFighters.addChild(this.videoSprite);
            var anim = this.videoSprite.animations.add(Atlases.Video2);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);
            this.createContent();
            this.groupFighters.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        };
        Fighters.prototype.shutdown = function () {
            this.tween.stop();
            this.tween = null;
            this.title.removeChildren();
            this.panelIcons.removeChildren();
            this.panelIcons.removeAll();
            this.tutorial.removeChildren();
            this.groupFighters.removeChildren();
            this.groupFighters.removeAll();
            this.game.stage.removeChildren();
        };
        Fighters.prototype.onCompleteVideo = function () {
            this.tween.start();
            this.title.show();
            if (Config.settingTutorial === true)
                this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));
            this.backMenuButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonBackMenuMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backMenuButton.name = Constants.BACK_MENU;
            this.groupFighters.addChild(this.backMenuButton);
            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), 5, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupFighters.addChild(this.settingsButton);
            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupFighters.addChild(this.helpButton);
            this.selectButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), (Constants.GAME_HEIGHT - 50), Sheet.ButtonSelectFighter, this.onButtonClick, this, 1, 2, 2, 2);
            this.selectButton.name = Constants.SELECT_FIGHTER;
            this.groupFighters.addChild(this.selectButton);
            this.panelIcons.show();
        };
        Fighters.prototype.onTweenComplete = function (event) {
            this.tween.start();
        };
        Fighters.prototype.createContent = function () {
            /* title */
            this.title = new Title(this.game, 0, -50, 'ВЫБОР БОЙЦА');
            this.groupFighters.addChild(this.title);
            /* panel icons */
            this.panelIcons = new PanelIcons(this.game, this.groupFighters);
            /* tutorial */
            //this.tutorial = new Tutorial(this.game, 'Нажмите на иконку\nбойца и на кнопку\n"Выбрать бойца');
            this.tutorial = new Tutorial(this.game, 'Выбери бойца\nсудьба которого\nстать избранным.');
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupFighters.addChild(this.tutorial);
        };
        Fighters.prototype.onButtonClick = function (event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.BACK_MENU:
                    {
                        this.game.state.start(MortalKombat.Menu.Name, true, false);
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.settingsClose();
                        break;
                    }
                case Constants.HELP:
                    {
                        this.helpCreate();
                        break;
                    }
                case Constants.HELP_CLOSE:
                    {
                        this.helpClose();
                        break;
                    }
                case Constants.SELECT_FIGHTER:
                    {
                        GameData.Data.initNewGame();
                        GameData.Data.saveData = SocialVK.vkSaveData();
                        this.game.state.start(MortalKombat.Tournament.Name, true, false);
                        break;
                    }
                default:
                    break;
            }
        };
        Fighters.prototype.playButtonSound = function () {
            if (Config.settingSound) {
                GameData.Data.buttonSound.loop = false;
                GameData.Data.buttonSound.volume = 0.5;
                GameData.Data.buttonSound.play();
            }
        };
        Fighters.prototype.settingsCreate = function () {
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.settings = new Settings(this.game, this.groupFighters);
            this.settings.event.add(this.onButtonClick.bind(this));
        };
        Fighters.prototype.settingsClose = function () {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupFighters.removeChild(this.settings);
            if (Config.settingTutorial === true) {
                var tweenTutorial = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175) }, 500, 'Linear');
                tweenTutorial.start();
            }
        };
        Fighters.prototype.helpCreate = function () {
            this.help = new Help(this.game, this.groupFighters, "ВЫБОР БОЙЦА.\n\n1. Нажмите на иконку персонажа.\n\nОбратите внимание на окно характеристик персонажа,\nданная информация поможет вам выбрать персонаж\nс наилучшими характеристиками.\n\n2. Нажмите кнопку \"Выбрать бойца\" чтобы перейти в\n    окно турнира.");
            this.help.event.add(this.onButtonClick.bind(this));
        };
        Fighters.prototype.helpClose = function () {
            this.help.removeChildren();
            this.help.removeAll();
            this.groupFighters.removeChild(this.help);
        };
        Fighters.Name = "fighters";
        return Fighters;
    }(Phaser.State));
    MortalKombat.Fighters = Fighters;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Tutorial = Fabrique.Tutorial;
    var Settings = Fabrique.Settings;
    var Help = Fabrique.Help;
    var Title = Fabrique.Title;
    var Tower = Fabrique.Tower;
    var UpgradeCharacteristics = Fabrique.UpgradeCharacteristics;
    var Tournament = /** @class */ (function (_super) {
        __extends(Tournament, _super);
        function Tournament() {
            var _this = _super.call(this) || this;
            _this.name = Tournament.Name;
            return _this;
        }
        Tournament.prototype.create = function () {
            this.groupContent = new Phaser.Group(this.game, this.stage);
            this.backgroundSprite = new Phaser.Sprite(this.game, -5, -5, Images.UpgradeImage);
            this.backgroundSprite.scale.set(1.025);
            this.groupContent.addChild(this.backgroundSprite);
            this.tween = this.game.add.tween(this.backgroundSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0 }, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            this.videoSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Video3, 0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupContent.addChild(this.videoSprite);
            var anim = this.videoSprite.animations.add(Atlases.Video3);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);
            this.createContent();
            this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        };
        Tournament.prototype.shutdown = function () {
            this.tween.stop();
            this.tween = null;
            this.title.removeChildren();
            this.tower.removeChildren();
            this.tower.removeAll();
            this.tutorial.removeChildren();
            this.userUpgradeCharacteristics.removeChildren();
            this.userUpgradeCharacteristics.removeAll();
            this.enemyUpgradeCharacteristics.removeChildren();
            this.enemyUpgradeCharacteristics.removeAll();
            this.groupContent.removeAll();
            this.game.stage.removeChildren();
        };
        Tournament.prototype.onCompleteVideo = function () {
            this.tween.start();
            this.title.show();
            if (Config.settingTutorial === true)
                this.tutorial.show(0, 150);
            this.tower.show(this.tower.x, 0);
            this.userUpgradeCharacteristics.show(50, this.userUpgradeCharacteristics.y);
            this.enemyUpgradeCharacteristics.show(600, this.enemyUpgradeCharacteristics.y);
            this.backButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonBackMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backButton.name = Constants.BACK_MENU;
            this.groupContent.addChild(this.backButton);
            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), 5, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupContent.addChild(this.settingsButton);
            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupContent.addChild(this.helpButton);
            this.startButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), (Constants.GAME_HEIGHT - 50), Sheet.ButtonStartBattle, this.onButtonClick, this, 1, 2, 2, 2);
            this.startButton.name = Constants.START;
            this.groupContent.addChild(this.startButton);
        };
        Tournament.prototype.onTweenComplete = function (event) {
            this.tween.start();
        };
        Tournament.prototype.createContent = function () {
            /* tower */
            this.tower = new Tower(this.game);
            this.tower.x = (Constants.GAME_HEIGHT / 2) - (this.tower.width / 3);
            this.tower.y = Constants.GAME_WIDTH;
            this.groupContent.addChild(this.tower);
            /* title */
            this.title = new Title(this.game, 0, -50, 'ТУРНИР');
            this.groupContent.addChild(this.title);
            /* tutorial */
            this.tutorial = new Tutorial(this.game, '');
            this.tutorial.x = -500;
            this.tutorial.y = 150;
            this.groupContent.addChild(this.tutorial);
            this.updateTutorial();
            /* Upgrade */
            this.userUpgradeCharacteristics = new UpgradeCharacteristics(this.game, true, this);
            this.userUpgradeCharacteristics.x = -500;
            this.userUpgradeCharacteristics.y = 300;
            this.groupContent.addChild(this.userUpgradeCharacteristics);
            this.enemyUpgradeCharacteristics = new UpgradeCharacteristics(this.game, false);
            this.enemyUpgradeCharacteristics.x = Constants.GAME_WIDTH + 500;
            this.enemyUpgradeCharacteristics.y = 300;
            this.groupContent.addChild(this.enemyUpgradeCharacteristics);
            Utilits.Data.debugLog("TOURNAMENT - CHANGE USER PERSOHAGE", GameData.Data.user_personage);
        };
        Tournament.prototype.updateTutorial = function () {
            if (GameData.Data.user_upgrade_points > 0) {
                if (GameData.Data.user_upgrade_points === 1)
                    this.tutorial.setText('Вам доступно ' + GameData.Data.user_upgrade_points + ' очко\nнераспределенного опыта');
                else if (GameData.Data.user_upgrade_points < 5)
                    this.tutorial.setText('Вам доступно ' + GameData.Data.user_upgrade_points + ' очка\nнераспределенного опыта');
                else if (GameData.Data.user_upgrade_points > 5)
                    this.tutorial.setText('Вам доступно ' + GameData.Data.user_upgrade_points + ' очков\nнераспределенного опыта');
                else
                    this.tutorial.setText('Вам доступно ' + GameData.Data.user_upgrade_points + ' очков\nнераспределенного опыта');
            }
            else
                this.tutorial.setText('У вас осталось ' + GameData.Data.user_continue + ' попыток\nчтобы победить Шао Кана\nи спасти земное царство');
        };
        Tournament.prototype.onButtonClick = function (event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.START:
                    {
                        this.game.state.start(MortalKombat.Level.Name, true, false);
                        break;
                    }
                case Constants.BACK_MENU:
                    {
                        if (GameData.Data.tournamentProgress === 0)
                            this.game.state.start(MortalKombat.Fighters.Name, true, false);
                        else
                            this.game.state.start(MortalKombat.Menu.Name, true, false);
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.settingsClose();
                        break;
                    }
                case Constants.HELP:
                    {
                        this.helpCreate();
                        break;
                    }
                case Constants.HELP_CLOSE:
                    {
                        this.helpClose();
                        break;
                    }
                default:
                    break;
            }
        };
        Tournament.prototype.settingsCreate = function () {
            this.tutorial.x = -500;
            this.tutorial.y = 150;
            this.settings = new Settings(this.game, this.groupContent);
            this.settings.event.add(this.onButtonClick.bind(this));
        };
        Tournament.prototype.settingsClose = function () {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupContent.removeChild(this.settings);
            if (Config.settingTutorial === true) {
                var tweenTutorial = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: 0, y: 150 }, 500, 'Linear');
                tweenTutorial.start();
            }
        };
        Tournament.prototype.helpCreate = function () {
            this.help = new Help(this.game, this.groupContent, "ТУРНИР.\n\n- В самом начале игры вам доступно 9-ть попыток.\nКаждое поражение в битве будет отнимать у вас по 1-й попытке.\nВы проиграете когда у вас запончится последняя попытка.\n\n- Каждая победа в битве дает вам 1 очко опыта.\nПолученные очки опыта вы можете потратить на прокачку\nхарактеристик вашего персонажа.\n\n- Чтобы начать бой нажмите на кнопку \"Начать битву\".");
            this.help.event.add(this.onButtonClick.bind(this));
        };
        Tournament.prototype.helpClose = function () {
            this.help.removeChildren();
            this.help.removeAll();
            this.groupContent.removeChild(this.help);
        };
        Tournament.prototype.playButtonSound = function () {
            if (Config.settingSound) {
                GameData.Data.buttonSound.loop = false;
                GameData.Data.buttonSound.volume = 0.5;
                GameData.Data.buttonSound.play();
            }
        };
        Tournament.Name = "tournament";
        return Tournament;
    }(Phaser.State));
    MortalKombat.Tournament = Tournament;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var AnimationFighter = Fabrique.AnimationFighter;
    var LifeBar = Fabrique.LifeBar;
    var Field = Match3.Field;
    var DamageCounter = Fabrique.DamageCounter;
    var DialodFightWinsDied = Fabrique.DialodFightWinsDied;
    var Tutorial = Fabrique.Tutorial;
    var Settings = Fabrique.Settings;
    var Help = Fabrique.Help;
    var Level = /** @class */ (function (_super) {
        __extends(Level, _super);
        function Level() {
            var _this = _super.call(this) || this;
            _this.name = MortalKombat.Tournament.Name;
            return _this;
        }
        Level.prototype.create = function () {
            this.playMusic();
            this.groupContent = new Phaser.Group(this.game, this.stage);
            this.backgroundSprite = new Phaser.Sprite(this.game, 0, 0, GameData.Data.levels[GameData.Data.tournamentProgress][0]);
            this.groupContent.addChild(this.backgroundSprite);
            this.borderSprite = new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage);
            this.groupContent.addChild(this.borderSprite);
            this.surrenderButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonSurrender, this.onButtonClick, this, 1, 2, 2, 2);
            this.surrenderButton.name = Constants.SURRENDER;
            this.groupContent.addChild(this.surrenderButton);
            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupContent.addChild(this.helpButton);
            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), (Constants.GAME_HEIGHT - 50), Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupContent.addChild(this.settingsButton);
            var valueJSON = this.game.cache.getJSON(GameData.Data.levels[GameData.Data.tournamentProgress][1]);
            this.field = new Field(this.game, this.groupContent);
            this.field.event.add(this.onMatch, this);
            this.field.createMatchField(valueJSON);
            //this.persUser = GameData.Data.user_personage;
            this.persUser = {};
            this.persUser.id = GameData.Data.user_personage.id;
            this.persUser.name = GameData.Data.user_personage.name;
            this.persUser.hand = GameData.Data.user_personage.hand;
            this.persUser.leg = GameData.Data.user_personage.leg;
            this.persUser.block = GameData.Data.user_personage.block;
            this.persUser.uppercut = GameData.Data.user_personage.uppercut;
            this.persUser.twist = GameData.Data.user_personage.twist;
            this.persUser.life = GameData.Data.user_personage.life;
            this.persUser.animStance = GameData.Data.user_personage.animStance;
            this.persUser.animHitHand = GameData.Data.user_personage.animHitHand;
            this.persUser.animHitHandUppercut = GameData.Data.user_personage.animHitHandUppercut;
            this.persUser.animHitLeg = GameData.Data.user_personage.animHitLeg;
            this.persUser.animHitLegTwist = GameData.Data.user_personage.animHitLegTwist;
            this.persUser.animBlock = GameData.Data.user_personage.animBlock;
            this.persUser.animDamage = GameData.Data.user_personage.animDamage;
            this.persUser.animLose = GameData.Data.user_personage.animLose;
            this.persUser.animWin = GameData.Data.user_personage.animWin;
            this.animUser = new AnimationFighter(this.game, this.persUser.id, this.persUser, false);
            this.animUser.x = 100 - (this.animUser.width / 2);
            this.animUser.y = Constants.GAME_HEIGHT - (this.animUser.height * 2);
            this.animUser.scale.x = 1.5;
            this.animUser.scale.y = 1.5;
            this.groupContent.addChild(this.animUser);
            this.damageCounterUser = new DamageCounter(this.game, this.animUser.x + (this.animUser.width / 2) - 15, this.animUser.y - 15);
            this.groupContent.addChild(this.damageCounterUser);
            this.persEnemies = GameData.Data.getNewPersonage(GameData.Data.id_enemies[GameData.Data.tournamentProgress]);
            this.animEnemies = new AnimationFighter(this.game, this.persEnemies.id, this.persEnemies, false);
            if (GameData.Data.tournamentProgress < 11) {
                this.animEnemies.x = Constants.GAME_WIDTH - 25 - (this.animEnemies.width / 2);
                this.animEnemies.y = Constants.GAME_HEIGHT - (this.animEnemies.height * 2);
                this.animEnemies.anchor.setTo(.0, .0);
                this.animEnemies.scale.x = 1.5;
                this.animEnemies.scale.y = 1.5;
                this.animEnemies.scale.x *= -1;
            }
            else {
                this.animEnemies.x = Constants.GAME_WIDTH - 135 - (this.animEnemies.width / 2);
                this.animEnemies.y = Constants.GAME_HEIGHT - (this.animEnemies.height * 2);
                this.animEnemies.anchor.setTo(.0, .0);
                this.animEnemies.scale.x = 1.5;
                this.animEnemies.scale.y = 1.5;
            }
            this.groupContent.addChild(this.animEnemies);
            this.damageCounterEnemies = new DamageCounter(this.game, this.animEnemies.x + (this.animEnemies.width / 2) - 15, this.animEnemies.y - 15);
            this.groupContent.addChild(this.damageCounterEnemies);
            this.userLifebar = new LifeBar(this.game, 45, 35, this.persUser.name, this.persUser.life);
            this.groupContent.addChild(this.userLifebar);
            this.enemiesLifebar = new LifeBar(this.game, 282, 35, this.persEnemies.name, this.persEnemies.life);
            this.groupContent.addChild(this.enemiesLifebar);
            /* tutorial */
            this.tutorial = new Tutorial(this.game, 'Соберите 3-и фишки\nв ряд чтобы\nнанести удар');
            this.tutorial.x = Constants.GAME_WIDTH + 50;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupContent.addChild(this.tutorial);
            if (Config.settingTutorial === true && GameData.Data.tournamentProgress == 0)
                this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));
            this.dialog = new DialodFightWinsDied(this.game);
            this.dialog.event.add(this.onDialog, this);
            this.groupContent.addChild(this.dialog);
            this.dialog.showFight();
            this.playSoundFight();
            Utilits.Data.debugLog("PERS USER:", this.persUser);
            Utilits.Data.debugLog("PERS ENEMIES:", this.persEnemies);
            Utilits.Data.debugLog("PERSONAGER:", GameData.Data.personages);
        };
        /* Произошло событие match на поле */
        Level.prototype.onMatch = function (hitType, hitCount, statusAction) {
            //Utilits.Data.debugLog("LEVEL: match |", "type=" + hitType + " | count=" + hitCount + " | status=" + statusAction);
            if (GameData.Data.tournamentProgress == 0 && this.tutorial.x != Constants.GAME_WIDTH)
                this.tutorial.x = Constants.GAME_WIDTH + 50;
            if (this.field.gameOver === true)
                return;
            if (hitType === null && hitCount === null) {
                if (statusAction === Field.ACTION_PLAYER) {
                    this.animUser.block = false; // сбросить блок игрока
                    this.animUser.changeAnimation(Constants.ANIMATION_TYPE_STANCE);
                }
                else {
                    this.animEnemies.block = false; // сбросить блок оппонента
                    this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_STANCE);
                }
                this.checkGameOver(); // проверка завершения битвы
            }
            else {
                this.playUserEnemiesSound(statusAction, hitType);
                if (statusAction === Field.ACTION_PLAYER) { // Противник получает урон
                    var damageValue = GameData.Data.calcDamage(this.persUser, this.animEnemies.block, hitType, hitCount);
                    if (hitType === Constants.HAND)
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND);
                    if (hitType === Constants.LEG)
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG);
                    if (hitType === Constants.BLOCK)
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_BLOCK);
                    if (hitType === Constants.TWIST)
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG_TWIST);
                    if (hitType === Constants.UPPERCUT)
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT);
                    if (hitType !== Constants.BLOCK) {
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_DAMAGE);
                        this.animEnemies.showBlood();
                        this.damageCounterEnemies.show(damageValue.toString(), this.animEnemies.block);
                    }
                    this.persEnemies.life = this.persEnemies.life - damageValue;
                    this.enemiesLifebar.lifeUpdate(this.persEnemies.life);
                }
                else { // Игрок получает урон
                    var damageValue = GameData.Data.calcDamage(this.persEnemies, this.animUser.block, hitType, hitCount);
                    if (hitType === Constants.HAND)
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND);
                    if (hitType === Constants.LEG)
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG);
                    if (hitType === Constants.BLOCK)
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_BLOCK);
                    if (hitType === Constants.TWIST)
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG_TWIST);
                    if (hitType === Constants.UPPERCUT)
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT);
                    if (hitType !== Constants.BLOCK) {
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_DAMAGE);
                        this.animUser.showBlood();
                        this.damageCounterUser.show(damageValue.toString(), this.animUser.block);
                    }
                    this.persUser.life = this.persUser.life - damageValue;
                    this.userLifebar.lifeUpdate(this.persUser.life);
                }
            }
        };
        Level.prototype.shutdown = function () {
            this.field.shutdown();
            this.groupContent.removeChild(this.backgroundSprite);
            this.backgroundSprite.destroy();
            this.groupContent.removeChild(this.borderSprite);
            this.borderSprite.destroy();
            this.groupContent.removeChild(this.surrenderButton);
            this.surrenderButton.destroy();
            this.groupContent.removeChild(this.helpButton);
            this.helpButton.destroy();
            this.groupContent.removeChild(this.settingsButton);
            this.settingsButton.destroy();
            this.groupContent.removeChild(this.animUser);
            this.animUser.destroy();
            this.groupContent.removeChild(this.damageCounterUser);
            this.damageCounterUser.destroy();
            this.groupContent.removeChild(this.animEnemies);
            this.animEnemies.destroy();
            this.groupContent.removeChild(this.damageCounterEnemies);
            this.damageCounterEnemies.destroy();
            this.groupContent.removeChild(this.userLifebar);
            this.userLifebar.destroy();
            this.groupContent.removeChild(this.enemiesLifebar);
            this.enemiesLifebar.destroy();
            this.groupContent.removeChild(this.tutorial);
            this.tutorial.destroy();
            this.groupContent.removeChild(this.dialog);
            this.dialog.destroy();
            this.groupContent.removeChildren();
            this.groupContent.removeAll();
            this.groupContent.destroy();
            this.game.stage.removeChildren();
        };
        Level.prototype.onButtonClick = function (event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.SURRENDER:
                    {
                        this.field.isGameOver();
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                        this.dialog.showDied();
                        this.playSoundLost();
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.field.timerPause(true);
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.field.timerPause(false);
                        this.settingsClose();
                        break;
                    }
                case Constants.HELP:
                    {
                        this.field.timerPause(true);
                        this.helpCreate();
                        break;
                    }
                case Constants.HELP_CLOSE:
                    {
                        this.field.timerPause(false);
                        this.helpClose();
                        break;
                    }
                default:
                    break;
            }
        };
        Level.prototype.playButtonSound = function () {
            if (Config.settingSound) {
                GameData.Data.buttonSound.loop = false;
                GameData.Data.buttonSound.volume = 0.5;
                GameData.Data.buttonSound.play();
            }
        };
        Level.prototype.settingsCreate = function () {
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.settings = new Settings(this.game, this.groupContent);
            this.settings.event.add(this.onButtonClick.bind(this));
        };
        Level.prototype.settingsClose = function () {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupContent.removeChild(this.settings);
            if (Config.settingTutorial === true && GameData.Data.tournamentProgress == 0) {
                var tweenTutorial = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175) }, 500, 'Linear');
                tweenTutorial.start();
            }
        };
        Level.prototype.checkGameOver = function () {
            Utilits.Data.debugLog("LIFE:", "User = " + this.persUser.life + " | Enemies = " + this.persEnemies.life);
            if (this.persUser.life > 0 && this.persEnemies.life <= 0) { // Пользователь - победил
                this.field.isGameOver();
                this.animUser.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                this.dialog.showWins();
                this.playSoundWin();
            }
            else if (this.persUser.life <= 0 && this.persEnemies.life > 0) { // Оппонент - победил
                this.field.isGameOver();
                this.animUser.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                this.dialog.showDied();
                this.playSoundLost();
            }
            else if (this.persUser.life <= 0 && this.persEnemies.life <= 0) { // Ничья
                this.field.isGameOver();
                this.animUser.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                this.dialog.showWins();
                this.playSoundWin();
            }
            else { // бой продолжается
            }
        };
        Level.prototype.onDialog = function (event) {
            //Utilits.Data.debugLog("DIALOG EVENT:", event);
            if (event === DialodFightWinsDied.WINS) {
                if (this.persEnemies.id === Constants.ID_GORO)
                    GameData.Data.user_upgrade_points += 1;
                else
                    GameData.Data.user_upgrade_points += 1;
                GameData.Data.tournamentProgress++;
                SocialVK.vkWallPost();
            }
            else {
                GameData.Data.user_continue--;
            }
            GameData.Data.saveData = SocialVK.vkSaveData();
            if (GameData.Data.user_continue <= 0)
                this.game.state.start(MortalKombat.GameOver.Name, true, false);
            else if (GameData.Data.tournamentProgress > 12)
                this.game.state.start(MortalKombat.GameOver.Name, true, false);
            else
                this.game.state.start(MortalKombat.Tournament.Name, true, false);
            this.playMenuMusic();
        };
        Level.prototype.helpCreate = function () {
            this.help = new Help(this.game, this.groupContent, "- Чтобы победить противника у него должа закончиться жизнь.\n\n- Чтобы нанести удар противнику вы должны собрать на поле\nв ряд 3-и и более фишек.\n\n- Удары наносятся по очереди, сначала вы потом ваш оппонент.\n\n- На принятие решения у вас есть 10-ть секунд, после чего\nход переходит к противнику.\n\n- Кнопка \"Сдаться\" завершает битву и вам будет засчитано\n поражение в битве.");
            this.help.event.add(this.onButtonClick.bind(this));
        };
        Level.prototype.helpClose = function () {
            this.help.removeChildren();
            this.help.removeAll();
            this.groupContent.removeChild(this.help);
        };
        Level.prototype.playSoundFight = function () {
            if (Config.settingSound) {
                GameData.Data.voiceSound.key = Sounds.fight;
                GameData.Data.voiceSound.loop = false;
                GameData.Data.voiceSound.volume = 1.0;
                GameData.Data.voiceSound.play();
            }
        };
        Level.prototype.playSoundLost = function () {
            if (Config.settingSound) {
                GameData.Data.voiceSound.key = Sounds.lost;
                GameData.Data.voiceSound.loop = false;
                GameData.Data.voiceSound.volume = 1.0;
                GameData.Data.voiceSound.play();
            }
        };
        Level.prototype.playSoundWin = function () {
            if (Config.settingSound) {
                GameData.Data.voiceSound.key = Sounds.wins;
                GameData.Data.voiceSound.loop = false;
                GameData.Data.voiceSound.volume = 1.0;
                GameData.Data.voiceSound.play();
            }
        };
        Level.prototype.playMusic = function () {
            GameData.Data.music.stop();
            GameData.Data.music.key = GameData.Data.musicList[GameData.Data.musicSelected][0];
            GameData.Data.music.loop = true;
            GameData.Data.music.volume = GameData.Data.musicList[GameData.Data.musicSelected][1];
            if (Config.settingMusic)
                GameData.Data.music.play();
            if (GameData.Data.musicSelected === 1)
                GameData.Data.musicSelected = 2;
            else
                GameData.Data.musicSelected = 1;
        };
        Level.prototype.playMenuMusic = function () {
            GameData.Data.music.stop();
            GameData.Data.music.key = GameData.Data.musicList[0][0];
            GameData.Data.music.loop = true;
            GameData.Data.music.volume = GameData.Data.musicList[0][1];
            if (Config.settingMusic)
                GameData.Data.music.play();
        };
        Level.prototype.playUserEnemiesSound = function (statusAction, hitType) {
            GameData.Data.userSound.loop = false;
            GameData.Data.userSound.volume = 1.0;
            GameData.Data.enemieSound.loop = false;
            GameData.Data.enemieSound.volume = 1.0;
            if (statusAction === Field.ACTION_PLAYER) { // Противник получает урон
                if (hitType === Constants.HAND)
                    GameData.Data.userSound.key = Sounds.hit_2_4;
                if (hitType === Constants.LEG)
                    GameData.Data.userSound.key = Sounds.hit_1_5;
                if (hitType === Constants.TWIST)
                    GameData.Data.userSound.key = Sounds.hit_1_5;
                if (hitType === Constants.UPPERCUT)
                    GameData.Data.userSound.key = Sounds.hit_2_4;
                if (hitType === Constants.BLOCK) {
                    GameData.Data.enemieSound.key = Sounds.hit_block;
                    if (Config.settingSound) {
                        GameData.Data.enemieSound.play();
                    }
                }
                else {
                    if (this.persEnemies.id === Constants.ID_KITANA || this.persEnemies.id === Constants.ID_MILEENA)
                        GameData.Data.enemieSound.key = Sounds.f_d_03;
                    else
                        GameData.Data.enemieSound.key = Sounds.m_d_03;
                    if (Config.settingSound) {
                        GameData.Data.userSound.play();
                        if (this.animEnemies.block === false)
                            GameData.Data.enemieSound.play();
                    }
                }
            }
            else { // Игрок получает урон
                if (hitType === Constants.HAND)
                    GameData.Data.enemieSound.key = Sounds.hit_2_4;
                if (hitType === Constants.LEG)
                    GameData.Data.enemieSound.key = Sounds.hit_1_5;
                if (hitType === Constants.TWIST)
                    GameData.Data.enemieSound.key = Sounds.hit_1_5;
                if (hitType === Constants.UPPERCUT)
                    GameData.Data.enemieSound.key = Sounds.hit_2_4;
                if (hitType === Constants.BLOCK) {
                    GameData.Data.userSound.key = Sounds.hit_block;
                    if (Config.settingSound) {
                        GameData.Data.userSound.play();
                    }
                }
                else {
                    if (this.persUser.id === Constants.ID_KITANA || this.persUser.id === Constants.ID_MILEENA)
                        GameData.Data.userSound.key = Sounds.f_d_03;
                    else
                        GameData.Data.userSound.key = Sounds.m_d_03;
                    if (Config.settingSound) {
                        GameData.Data.enemieSound.play();
                        if (this.animUser.block === false)
                            GameData.Data.userSound.play();
                    }
                }
            }
        };
        Level.Name = "level";
        return Level;
    }(Phaser.State));
    MortalKombat.Level = Level;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var GameOver = /** @class */ (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            var _this = _super.call(this) || this;
            _this.name = GameOver.Name;
            return _this;
        }
        GameOver.prototype.create = function () {
            this.groupContent = new Phaser.Group(this.game, this.stage);
            this.closeButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - 255 - 50, (Constants.GAME_HEIGHT - 50), Sheet.ButtonClose, this.onButtonClick, this, 1, 2, 2, 2);
            this.closeButton.name = Constants.CLOSE;
            this.inviteButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) + 50, (Constants.GAME_HEIGHT - 50), Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
            this.inviteButton.name = Constants.INVITE;
            if (GameData.Data.tournamentProgress <= 12) {
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_lose));
                this.messageText = this.game.add.text(400, 100, 'Вы проиграли!\nУ вас не осталось попыток.\nВы можете начать игру заново, \nили получить 1-ну дополнительную попытку\nза приглашение друга в игру.', { font: "18px Georgia", fill: "#AAAAAA", align: "left" });
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
                this.groupContent.addChild(this.messageText);
                this.groupContent.addChild(this.closeButton);
                this.groupContent.addChild(this.inviteButton);
            }
            else {
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_win));
                this.messageText = this.game.add.text(55, 500, 'Вы победили!\nВам удалось спасти\nземное царство от вторжения.', { font: "18px Georgia", fill: "#DDDDDD", align: "left" });
                this.closeButton.x = (Constants.GAME_WIDTH / 2) - (255 / 2);
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
                this.groupContent.addChild(this.messageText);
                this.groupContent.addChild(this.closeButton);
            }
        };
        GameOver.prototype.shutdown = function () {
            this.groupContent.removeChildren();
            this.groupContent.removeAll();
            this.groupContent.destroy();
            this.messageText.destroy();
            this.closeButton.destroy();
            this.inviteButton.destroy();
            this.game.stage.removeChildren();
        };
        GameOver.prototype.onButtonClick = function (event) {
            switch (event.name) {
                case Constants.CLOSE:
                    {
                        if (GameData.Data.tournamentProgress > 12)
                            SocialVK.vkWallPostWin();
                        this.game.state.start(MortalKombat.Menu.Name, true, false);
                        break;
                    }
                case Constants.INVITE:
                    {
                        SocialVK.vkInvite();
                        GameData.Data.user_continue += 1;
                        this.game.state.start(MortalKombat.Tournament.Name, true, false);
                        break;
                    }
                default:
                    break;
            }
        };
        GameOver.Name = "gameover";
        return GameOver;
    }(Phaser.State));
    MortalKombat.GameOver = GameOver;
})(MortalKombat || (MortalKombat = {}));
/// <reference path="..\node_modules\phaser-ce\typescript\phaser.d.ts" />
/// <reference path="Match3\Timer.ts" />
/// <reference path="Match3\Cell.ts" />
/// <reference path="Match3\Unit.ts" />
/// <reference path="Match3\Field.ts" />
/// <reference path="Data\Constants.ts" />
/// <reference path="Data\Config.ts" />
/// <reference path="Data\Utilits.ts" />
/// <reference path="Data\Images.ts" />
/// <reference path="Data\Sounds.ts" />
/// <reference path="Data\Atlases.ts" />
/// <reference path="Data\Sheets.ts" />
/// <reference path="Data\Characteristics.ts" />
/// <reference path="Data\Levels.ts" />
/// <reference path="Data\Animations.ts" />
/// <reference path="Data\GameData.ts" />
/// <reference path="Data\SocialVK.ts" />
/// <reference path="Fabrique\Objects\Blood.ts" />
/// <reference path="Fabrique\Objects\DamageCounter.ts" />
/// <reference path="Fabrique\Objects\DialogFightWinsDied.ts" />
/// <reference path="Fabrique\Objects\AnimationFighter.ts" />
/// <reference path="Fabrique\Objects\Icon.ts" />
/// <reference path="Fabrique\Objects\LifeBar.ts" />
/// <reference path="Fabrique\Objects\PanelIcons.ts" />
/// <reference path="Fabrique\Objects\Settings.ts" />
/// <reference path="Fabrique\Objects\Help.ts" />
/// <reference path="Fabrique\Objects\Title.ts" />
/// <reference path="Fabrique\Objects\Tower.ts" />
/// <reference path="Fabrique\Objects\Tutorial.ts" />
/// <reference path="Fabrique\Objects\UpgradeCharacteristics.ts" />
/// <reference path="Fabrique\Objects\WindowPersonage.ts" />
/// <reference path="Fabrique\Objects\WindowCharacteristics.ts" />
/// <reference path="States\Boot.ts" />
/// <reference path="States\Preloader.ts" />
/// <reference path="States\Menu.ts" />
/// <reference path="States\Fighters.ts" />
/// <reference path="States\Tournament.ts" />
/// <reference path="States\Level.ts" />
/// <reference path="States\GameOver.ts" />
/// <reference path="app.ts" />
