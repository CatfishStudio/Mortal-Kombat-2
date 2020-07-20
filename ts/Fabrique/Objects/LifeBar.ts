module Fabrique {
    export class LifeBar extends Phaser.Group {

        private lifebarImage:Phaser.Sprite;
        private lifebarText:Phaser.Text

        constructor(game:Phaser.Game, x:number, y:number, name:string) {
            super(game);
            this.x = x;
            this.y = y;
            this.name = name;
            this.updateTransform();
            this.init();
        }

        private init():void {
            this.lifebarImage = new Phaser.Sprite(this.game, this.x, this.y + 20, Images.Lifebar);
            this.addChild(this.lifebarImage);

            let textLength = this.name.length * 8;
            let center = this.x + (this.width / 2);
            let posX = center - (textLength / 2);
            this.lifebarText = new Phaser.Text(this.game, posX, this.y, this.name, { font: "18px Georgia", fill: "#DDDDDD", align: "left" });
            this.addChild(this.lifebarText);
        }
    }
}