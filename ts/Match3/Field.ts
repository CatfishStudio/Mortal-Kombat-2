/*
 * https://github.com/CatfishStudio/swq/blob/master/html5/public_html/js/game/match3/match.js
 */
module Match3 {
    import Cell = Match3.Cell;
    import Unit = Match3.Unit;
    import Timer = Match3.Timer;

    export interface IPoint {
        x:number;
        y:number;
    }

    export class Field extends Phaser.Group {
        public static MATCH_COLUMNS = 6;
        public static MATCH_ROWS = 6;
        public static MATCH_CELL_WIDTH = 82;
        public static MATCH_CELL_HEIGHT = 82;
        public static MATCH_CELL_TYPE_DROP = "CELL_TYPE_DROP";
		public static MATCH_CELL_TYPE_CLEAR = "CELL_TYPE_CLEAR";
        public static MATCH_CELL_TYPE_EMPTY = "CELL_TYPE_EMPTY";
        public static MATCH_HIT_0 = "HIT_0";
		public static MATCH_HIT_1 = "HIT_1";
		public static MATCH_HIT_2 = "HIT_2";
		public static MATCH_HIT_3 = "HIT_3";
		public static MATCH_HIT_4 = "HIT_4";
        public static MATCH_HIT_5 = "HIT_5";
        
        public static ACTION_PLAYER = "action_player";
        public static ACTION_AI = "action_ai";

        public event: Phaser.Signal;

        private timer: Timer;
        private tween1:Phaser.Tween;
        private tween2:Phaser.Tween;

        private matchMatrixCell:Cell[][];   // Матрица ячеек игрового поля
        private matchMatrixUnit:Unit[][];   // Матрица юнитов на игровом поле
        private matchMatrixFrontPosition:IPoint[];  // Матрица позиций x,y юнитов игрового поля
        private matchMatrixBackPosition:IPoint[];   // Матрица позиций x,y юнитов за пределами игрового поля
        private matchMoveDownProcesses:boolean[];   // запущенные процессы спуска юнитов

        private matchSelectUnit1:Unit;  // выбранный первый юнит
        private matchSelectUnit2:Unit;  // выбран второй юнит

        private matchFieldBlocked:boolean;  // блокирование игрового поля
        private modeAI:boolean;             // режим искуственного интелекта (по умолчанию отключен в начале)
        private matchLevelJSON:any;      // json игрового поля
        private statusAction:String;    // статус активного игрока

        constructor(game:Phaser.Game, parent:any){
            super(game, parent);
            this.updateTransform();
            this.init();
            this.createTimer();
        }

        private init():void{
            this.matchSelectUnit1 = null;
            this.matchSelectUnit2 = null;
            this.matchFieldBlocked = false;
            this.modeAI = false;
            this.statusAction = Field.ACTION_PLAYER;
            this.event = new Phaser.Signal();
        }

        public shutdown(){
            this.timer.shutdown();
            this.tween1.stop();
            this.tween1 = null;
            this.tween2.stop();
            this.tween2 = null;
            this.removeChildren();
            this.removeAll();
        }

        /* Таймер */
        private createTimer(): void {
            this.timer = new Timer(this.game, 340, 12, Images.Tablo);
            this.timer.event.add(this.onTimerEnd, this);
            this.addChild(this.timer);
            this.timer.setMessage("Ваш ход");
            this.timer.runTimer();
        } 

        private onTimerEnd(event): void {
            if (event === Timer.TIMER_END) {
                this.endTurn();
            }
        }

        private endTurn(): void {
            Utilits.Data.debugLog("endTurn", this.statusAction);
            if(this.statusAction === Field.ACTION_PLAYER){
                this.statusAction = Field.ACTION_AI;
                this.matchFieldBlocked = true;
                this.timer.setMessage("Ход противника");
            }else{
                this.statusAction = Field.ACTION_PLAYER;
                this.matchFieldBlocked = false;
                this.timer.setMessage("Ваш ход");
            }
        }

