module Fabrique {
    export class DamageCounter extends Phaser.Text {

        private startPosX:number;
        private startPosY:number;

        constructor(game:Phaser.Game){
            super(game, 0, 0, "0", { font: "18px Georgia", fill: "#FF0000", align: "left" });
            this.updateTransform();
            this.init();
        }

        private init():void {
            this.startPosX = this.x;
            this.startPosY = this.y;
            this.alpha = 0;
        }

        public show(value:string):void {
            this.x = this.startPosX;
            this.y = this.startPosY;
            this.text = value;
            this.alpha = 1;
            let tween: Phaser.Tween = this.game.add.tween(this);
            tween.to({ x: this.startPosX, y: this.startPosY - 250}, 1000, 'Linear');
            tween.onComplete.add(this.onCompleteVideo, this)
            tween.start();
        }

        private onCompleteVideo():void {
            this.x = this.startPosX;
            this.y = this.startPosY;
            this.alpha = 0;
            this.text = "0";
        }
    }
}