module Fabrique {

    export class Title extends Phaser.Sprite {
        private posX:number = 0;
        private posY:number = 0;
        private text:string;

        constructor(game:Phaser.Game, x:number, y:number, text:string){
            super(game, x, y, Images.Title);
            this.text = text;
            this.posX = ( (Constants.GAME_WIDTH / 2) - (this.width / 2) );
            this.posY = Constants.GAME_HEIGHT / 10;
            if(x >= 0) this.x = this.posX;
            if(y >= 0) this.y = this.posY;
            this.updateTransform();
            this.init();
        }

        private init():void{
            let size:number = 12 * this.text.length;
            let posX:number = (this.width / 2) - (size / 2);
            let titleText:Phaser.Text = this.game.add.text(posX, 20, this.text, {font: "18px Georgia", fill: "#FFFFFF", align: "left"});
            this.addChild(titleText);
        }

        public show():void{
            let tween:Phaser.Tween = this.game.add.tween(this);
            tween.to({x: this.posX, y: this.posY}, 500, 'Linear');
            tween.start();
        }

    }

}