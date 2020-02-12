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
            this.animPersonage = new AnimationFighter(this.game, Atlases.LiukangAnimation, 0);
            this.animPersonage.scale.x = 1.5;
            this.animPersonage.scale.y = 1.5;
            this.addChild(this.animPersonage);
            this.addChild(this.border);
        }
    }

}