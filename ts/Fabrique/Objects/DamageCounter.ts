module Fabrique {
    export class DamageCounter extends Phaser.Text {

        private startPosX:number;
        private startPosY:number;
        private tween: Phaser.Tween;
        private values:string[]; 
        private status:string;

        constructor(game:Phaser.Game, x:number, y:number){
            super(game, x, y, "", { font: "36px Georgia", fill: "#FF0000", align: "left" });
            this.updateTransform();
            this.startPosX = x;
            this.startPosY = y;
            this.values = [];
            this.status = "stop";
            this.init();
        }

        private init():void {
            this.alpha = 0;
            this.tween = this.game.add.tween(this);
            this.tween.to({ x: this.startPosX, y: this.startPosY - 250}, 500, 'Linear');
        }

        public show(value:string, block:boolean):void {
            if(this.status === "stop"){
                this.status = "start";
                this.values.push(value); // добавляет элемент в конец массива
                if(this.values.length > 0) value = this.values[0];
                if(value !== "0") this.text = "-" + value;
                else this.text = value;
                if(block === false) this.setStyle({ font: "36px Georgia", fill: "#FF0000", align: "left" }, true);
                else this.setStyle({ font: "36px Georgia", fill: "#FFFF00", align: "left" }, true);
                this.alpha = 1;
                this.tween.onComplete.add(this.onCompleteVideo, this);
                this.tween.start();
            }else{
                this.values.push(value); // добавляет элемент в конец массива
            }
            
        }

        private onCompleteVideo():void {
            this.status = "stop";
            this.values.shift() // удаляет первый элемент в массиве
            this.x = this.startPosX;
            this.y = this.startPosY;
            this.alpha = 0;
            this.text = "";
            if(this.values.length > 0) {
                let value = this.values[0];
                if(value !== "0") this.text = "-" + value;
                else this.text = value;
                this.alpha = 1;
                this.tween.onComplete.add(this.onCompleteVideo, this);
                this.tween.start();
            }
        }
    }
}