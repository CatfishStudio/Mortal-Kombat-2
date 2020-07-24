module Fabrique {
    export class DamageCounter extends Phaser.Text {

        private startPosX:number;
        private startPosY:number;
        private tween: Phaser.Tween

        constructor(game:Phaser.Game, x:number, y:number){
            super(game, x, y, "", { font: "36px Georgia", fill: "#FF0000", align: "left" });
            this.updateTransform();
            this.startPosX = x;
            this.startPosY = y;
            this.init();
        }

        private init():void {
            this.alpha = 0;
            this.tween = this.game.add.tween(this);
            this.tween.to({ x: this.startPosX, y: this.startPosY - 250}, 500, 'Linear');
            Utilits.Data.debugLog("INIT POINTS:", "X="+this.startPosX + " | Y=" + this.startPosY);
        }

        public show(value:string, block:boolean):void {
            Utilits.Data.debugLog("SHOW POINTS:", "X="+this.x + " | Y=" + this.y);
            if(value !== "0") this.text = "-" + value;
            else this.text = value;
            if(block === false) this.setStyle({ font: "36px Georgia", fill: "#FF0000", align: "left" }, true);
            else this.setStyle({ font: "36px Georgia", fill: "#FFFF00", align: "left" }, true);
            this.alpha = 1;
            this.tween.onComplete.add(this.onCompleteVideo, this)
            this.tween.start();
        }

        private onCompleteVideo():void {
            this.x = this.startPosX;
            this.y = this.startPosY;
            this.alpha = 0;
            this.text = "";
            Utilits.Data.debugLog("END POINTS:", "X="+this.x + " | Y=" + this.y);
        }

        /*
        private init():void {
            this.startPosX = this.x;
            this.startPosY = this.y;
            this.alpha = 0;
            Utilits.Data.debugLog("INIT POINTS:", "X="+this.startPosX + " | Y=" + this.startPosY);
        }

        public show(value:string):void {
            this.x = this.startPosX;
            this.y = this.startPosY;
            Utilits.Data.debugLog("SHOW POINTS:", "X="+this.x + " | Y=" + this.y);
            this.text = value;
            this.alpha = 1;
            let tween: Phaser.Tween = this.game.add.tween(this);
            tween.to({ x: this.startPosX, y: this.startPosY - 250}, 10000, 'Linear');
            tween.onComplete.add(this.onCompleteVideo, this)
            tween.start();
        }

        private onCompleteVideo():void {
            this.x = this.startPosX;
            this.y = this.startPosY;
            this.alpha = 0;
            this.text = "0";
            Utilits.Data.debugLog("END POINTS:", "X="+this.x + " | Y=" + this.y);
        }
        */
    }
}