module Fabrique {

    export class Icon extends Phaser.Sprite {
        private graphics:Phaser.Graphics;

        constructor(game:Phaser.Game, x:number, y:number, image:string){
            super(game, x, y, image);
            this.init();
        }

        private init():void{
            this.graphics = this.game.add.graphics(0, 0);
            this.graphics.beginFill(0x000000, 0);
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0,0,90,120);
            this.graphics.endFill();

            this.addChild(this.graphics);
        }

        public select():void{
            this.graphics.lineStyle(2, 0xFFFFFF, 1);
            this.graphics.drawRect(0,0,90,120);
            this.graphics.lineStyle(1, 0x000000, 1);
            this.graphics.drawRect(0,0,90,120);
        }

        public unselect():void{
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0,0,90,120);
        }
    }
}