        /* Инициализация матриц позиций ================================================================ */
        private initMatchMatrixPosition():void {
            this.matchMatrixFrontPosition = [];
            this.matchMatrixBackPosition = [];
            for(let i = 0; i < Field.MATCH_COLUMNS; i++){
                for(let j = 0; j < Field.MATCH_ROWS; j++){
                    let point:IPoint = <IPoint>{};
                    point.x = 184 + (Field.MATCH_CELL_WIDTH * i);
                    point.y = 120 + (Field.MATCH_CELL_HEIGHT * j);
                    this.matchMatrixFrontPosition["i"+i+":j"+j] = point;

                    point = <IPoint>{};
                    point.x = 180 + (Field.MATCH_CELL_WIDTH * i);
                    point.y = -372 + (Field.MATCH_CELL_HEIGHT * j);
                    this.matchMatrixBackPosition["i"+i+":j"+j] = point;
                }
            }
            Utilits.Data.debugLog("matchMatrixFrontPosition:", this.matchMatrixFrontPosition);
            Utilits.Data.debugLog("matchMatrixBackPosition:", this.matchMatrixBackPosition);
        }

        /* Создание игрового поля ====================================================================== */
        public createMatchField(valueJSON:any):void
        {
            this.matchLevelJSON = valueJSON;
            Utilits.Data.debugLog('matchLevelJSON:', this.matchLevelJSON);

            this.initMatchMatrixPosition();

            this.matchMatrixCell = [];
            this.matchMatrixUnit = [];

            // CELLS
            let index = 0;
            for(let iCell = 0; iCell < Field.MATCH_COLUMNS; iCell++)
            {
                for(let jCell = 0; jCell < Field.MATCH_ROWS; jCell++)
                {
                    if(valueJSON.Level.cell[index].cellType !== Field.MATCH_CELL_TYPE_DROP){
                        let cell = new Cell(this.game, 
                            this.matchMatrixFrontPosition["i"+iCell+":j"+jCell].x,
                            this.matchMatrixFrontPosition["i"+iCell+":j"+jCell].y);
                        cell.cellType = valueJSON.Level.cell[index].cellType;
                        this.matchMatrixCell["i"+iCell+":j"+jCell] = cell;
                        this.addChild(this.matchMatrixCell["i"+iCell+":j"+jCell]);
                    }else{
                        this.matchMatrixCell["i"+iCell+":j"+jCell] = null;
                    }
                    index++;
                }
            }

            // UNITS
            index = 0;
            for(let iUnit = 0; iUnit < Field.MATCH_COLUMNS; iUnit++)
            {
                for(let jUnit = 0; jUnit < Field.MATCH_ROWS; jUnit++)
                {
                    let unit:Unit;
                    let xUnit:number = this.matchMatrixFrontPosition["i"+iUnit+":j"+jUnit].x;
                    let yUnit:number = this.matchMatrixFrontPosition["i"+iUnit+":j"+jUnit].y;
                    if(valueJSON.Level.cell[index].cellObject !== Field.MATCH_HIT_0){
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_1){
                            unit = new Unit(this.game, xUnit, yUnit, Images.capShangTsung);
                            unit.unitType = Constants.LEG;
                        } 
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_2) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capJax);
                            unit.unitType = Constants.HAND;
                        }
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_3) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capMileena);
                            unit.unitType = Constants.BLOCK;
                        }
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_4) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capRaiden);
                            unit.unitType = Constants.TWIST;
                        }
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_5) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capReptile);
                            unit.unitType = Constants.UPPERCUT;
                        }
                        unit.name = "i"+iUnit+":j"+jUnit;
                        unit.interactive = true;
                        unit.buttonMode = true;
                        unit.flagRemove = false;
                        unit.posColumnI = iUnit;
                        unit.posRowJ = jUnit;
                        unit.event.add(this.onMatchUnitClick, this);
                        this.matchMatrixUnit["i"+iUnit+":j"+jUnit] = unit;
                        this.addChild(this.matchMatrixUnit["i"+iUnit+":j"+jUnit]);
                    }else{
                        unit = new Unit(this.game, xUnit, yUnit, Images.capShangTsung);
                        unit.name = "i"+iUnit+":j"+jUnit;
                        unit.unitType = Field.MATCH_HIT_0;
                        unit.flagRemove = false;
                        unit.posColumnI = iUnit;
                        unit.posRowJ = jUnit;
                        this.matchMatrixUnit["i"+iUnit+":j"+jUnit] = unit;
                    }
                    index++;
                }
            }
        }

        /* Событие: нажатие на юнит */
        public onMatchUnitClick(unit):void
        {
            Utilits.Data.debugLog('onMatchUnitClick:', unit);
            if(this.matchFieldBlocked === false){
                this.matchCellColorSelect(unit.unitType, unit.posColumnI, unit.posRowJ);
                if(this.matchSelectUnit1 === null || this.matchSelectUnit1 === undefined){
                    this.matchSelectUnit1 = unit;
                }else{
                    if(this.matchSelectUnit2 === null || this.matchSelectUnit2 === undefined){
                        this.matchSelectUnit2 = unit;
                        this.matchExchangeUnits(); // меняем юниты местами
                    }
                }
            }
            Utilits.Data.debugLog('onMatchUnitClick:', [this.matchSelectUnit1, this.matchSelectUnit2]);
        }

        /* Событие: свайп кристалов */
        public  onMatchUnitEndClick(unit):void
        {

        }

        /* Определение цвета ячеек Cell игрового поля ================================================= */
        private matchCellColorSelect(unitType, colI, rowJ):void
        {
            this.matchMatrixCell["i"+colI+":j"+rowJ].changeUnit(unitType);
        }

        private matchCellColorBack():void 
        {
            if(this.matchSelectUnit1 !== null){
                this.matchMatrixCell["i"+this.matchSelectUnit1.posColumnI+":j"+this.matchSelectUnit1.posRowJ].defaultCell();
            }
            if(this.matchSelectUnit2 !== null){
                this.matchMatrixCell["i"+this.matchSelectUnit2.posColumnI+":j"+this.matchSelectUnit2.posRowJ].defaultCell();
            }
        }

        /* Обмен местами в массиве выбранных пользователем  объектов =================================== */
        private matchExchangeUnits():void
        {
            this.matchFieldBlocked = true;
            let iUnit1:number = this.matchSelectUnit1.posColumnI;
            let jUnit1:number = this.matchSelectUnit1.posRowJ;
            let iUnit2:number = this.matchSelectUnit2.posColumnI;
            let jUnit2:number = this.matchSelectUnit2.posRowJ;

            Utilits.Data.debugLog("UNITS", [iUnit1, jUnit1, iUnit2, jUnit2]);

            if(iUnit2 > (iUnit1 - 2) && iUnit2 < (iUnit1 + 2) 
            && jUnit2 > (jUnit1 - 2) && jUnit2 < (jUnit1 + 2)
            && ((iUnit2 === iUnit1 && jUnit2 !== jUnit1) || (jUnit2 === jUnit1 && iUnit2 !== iUnit1))){
                this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1] = this.matchSelectUnit2;
                this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1].posColumnI = iUnit1;
                this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1].posRowJ = jUnit1;
                this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1].name = "i"+iUnit1+":j"+jUnit1;

                this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2] = this.matchSelectUnit1;
                this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2].posColumnI = iUnit2;
                this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2].posRowJ = jUnit2;
                this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2].name = "i"+iUnit2+":j"+jUnit2;

                this.tween1 = this.game.add.tween(this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1]);
                this.tween1.to({ x: this.matchMatrixFrontPosition["i"+iUnit1+":j"+jUnit1].x, y: this.matchMatrixFrontPosition["i"+iUnit1+":j"+jUnit1].y }, 250, 'Linear');
                this.tween1.onComplete.add(this.onCompleteMatchExchangeUnits, this);
                this.tween2 = this.game.add.tween(this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2]);
                this.tween2.to({ x: this.matchMatrixFrontPosition["i"+iUnit2+":j"+jUnit2].x, y: this.matchMatrixFrontPosition["i"+iUnit2+":j"+jUnit2].y }, 250, 'Linear');
                this.tween2.onComplete.add(this.onCompleteMatchExchangeUnits, this);

                this.tween1.start();
                this.tween2.start();

                Utilits.Data.debugLog("matchExchangeUnits", "Tween: START");
            }else{
                this.matchCellColorBack();
                this.matchSelectUnitsClear();
            }
        }

        private onCompleteMatchExchangeUnits(event:any)
        {
            if(this.tween1.isRunning === false && this.tween2.isRunning === false){
                this.matchCellColorBack();
                this.matchCheckField(false);
                Utilits.Data.debugLog("onCompleteMatchExchangeUnits", "Tween: STOP");
            }
        }

        private matchBackExchangeUnits():void
        {
            let iUnit1:number = this.matchSelectUnit1.posColumnI;
            let jUnit1:number = this.matchSelectUnit1.posRowJ;
            let iUnit2:number = this.matchSelectUnit2.posColumnI;
            let jUnit2:number = this.matchSelectUnit2.posRowJ;

            this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1] = this.matchSelectUnit2;
			this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1].posColumnI = iUnit1;
			this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1].posRowJ = jUnit1;
			this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1].name = "i"+iUnit1+":j"+jUnit1;

			this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2] = this.matchSelectUnit1;
			this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2].posColumnI = iUnit2;
			this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2].posRowJ = jUnit2;
            this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2].name = "i"+iUnit2+":j"+jUnit2;
            
            this.tween1 = this.game.add.tween(this.matchMatrixUnit["i"+iUnit1+":j"+jUnit1]);
            this.tween1.to({ x: this.matchMatrixFrontPosition["i"+iUnit1+":j"+jUnit1].x, y: this.matchMatrixFrontPosition["i"+iUnit1+":j"+jUnit1].y }, 250, 'Linear');
            this.tween1.onComplete.add(this.matchSelectUnitsClear, this);
            this.tween2 = this.game.add.tween(this.matchMatrixUnit["i"+iUnit2+":j"+jUnit2]);
            this.tween2.to({ x: this.matchMatrixFrontPosition["i"+iUnit2+":j"+jUnit2].x, y: this.matchMatrixFrontPosition["i"+iUnit2+":j"+jUnit2].y }, 250, 'Linear');
            this.tween2.onComplete.add(this.matchSelectUnitsClear, this);

            this.tween1.start();
            this.tween2.start();

            Utilits.Data.debugLog("matchBackExchangeUnits", "Tween: START");
        }

        private matchSelectUnitsClear():void
        {
            if(this.tween1.isRunning === false && this.tween2.isRunning === false){
                this.matchSelectUnit1 = null;
                this.matchSelectUnit2 = null;
                if(this.statusAction === Field.ACTION_PLAYER) this.matchFieldBlocked = false;
                Utilits.Data.debugLog("matchSelectUnitsClear", "Tween: STOP");
            }
        }

        /* Поиск групп ============================================================================== */
        private matchCheckField(afterDown:boolean):void
        {
            if(this.parent !== null){
                this.matchMoveDownProcesses = [];
                if(this.matchCheckFieldFull())  // группы были найдены
                {
                    this.timer.stopTimer();   // останавливаем таймер
                    //////////////////////this.matchMoveDownUnits();  // спускаем юниты
                }else{ // группы не найдены
                    if(afterDown === false) // первый спуск юнитов
                    {
                        this.matchBackExchangeUnits();  // возвращаем выбранные юниты на места
                    }else{ 
                        this.matchSelectUnitsClear();   // очистка и разблокировка поля
                        // (!) ///////////////////if(parent.level.levelStatus === parent.level.LEVEL_STATUS_BATTLE) parent.timer.timerStart();				// запускаем таймер
                        this.timer.runTimer();				// запускаем таймер
                    }
                }
            }else{
                // УДАЛЯЕТСЯ ТРИ В РЯД ЕСЛИ НЕТ УРОВНЯ
                this.shutdown();
            }
        }

        /* Общая проверка колонок и строк (3-и и более в ряд) */
        private matchCheckFieldFull():boolean
        {
            let resultCheck:boolean = false;
            /* i - столбец; j - строка */
			for(let i:number = 0; i < Field.MATCH_COLUMNS; i++)
			{
                if(this.matchCheckColumn(i) === true) resultCheck = true;
			}
			for(let j:number = 0; j < Field.MATCH_ROWS; j++)
			{
                if(this.matchCheckRow(j) === true) resultCheck = true;	
			}
			return resultCheck;
        }

        /* Проверка колонки (3-и и более в ряд) */
        private matchCheckColumn(column:number):boolean
        {
            let resultCheckColumn:boolean = false;
            /* просматриваем  в столбце (по строкам) */
            for(let j:number = 0; j < Field.MATCH_ROWS; j++)
			{
				if(j < Field.MATCH_ROWS - 2)
				{
					if(this.matchMatrixUnit["i"+column+":j"+j].unitType !== Field.MATCH_HIT_0)
					{
						/* Группа из 3-х объектов */
						if(this.matchMatrixUnit["i"+column+":j"+j].unitType === this.matchMatrixUnit["i"+column+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+column+":j"+j].unitType === this.matchMatrixUnit["i"+column+":j"+(j+2)].unitType)
						{
							resultCheckColumn = true;

							/* Группа из 4-х кристалов */
							if(j < Field.MATCH_ROWS - 3)
							{
								if(this.matchMatrixUnit["i"+column+":j"+j].unitType === this.matchMatrixUnit["i"+column+":j"+(j+3)].unitType)
								{
									/* Группа из 5-ти кристалов */
									if(j < Field.MATCH_ROWS - 4)
									{
										if(this.matchMatrixUnit["i"+column+":j"+j].unitType === this.matchMatrixUnit["i"+column+":j"+(j+4)].unitType)
										{
											/* Удаляем группу из 5 юнитов */
											this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i"+column+":j"+j].unitType, 5);
                                            j += 2;
										}else{
											/* Удаляем группу из 4 юнитов */
											this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i"+column+":j"+j].unitType, 4);
                                            j += 1;
										}
									}else{
										/* Удаляем группу из 4 юнитов */
										this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i"+column+":j"+j].unitType, 4);
                                        j += 1;
									}
								}else{
									/* Удаляем группу из 3 юнитов */
									this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i"+column+":j"+j].unitType, 3);
								}
							}else{
								/* Удаляем группу из 3 юнитов */
								this.matchRemoveUnit(column, j, "col", this.matchMatrixUnit["i"+column+":j"+j].unitType, 3);
							}
						}
					}
				}else{
					break;
				}
			}
            return resultCheckColumn;
        }

        /* Проверка строки (3-и и более в ряд) */
        private matchCheckRow(row:number):boolean
        {
            let resultCheckRow:boolean = false;
            /* просматриваем в строке (по столбцам) */
            for(let i:number = 0; i < Field.MATCH_COLUMNS; i++)
			{
				if(i < Field.MATCH_COLUMNS - 2)
				{
					if(this.matchMatrixUnit["i"+i+":j"+row].unitType !== Field.MATCH_HIT_0)
					{
						/* Группа из 3-х объектов */
						if(this.matchMatrixUnit["i"+i+":j"+row].unitType === this.matchMatrixUnit["i"+(i+1)+":j"+row].unitType && this.matchMatrixUnit["i"+i+":j"+row].unitType === this.matchMatrixUnit["i"+(i+2)+":j"+row].unitType)
						{
							resultCheckRow = true;

							/* Группа из 4-х кристалов */
							if(i < Field.MATCH_COLUMNS - 3)
							{
								if(this.matchMatrixUnit["i"+i+":j"+row].unitType === this.matchMatrixUnit["i"+(i+3)+":j"+row].unitType)
								{
									/* Группа из 5-ти кристалов */
									if(i < Field.MATCH_COLUMNS - 4)
									{
										if(this.matchMatrixUnit["i"+i+":j"+row].unitType === this.matchMatrixUnit["i"+(i+4)+":j"+row].unitType)
										{
											/* Удаляем группу из 5 юнитов */
											this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i"+i+":j"+row].unitType, 5);
                                            i += 2;
										}else{
											/* Удаляем группу из 4 юнитов */
											this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i"+i+":j"+row].unitType, 4);
                                            i += 1;
										}
									}else{
										/* Удаляем группу из 4 юнитов */
										this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i"+i+":j"+row].unitType, 4);
                                        i += 1;
									}
								}else{
									/* Удаляем группу из 3 юнитов */
									this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i"+i+":j"+row].unitType, 3);
								}
							}else{
								/* Удаляем группу из 3 юнитов */
								this.matchRemoveUnit(i, row, "row", this.matchMatrixUnit["i"+i+":j"+row].unitType, 3);
							}
						}
					}
				}else{
					break;
				}
			}
			return resultCheckRow;
        }

        /* Удаление юнитов */
        private matchRemoveUnit(col:number, row:number, check:String, hitType:any, hitCount:number):void
        {
            this.event.dispatch(hitType, hitCount); // возвращаем событие в Level


        }











    }
}