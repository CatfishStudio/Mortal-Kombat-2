module Match3 {
    export class Cell extends Phaser.Graphics {
        public cellType:string;
        private flastSprite:Phaser.Sprite;
        private animation: Phaser.Animation;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y);
            this.init();
        }

        private init(): void {
            this.flastSprite = new Phaser.Sprite(this.game, -45, -25, Atlases.Flash, 0);
            this.addChild(this.flastSprite);
            this.animation = this.flastSprite.animations.add(Atlases.Flash, [0,1,2,3,4,5,6,7,8,9,10]);
            this.animation.onComplete.add(this.onComplete, this);

            this.lineStyle(1, 0x000000, 0.85);
            this.beginFill(0x000000, 0.50);
            this.drawRoundedRect(0, 0, Field.MATCH_CELL_WIDTH, Field.MATCH_CELL_HEIGHT, 15);
            this.endFill();
        }

        private onComplete(sprite, animation): void {
                        
        }

        public flash():void {
            this.animation.play(10, false, false);
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

        public defaultCell():void {
            this.clear();
            this.lineStyle(1, 0x000000, 0.85);
            this.beginFill(0x000000, 0.50);
            this.drawRoundedRect(0, 0, Field.MATCH_CELL_WIDTH, Field.MATCH_CELL_HEIGHT, 15);
            this.endFill();
        }

    }
}