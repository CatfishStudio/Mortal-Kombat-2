module Fabrique {
    export class LifeBar extends Phaser.Group {

        private lifebarImage:Phaser.Sprite;
        private lifebarText:Phaser.Text

        constructor(game:Phaser.Game, parent:any) {
            super(game, parent);
            this.updateTransform();
            this.init();
        }

        private init():void {
            this.lifebarText = new Phaser.Text(this.game, 0, 0, "UserName", { font: "12px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(this.lifebarText);

            this.lifebarImage = new Phaser.Sprite(this.game, 0, 0, Images.Lifebar);
            this.addChild(this.lifebarImage);
        }
    }
}