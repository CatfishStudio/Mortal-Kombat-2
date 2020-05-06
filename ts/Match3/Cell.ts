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
    }
}