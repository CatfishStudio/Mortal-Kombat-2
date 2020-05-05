module Match3 {
    import Cell = Match3.Cell;
    import Unit = Match3.Unit;

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
        
        private matchMatrixCell:Cell[][];   // Матрица ячеек игрового поля
        private matchMatrixUnit:Unit[][];   // Матрица юнитов на игровом поле
        private matchMatrixFrontPosition:IPoint[];  // Матрица позиций x,y юнитов игрового поля
        private matchMatrixBackPosition:IPoint[];   // Матрица позиций x,y юнитов за пределами игрового поля
        private matchMoveDownProcesses:Unit[];      // запущенные процессы спуска юнитов

        private matchSelectUnit1:Unit;  // выбранный первый юнит
        private matchSelectUnit2:Unit;  // выбран второй юнит

        private matchFieldBlocked:boolean;  // блокирование игрового поля
        private modeAI:boolean;             // режим искуственного интелекта (по умолчанию отключен в начале)
        private matchLevelJSON:string;      // json игрового поля

        constructor(game:Phaser.Game, parent:any){
            super(game, parent);
            this.updateTransform();
            this.init();
        }

        private init():void{
            this.matchFieldBlocked = false;
            this.modeAI = false;
            this.initMatchMatrixPosition();
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
            Utilits.Data.debugLog("matchMatrixFrontPosition", this.matchMatrixFrontPosition);
            Utilits.Data.debugLog("matchMatrixBackPosition", this.matchMatrixBackPosition);
        }
    }
}