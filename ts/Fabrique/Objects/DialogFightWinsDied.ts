module Fabrique {

    export class DialodFightWinsDied extends Phaser.Group {
        public static WINS = "wins";
        public static DIED = "died";

        public event: Phaser.Signal;
        private graphicOverlay: Phaser.Graphics
        private sprite:Phaser.Sprite;
        private tween:Phaser.Tween;
        private cX:number;
        private cY:number;

        constructor(game:Phaser.Game){
            super(game);
            this.init();
        }

        private init():void{
            this.event = new Phaser.Signal();
            
            this.cX = this.game.width / 2;
            this.cY = this.game.height / 2;

            this.graphicOverlay = new Phaser.Graphics(this.game, 0, 0);
            this.graphicOverlay.beginFill(0x000000, 0.1);
            this.graphicOverlay.drawRect(0, 0, this.game.width, this.game.height);
            this.graphicOverlay.endFill();
            this.graphicOverlay.inputEnabled = true;

            this.updateTransform();
        }

        public showFight():void {
            this.addChild(this.graphicOverlay);

            this.sprite = new Phaser.Sprite(this.game, this.cX, this.cY, Images.fight);
            this.sprite.width = 0;
            this.sprite.height = 0;
            this.addChild(this.sprite);

            this.tween = this.game.add.tween(this.sprite);
            this.tween.to({ width: 490, height: 170, x: (this.cX - 245), y: (this.cY - 85)}, 1000, 'Linear');
            this.tween.to({ width: 0, height: 0, x: this.cX, y:this.cY}, 1000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            this.tween.start();
        }

        private onTweenComplete(event:any):void {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.removeChild(this.graphicOverlay);
        }

        public showWins():void {
            this.addChild(this.graphicOverlay);

            this.sprite = new Phaser.Sprite(this.game, this.cX, this.cY, Images.wins);
            this.sprite.width = 0;
            this.sprite.height = 0;
            this.addChild(this.sprite);

            this.tween = this.game.add.tween(this.sprite);
            this.tween.to({ width: 490, height: 170, x: (this.cX - 245), y: (this.cY - 85)}, 1000, 'Linear');
            this.tween.to({ width: 0, height: 0, x: this.cX, y:this.cY}, 1000, 'Linear');
            this.tween.onComplete.add(this.onWins, this);
            this.tween.start();
        }

        private onWins(event:any):void {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.event.dispatch(DialodFightWinsDied.WINS);
        }

        public showDied():void {
            this.addChild(this.graphicOverlay);

            this.sprite = new Phaser.Sprite(this.game, this.cX, this.cY, Images.died);
            this.sprite.width = 0;
            this.sprite.height = 0;
            this.addChild(this.sprite);

            this.tween = this.game.add.tween(this.sprite);
            this.tween.to({ width: 720, height: 175, x: (this.cX - 360), y: (this.cY - 87)}, 1000, 'Linear');
            this.tween.to({ width: 0, height: 0, x: this.cX, y:this.cY}, 1000, 'Linear');
            this.tween.onComplete.add(this.onDied, this);
            this.tween.start();
        }        

        private onDied(event:any):void {
            this.removeChild(this.sprite);
            this.sprite.destroy();
            this.event.dispatch(DialodFightWinsDied.DIED);
        }
    }
}