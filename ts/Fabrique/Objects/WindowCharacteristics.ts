module Fabrique {

    export class WindowCharacteristics extends Phaser.Sprite {
        private border:Phaser.Sprite;

        constructor(game:Phaser.Game, x:number, y:number){
            super(game, x, y, Images.WindowBackground2);
            this.init();
        }

        private init():void{
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder2);
        }

        public showCharacteristics(personageID:string):void{


            this.addChild(this.border);
        }
    }
}