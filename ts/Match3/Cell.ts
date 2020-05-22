module Match3 {
    export class Cell extends Phaser.Graphics {
        public cellType:string;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y);
            this.init();
        }

        private init(): void {
            this.lineStyle(1, 0x000000, 0.85);
            this.beginFill(0x000000, 0.50);
            this.drawRoundedRect(0, 0, Field.MATCH_CELL_WIDTH, Field.MATCH_CELL_HEIGHT, 15);
            this.endFill();
        }

        public changeUnit(unitType):void {
            this.clear();
            this.lineStyle(1, 0x000000, 0.85);
            if(unitType === Constants.LEG) this.beginFill(0xFFFF80, 0.50);
            if(unitType === Constants.HAND) this.beginFill(0xFF0000, 0.50);
            if(unitType === Constants.BLOCK) this.beginFill(0xFF00FF, 0.50);
            if(unitType === Constants.TWIST) this.beginFill(0x0080FF, 0.50);
            if(unitType === Constants.UPPERCUT) this.beginFill(0x00FF80, 0.50);
            this.drawRoundedRect(0, 0, Field.MATCH_CELL_WIDTH, Field.MATCH_CELL_HEIGHT, 15);
            this.endFill();
        }
    }
}