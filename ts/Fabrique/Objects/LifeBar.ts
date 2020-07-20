module Fabrique {
    export class LifeBar extends Phaser.Group {

        private lifebarImage:Phaser.Sprite;
        private lifebarText:Phaser.Text
        private lineGraphics:Phaser.Graphics;
        private oneLife:number;

        constructor(game:Phaser.Game, x:number, y:number, name:string, life:number) {
            super(game);
            this.x = x;
            this.y = y;
            this.oneLife = (200 / life);
            this.name = name;
            this.updateTransform();
            this.init();
        }

        private init():void {
            this.lifebarImage = new Phaser.Sprite(this.game, this.x, this.y + 20, Images.Lifebar);
            this.addChild(this.lifebarImage);

            this.lineGraphics = this.game.add.graphics(this.x + 3, this.y + 23); // 200x10
            this.lineGraphics.beginFill(0x0000CD, 1);
            this.lineGraphics.lineStyle(0, 0x0000CD, 0);
            this.lineGraphics.drawRect(0,0,200,10);
            this.lineGraphics.endFill();
            this.addChild(this.lineGraphics);

            let textLength = this.name.length * 8;
            let center = this.x + (this.width / 2);
            let posX = center - (textLength / 2);
            this.lifebarText = new Phaser.Text(this.game, posX, this.y, this.name, { font: "18px Georgia", fill: "#DDDDDD", align: "left" });
            this.addChild(this.lifebarText);
        }

        public lifeUpdate(life:number):void {
            this.lineGraphics.clear();
            this.lineGraphics.beginFill(0x0000CD, 1);
            this.lineGraphics.lineStyle(0, 0x0000CD, 0);
            this.lineGraphics.drawRect(0,0, (life * this.oneLife) ,10);
            this.lineGraphics.endFill();
        }
    }
}