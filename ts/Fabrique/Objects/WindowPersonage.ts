module Fabrique {

    export class WindowPersonage extends Phaser.Sprite {

        private border:Phaser.Sprite;
        private animPersonage:AnimationFighter;

        constructor(game:Phaser.Game, x:number, y:number){
            super(game, x, y, Images.WindowBackground);
            this.init();
        }

        private init():void{
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
        }

        public showPersonage(atlas:string, prefix:string):void{
            this.animPersonage = new AnimationFighter(this.game, GameData.Data.personages[0].id, GameData.Data.personages[0]);
            this.animPersonage.x = (this.width - this.animPersonage.width) / 3;
            this.animPersonage.y = (this.height - this.animPersonage.height) / 4;
            this.animPersonage.scale.x = 1.5;
            this.animPersonage.scale.y = 1.5;
            this.addChild(this.animPersonage);
            this.addChild(this.border);
        }
    }

}