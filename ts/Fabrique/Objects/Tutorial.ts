module Fabrique {

    export class Tutorial extends Phaser.Sprite {

        private text:string;
        
        constructor(game:Phaser.Game, text:string){
            super(game, 0, 0, Atlases.VideoHelp, 0);
            this.text = text;
            this.init();
        }

        private init():void{
            let graphics:Phaser.Graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0x000000, 0);
            graphics.lineStyle(10, 0x000000, 1);
            graphics.drawRect(0,0,400,116);
            graphics.endFill();

            graphics.beginFill(0x000000, 0.6);
            graphics.lineStyle(1, 0x000000, 1);
            graphics.drawRect(150,0,250,116);
            graphics.endFill();

            graphics.beginFill(0x000000, 0.5);
            graphics.lineStyle(2, 0xFFFFFF, 0.5);
            graphics.drawRect(0,0,400,116);
            graphics.endFill();

            this.addChild(graphics);

            let messageText: Phaser.Text = this.game.add.text(175, 10, this.text, { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(messageText);

            let anim: Phaser.Animation = this.animations.add(Atlases.VideoHelp);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(10, true, false);
                        
        }

        private onCompleteVideo():void {

        }

        public show(x:number, y:number):void {
            let tween: Phaser.Tween = this.game.add.tween(this);
            tween.to({ x: x, y:y}, 500, 'Linear');
            tween.start();
        }

    }

}