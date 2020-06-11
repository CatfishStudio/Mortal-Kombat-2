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
		private timerAI: Phaser.Timer;
        private tween1:Phaser.Tween;
        private tween2:Phaser.Tween;
        private tweenDown:Phaser.Tween;

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
            this.createTimers();
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
        private createTimers(): void {
			this.timerAI = this.game.time.create(false);
			this.timerAI.loop(1000, this.onTimerComplete, this);

            this.timer = new Timer(this.game, 340, 12, Images.Tablo);
            this.timer.event.add(this.onTimerEnd, this);
            this.addChild(this.timer);
            this.timer.setMessage("Ваш ход");
            this.timer.runTimer();
		} 
		
		private onTimerComplete(event):void {
			Utilits.Data.debugLog("timerAI", this.statusAction + " | " + this.matchFieldBlocked);
			if(this.tween1 !== undefined && this.tween2 !== undefined){
				if(this.tween1.isRunning === false && this.tween2.isRunning === false){
					this.timerAI.stop();
					this.matchActionAI();
				}
			}else{
				this.timerAI.stop();
				this.matchActionAI();
			}
		}

        private onTimerEnd(event): void {
            if (event === Timer.TIMER_END) {
                this.endTurn();
            }
        }

        private endTurn(): void {
            Utilits.Data.debugLog("endTurn", this.statusAction);
            if(this.statusAction === Field.ACTION_PLAYER){
                this.timer.setMessage("Ход противника");
                this.statusAction = Field.ACTION_AI;
                this.matchCellColorBack();
                this.matchFieldBlocked = true;
                this.matchSelectUnit1 = null;
				this.matchSelectUnit2 = null;
				this.timerAI.loop(1000, this.onTimerComplete, this);
				this.timerAI.start(1000);
            }else{
                this.statusAction = Field.ACTION_PLAYER;
                this.timer.setMessage("Ваш ход");
                this.matchCellColorBack();
                this.matchFieldBlocked = false;
                this.matchSelectUnit1 = null;
                this.matchSelectUnit2 = null;
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
                            unit.unitType = Constants.UPPERCUT;
                        }
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_5) {
                            unit = new Unit(this.game, xUnit, yUnit, Images.capReptile);
                            unit.unitType = Constants.TWIST;
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
            Utilits.Data.debugLog('onMatchUnitClick: CLICK', unit);
            if(this.matchFieldBlocked === false){
                
                this.matchCellColorSelect(unit.unitType, unit.posColumnI, unit.posRowJ);
                if(this.matchSelectUnit1 === null || this.matchSelectUnit1 === undefined){
                    this.matchSelectUnit1 = unit;
                }else{
                    if(this.matchSelectUnit1.name === unit.name){
                        this.matchCellColorBack();
                        this.matchSelectUnit1 = null;
                        this.matchSelectUnit2 = null;
                        if(this.statusAction === Field.ACTION_PLAYER) this.matchFieldBlocked = false;
                        Utilits.Data.debugLog('onMatchUnitClick: RESET', [this.matchSelectUnit1, this.matchSelectUnit2]);
                    }else{
                        if(this.matchSelectUnit2 === null || this.matchSelectUnit2 === undefined){
                            this.matchSelectUnit2 = unit;
                            this.matchExchangeUnits(); // меняем юниты местами
                        }
                    }
                }
            }
            Utilits.Data.debugLog('onMatchUnitClick: TOTAL', [this.matchSelectUnit1, this.matchSelectUnit2]);
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
                    this.matchMoveDownUnits();  // спускаем юниты
                }else{ // группы не найдены
                    if(afterDown === false) // первый спуск юнитов
                    {
                        this.matchBackExchangeUnits();  // возвращаем выбранные юниты на места
                    }else{ 
						//this.matchSelectUnitsClear();   // очистка и разблокировка поля
						this.timerAI.stop();
						this.endTurn();
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

            if(check === "row")
            {
                if(hitCount === 3)
                {
                    this.matchMatrixUnit["i"+col+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+row] as Cell).flash();
                    this.matchMatrixUnit["i"+col+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+row].position.x = this.matchMatrixBackPosition["i"+col+":j"+row].x;
                    this.matchMatrixUnit["i"+col+":j"+row].position.y = this.matchMatrixBackPosition["i"+col+":j"+row].y;
                    this.matchMoveDownProcesses["i"+col+":j"+row] = true;
                    this.matchMatrixUnit["i"+(col+1)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+1)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+1)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+1)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+1)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+1)+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+2)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+2)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+2)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+2)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+2)+":j"+row] = true;
                }
                if(hitCount === 4)
				{
					this.matchMatrixUnit["i"+col+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+row].position.x = this.matchMatrixBackPosition["i"+col+":j"+row].x;
					this.matchMatrixUnit["i"+col+":j"+row].position.y = this.matchMatrixBackPosition["i"+col+":j"+row].y;
					this.matchMoveDownProcesses["i"+col+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+1)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+1)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+1)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+1)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+1)+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+2)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+2)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+2)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+2)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+2)+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+3)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+3)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+3)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+3)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+3)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+3)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+3)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+3)+":j"+row] = true;
                }
                if(hitCount === 5)
				{
					this.matchMatrixUnit["i"+col+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+row].position.x = this.matchMatrixBackPosition["i"+col+":j"+row].x;
					this.matchMatrixUnit["i"+col+":j"+row].position.y = this.matchMatrixBackPosition["i"+col+":j"+row].y;
					this.matchMoveDownProcesses["i"+col+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+1)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+1)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+1)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+1)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+1)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+1)+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+2)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+2)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+2)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+2)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+2)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+2)+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+3)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+3)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+3)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+3)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+3)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+3)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+3)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+3)+":j"+row] = true;
					this.matchMatrixUnit["i"+(col+4)+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+(col+4)+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+(col+4)+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+(col+4)+":j"+row].position.x = this.matchMatrixBackPosition["i"+(col+4)+":j"+row].x;
					this.matchMatrixUnit["i"+(col+4)+":j"+row].position.y = this.matchMatrixBackPosition["i"+(col+4)+":j"+row].y;
					this.matchMoveDownProcesses["i"+(col+4)+":j"+row] = true;
				}
            }
            if(check === "col")
            {
                if(hitCount === 3)
				{
					
					this.matchMatrixUnit["i"+col+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+row].position.x = this.matchMatrixBackPosition["i"+col+":j"+row].x;
					this.matchMatrixUnit["i"+col+":j"+row].position.y = this.matchMatrixBackPosition["i"+col+":j"+row].y;
					this.matchMoveDownProcesses["i"+col+":j"+row] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+(row+1)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+1)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+1)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+1)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+1)] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].alpha = 0.0;	
                    (this.matchMatrixCell["i"+col+":j"+(row+2)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+2)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+2)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+2)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+2)] = true;
                }
                if(hitCount === 4)
				{
					this.matchMatrixUnit["i"+col+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+row].position.x = this.matchMatrixBackPosition["i"+col+":j"+row].x;
					this.matchMatrixUnit["i"+col+":j"+row].position.y = this.matchMatrixBackPosition["i"+col+":j"+row].y;
					this.matchMoveDownProcesses["i"+col+":j"+row] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+(row+1)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+1)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+1)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+1)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+1)] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].alpha = 0.0;	
                    (this.matchMatrixCell["i"+col+":j"+(row+2)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+2)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+2)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+2)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+2)] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+3)].alpha = 0.0;	
                    (this.matchMatrixCell["i"+col+":j"+(row+3)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+3)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+3)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+3)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+3)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+3)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+3)] = true;
                }
                if(hitCount === 5)
				{
					this.matchMatrixUnit["i"+col+":j"+row].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+row] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+row].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+row].position.x = this.matchMatrixBackPosition["i"+col+":j"+row].x;
					this.matchMatrixUnit["i"+col+":j"+row].position.y = this.matchMatrixBackPosition["i"+col+":j"+row].y;
					this.matchMoveDownProcesses["i"+col+":j"+row] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+(row+1)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+1)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+1)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+1)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+1)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+1)] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].alpha = 0.0;	
                    (this.matchMatrixCell["i"+col+":j"+(row+2)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+2)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+2)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+2)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+2)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+2)] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+3)].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+(row+3)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+3)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+3)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+3)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+3)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+3)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+3)] = true;
					this.matchMatrixUnit["i"+col+":j"+(row+4)].alpha = 0.0;
                    (this.matchMatrixCell["i"+col+":j"+(row+4)] as Cell).flash();
					this.matchMatrixUnit["i"+col+":j"+(row+4)].flagRemove = true;
					this.matchMatrixUnit["i"+col+":j"+(row+4)].position.x = this.matchMatrixBackPosition["i"+col+":j"+(row+4)].x;
					this.matchMatrixUnit["i"+col+":j"+(row+4)].position.y = this.matchMatrixBackPosition["i"+col+":j"+(row+4)].y;
					this.matchMoveDownProcesses["i"+col+":j"+(row+4)] = true;
				}
            }
        }

        /* Спуск юнитов вниз на свободные позиции */
        private matchMoveDownUnits():void
        {
            for(let i = 0; i < Field.MATCH_COLUMNS; i++)
            {
                for(let j = Field.MATCH_ROWS-1; j >= 0; j--)
                {
                    if(this.matchMatrixUnit["i"+i+":j"+j].flagRemove === true && this.matchMatrixUnit["i"+i+":j"+j].unitType !== Field.MATCH_HIT_0)
                    {
                        for(let k = j; k >= 0; k--)
                        {
                            if(this.matchMatrixUnit["i"+i+":j"+k].flagRemove === false && this.matchMatrixUnit["i"+i+":j"+k].unitType !== Field.MATCH_HIT_0)
							{
								let removeUnit:Unit = this.matchMatrixUnit["i"+i+":j"+j]; // удалённый юнит

								this.matchMatrixUnit["i"+i+":j"+j] = this.matchMatrixUnit["i"+i+":j"+k]; // перемещаем не удалённый юнит
								this.matchMatrixUnit["i"+i+":j"+j].name = "i"+i+":j"+j;
								this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false;
								this.matchMatrixUnit["i"+i+":j"+j].posColumnI = i;
								this.matchMatrixUnit["i"+i+":j"+j].posRowJ = j;
								this.matchMoveDownProcesses["i"+i+":j"+j] = true;

								this.matchMatrixUnit["i"+i+":j"+k] = removeUnit;	// удалённый юнит ставим на место перемещённой
								this.matchMatrixUnit["i"+i+":j"+k].name = "i"+i+":j"+k;
								this.matchMatrixUnit["i"+i+":j"+k].flagRemove = true;
								this.matchMatrixUnit["i"+i+":j"+k].posColumnI = i;
								this.matchMatrixUnit["i"+i+":j"+k].posRowJ = k;
								this.matchMoveDownProcesses["i"+i+":j"+k] = true;
								
								break;
							}
                        }
                    }
                }
            }
            this.matchMoveDownNewUnits();
        }

        private onCompleteMatchMoveDownUnits():void
        {
            this.matchMoveDownNewUnits();
        }

        private matchMoveDownNewUnits():void
        {
            for(let i = 0; i < Field.MATCH_COLUMNS; i++)
            {
                for(let j = Field.MATCH_ROWS-1; j >= 0; j--)
                {
                    if(this.matchMoveDownProcesses["i"+i+":j"+j] === true && this.matchMatrixUnit["i"+i+":j"+j].flagRemove === false && this.matchMatrixUnit["i"+i+":j"+j].unitType !== Field.MATCH_HIT_0)
                    {
                        this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false; 
                        this.tweenDown = this.game.add.tween(this.matchMatrixUnit["i"+i+":j"+j]);
                        this.tweenDown.to({alpha: 1.0}, 500);
                        this.tweenDown.to({x: this.matchMatrixFrontPosition["i"+i+":j"+j].x, y: this.matchMatrixFrontPosition["i"+i+":j"+j].y}, 500);
                        this.tweenDown.to({x: this.matchMatrixFrontPosition["i"+i+":j"+j].x, y: this.matchMatrixFrontPosition["i"+i+":j"+j].y - 5}, 100);
                        this.tweenDown.to({x: this.matchMatrixFrontPosition["i"+i+":j"+j].x, y: this.matchMatrixFrontPosition["i"+i+":j"+j].y}, 50);
                        this.tweenDown.onComplete.add(this.onCompleteMatchMoveDownNewUnits, this);
                        this.tweenDown.start();
                    }else{
                        if(this.matchMoveDownProcesses["i"+i+":j"+j] === true && this.matchMatrixUnit["i"+i+":j"+j].flagRemove === true && this.matchMatrixUnit["i"+i+":j"+j].unitType !== Field.MATCH_HIT_0)
                        {
                            let indexRandom = Math.random() / 0.1;
                            let index = Math.round(indexRandom);
                            if (index >= 0 && index <= 2) 
                            {
                                (this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capShangTsung);
                                this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.LEG;
                                this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false;
                            }
                            if (index > 2 && index <= 4)
                            {
                                (this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capJax);
                                this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.HAND;
                                this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false;
                            }
                            if (index > 4 && index <= 6)
                            {
                                (this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capMileena);
                                this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.BLOCK;
                                this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false;
                            }
                            if (index > 6 && index <= 8)
                            {
                                (this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capRaiden);
                                this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.UPPERCUT;
                                this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false;
                            }
                            if (index > 8 && index <= 10)
                            {
                                (this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capReptile);
                                this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.TWIST;
                                this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false;
                            }

                            this.tweenDown = this.game.add.tween(this.matchMatrixUnit["i"+i+":j"+j]);
                            this.tweenDown.to({alpha: 1.0}, 500);
                            this.tweenDown.to({x: this.matchMatrixFrontPosition["i"+i+":j"+j].x, y: this.matchMatrixFrontPosition["i"+i+":j"+j].y}, 500);
                            this.tweenDown.to({x: this.matchMatrixFrontPosition["i"+i+":j"+j].x, y: this.matchMatrixFrontPosition["i"+i+":j"+j].y - 5}, 100);
                            this.tweenDown.to({x: this.matchMatrixFrontPosition["i"+i+":j"+j].x, y: this.matchMatrixFrontPosition["i"+i+":j"+j].y}, 50);
                            this.tweenDown.onComplete.add(this.onCompleteMatchMoveDownNewUnits, this);
                            this.tweenDown.start();
                        }
                    }
                }
            }
        }

        private onCompleteMatchMoveDownNewUnits(unit:Unit):void
        {
            Utilits.Data.debugLog("onCompleteMatchMoveDownNewUnits", unit.name);
            let result = false;
            this.matchMoveDownProcesses[unit.name] = false;
            this.matchMoveDownProcesses.forEach(process => {
                if(process === true){
                    result = true;
                    return;
                } 
            });
            if(result === false) // анимация завершена
			{
					if(this.matchCheckCombinations() === true) // Возможные ходы определены
					{
							this.matchCheckField(true);	// проверка групп 3-и в ряд
					}else{	// нет возможности ходов
							this.matchUpdateField(); // обновление игрового поля
					}
			}
        }

        private matchCheckCombinations():boolean
        {
            /*	   0  1  2  3  4  5
			* 	0:[0][0][0][0][1][0]
				1:[0][0][1][1][0][1]
				2:[0][0][0][0][1][0]
				3:[0][0][0][0][0][0]
				4:[0][0][0][0][0][0]
				5:[0][0][0][0][0][0]
			 * */
            for(let i:number = 0; i < Field.MATCH_COLUMNS; i++)
			{
				for(let j:number = 0; j < Field.MATCH_ROWS; j++)
				{
					if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0)
					{
						// ПРОВЕРКА СТРОКИ
						if(j == 0)
						{
							//[1][1][X][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) { return true; }
								}
							}
							//[1][X][1][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) { return true; }
								}
							}
							//[0][1][X][1]
							//[0][0][1][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) { return true; }
								}
							}
							//[0][1][1][X]
							//[0][0][0][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType) { return true; }
								}
							}
							//[0][X][1][1]
							//[0][1][0][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) { return true; }
								}
							}
						}else{
							//[1][1][X][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) { return true; }
								}
							}
							//[1][X][1][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) { return true; }
								}
							}
							//[0][1][1][X]
							//[0][0][0][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType) { return true; }
								}
							}
							//[0][0][0][1]
							//[0][1][1][X]
							if((i + 2) < Field.MATCH_COLUMNS && (j - 1) >=0){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+(j-1)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j-1)].unitType) { return true; }
								}
							}
							//[0][X][1][1]
							//[0][1][0][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) { return true; }
								}
							}
							//[0][1][0][0]
							//[0][X][1][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType) { return true; }
								}
							}
							//[0][0][1][0]
							//[0][1][X][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j - 1) >= 0){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j-1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j-1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) { return true; }
								}
							}
							//[0][1][X][1]
							//[0][0][1][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) { return true; }
								}
							}
						}

						// ПРОВЕРКА КОЛОНКИ
						if(i == 0)
						{
							//[1]
							//[1]
							//[X]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) { return true; }
								}
							}
							//[1]
							//[X]
							//[1]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) { return true; }
								}
							}
							//[1][0]
							//[X][1]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) { return true; }
								}
							}
							//[1][0]
							//[1][0]
							//[X][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType) { return true; }
								}
							}
							//[X][1]
							//[1][0]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) { return true; }
								}
							}
						}else{
							//[1]
							//[1]
							//[X]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) { return true; }
								}
							}
							//[1]
							//[X]
							//[1]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) { return true; }
								}
							}
							//[1][0]
							//[X][1]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) { return true; }
								}
							}
							//[0][1]
							//[1][X]
							//[0][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i-1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i-1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) { return true; }
								}
							}
							//[1][0]
							//[1][0]
							//[X][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType) { return true; }
								}
							}
							//[X][1]
							//[1][0]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) { return true; }
								}
							}
							//[0][1]
							//[0][1]
							//[1][X]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i-1)+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i-1)+":j"+(j+2)].unitType) { return true; }
								}
							}
							//[1][X]
							//[0][1]
							//[0][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i-1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+(i-1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+(i-1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) { return true; }
								}
							}
						}
					}
				}
			}
			return false;
        }

        private matchUpdateField():void
        {
            this.matchMoveDownProcesses = [];
            let indexRandom = Math.random() / 0.1;
            let indexLevel = Math.round(indexRandom);
            let valueJSON = this.game.cache.getJSON(GameData.Data.levels[indexLevel][1]);
            
            let index = 0;
            for(let i:number = 0; i < Field.MATCH_COLUMNS; i++)
            {
                for(let j:number = 0; j < Field.MATCH_ROWS; j++)
                {
                    if(this.matchLevelJSON.Level.cell[index].cellObject !== Field.MATCH_HIT_0)
                    {
                        this.matchMatrixUnit["i"+i+":j"+j].flagRemove = false;
						this.matchMatrixUnit["i"+i+":j"+j].position.x = this.matchMatrixBackPosition["i"+i+":j"+j].x;
						this.matchMatrixUnit["i"+i+":j"+j].position.y = this.matchMatrixBackPosition["i"+i+":j"+j].y;
                        this.matchMoveDownProcesses["i"+i+":j"+j] = true;
                        
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_1)
						{
                            (this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capShangTsung);
                            this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.LEG;
                        }
                        if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_2)
						{
							(this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capJax);
	                        this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.HAND;
						}
						if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_3)
						{
							(this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capMileena);
	                        this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.BLOCK;
						}
						if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_4)
						{
							(this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capRaiden);
	                        this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.UPPERCUT;
						}
						if(valueJSON.Level.cell[index].cellObject === Field.MATCH_HIT_5)
						{
							(this.matchMatrixUnit["i"+i+":j"+j] as Unit).loadTexture(Images.capReptile);
	                        this.matchMatrixUnit["i"+i+":j"+j].unitType = Constants.TWIST;
                        }
                        
                        /* Спускаем удалённые юниты */

                        this.tweenDown = this.game.add.tween(this.matchMatrixUnit["i"+i+":j"+j]);
                        this.tweenDown.to({alpha: 1.0}, 500);
                        this.tweenDown.to({x: this.matchMatrixFrontPosition["i"+i+":j"+j].x, y: this.matchMatrixFrontPosition["i"+i+":j"+j].y}, 500);
                        this.tweenDown.onComplete.add(this.onCompleteMatchMoveDownNewUnits, this.matchMatrixUnit["i"+i+":j"+j]);
                        this.tweenDown.start();

                        /* Возвращаем цвет ячейки по умолчанию */
                        this.matchMatrixCell["i"+i+":j"+j].defaultCell();
                    }
                    index++;
                }
            }
        }

        /* Ход искусственного интеллекта ============================================================== */
        private matchGetPriorityUnit(unitType:string):number
        {
            if(unitType === Constants.LEG) {return 1;}
			if(unitType === Constants.HAND) {return 2;}
			if(unitType === Constants.BLOCK)
			{
				var typeRandom = Math.random() / 0.1;
				var uType = Math.round(typeRandom);
				return uType;
			}
			if(unitType === Constants.UPPERCUT) {return 4;}
			if(unitType === Constants.TWIST) {return 5;}
			return 0;
        }

        private matchActionAI():void
        {
            /*	   0  1  2  3  4  5
			* 	0:[0][0][0][0][1][0]
				1:[0][0][1][1][0][1]
				2:[0][0][0][0][1][0]
				3:[0][0][0][0][0][0]
				4:[0][0][0][0][0][0]
				5:[0][0][0][0][0][0]
			 * */
            let priorityUnit = 0;
            let lastpriorityUnit = 0;
            for(let i:number = 0; i < Field.MATCH_COLUMNS; i++)
			{
				for(let j:number = 0; j < Field.MATCH_ROWS; j++)
				{
					if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0)
					{
                        // ПРОВЕРКА СТРОКИ
						if(j == 0)
						{
							//[1][1][X][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+2)+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+3)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1][X][1][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) 
									{ 
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][1][X][1]
							//[0][0][1][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+1)+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][1][1][X]
							//[0][0][0][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+2)+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][X][1][1]
							//[0][1][0][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
						}else{
							//[1][1][X][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+2)+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+3)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1][X][1][1]
							if((i + 3) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+3)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][1][1][X]
							//[0][0][0][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+2)+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][0][0][1]
							//[0][1][1][X]
							if((i + 2) < Field.MATCH_COLUMNS && (j - 1) >=0){
								if(this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+(j-1)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j-1)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+2)+":j"+(j-1)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+2)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][X][1][1]
							//[0][1][0][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][1][0][0]
							//[0][X][1][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+(j+1)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][0][1][0]
							//[0][1][X][1]
							if((i + 2) < Field.MATCH_COLUMNS && (j - 1) >= 0){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j-1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j-1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+1)+":j"+(j-1)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][1][X][1]
							//[0][0][1][0]
							if((i + 2) < Field.MATCH_COLUMNS && (j + 1) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+2)+":j"+j].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i+1)+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
						}

						// ПРОВЕРКА КОЛОНКИ
						if(i == 0)
						{
							//[1]
							//[1]
							//[X]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+(j+2)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+3)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1]
							//[X]
							//[1]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1][0]
							//[X][1]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1][0]
							//[1][0]
							//[X][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+(j+2)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[X][1]
							//[1][0]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
						}else{
							//[1]
							//[1]
							//[X]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+(j+2)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+3)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1]
							//[X]
							//[1]
							//[1]
							if((j + 3) < Field.MATCH_ROWS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+3)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1][0]
							//[X][1]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][1]
							//[1][X]
							//[0][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0){
								if(this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i-1)+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i-1)+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i-1)+":j"+(j+1)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+1)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1][0]
							//[1][0]
							//[X][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+(j+2)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+(j+2)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[X][1]
							//[1][0]
							//[1][0]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i + 1) < Field.MATCH_COLUMNS){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+(i+1)+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+i+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+(i+1)+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[0][1]
							//[0][1]
							//[1][X]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0){
								if(this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i-1)+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+i+":j"+j].unitType == this.matchMatrixUnit["i"+(i-1)+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+i+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i-1)+":j"+(j+2)];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+(j+2)];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
							//[1][X]
							//[0][1]
							//[0][1]
							//[0][0]
							if((j + 2) < Field.MATCH_ROWS && (i - 1) >= 0){
								if(this.matchMatrixUnit["i"+i+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+(i-1)+":j"+j].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType != Field.MATCH_HIT_0 && this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType != Field.MATCH_HIT_0){
									if(this.matchMatrixUnit["i"+(i-1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+1)].unitType && this.matchMatrixUnit["i"+(i-1)+":j"+j].unitType == this.matchMatrixUnit["i"+i+":j"+(j+2)].unitType) 
									{
										priorityUnit = this.matchGetPriorityUnit(this.matchMatrixUnit["i"+(i-1)+":j"+j].unitType);
										if(priorityUnit > lastpriorityUnit)	
										{
											this.matchSelectUnit1 = this.matchMatrixUnit["i"+(i-1)+":j"+j];
											this.matchSelectUnit2 = this.matchMatrixUnit["i"+i+":j"+j];
											lastpriorityUnit = priorityUnit;
										}
									}
								}
							}
						}
                    }
                }
            }

            if(this.matchSelectUnit1 !== null && this.matchSelectUnit2 !== null)
			{
				this.matchExchangeUnits(); // меняем юниты местами
			}else{
				this.matchActionAI();
			}
        }

        

    }
}