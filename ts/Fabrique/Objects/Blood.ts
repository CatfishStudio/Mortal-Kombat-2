module Fabrique {
    export class Blood extends Phaser.Sprite {
        private animation: Phaser.Animation;

        constructor(game:Phaser.Game){
            super(game, 0, 0, Atlases.Blood, 0);
            this.init();
        }

        private init():void {
            this.animation = this.animations.add(Atlases.Blood);
            this.animation.onComplete.add(this.onCompleteVideo, this);
            this.alpha = 0;
        }

        private onCompleteVideo():void {
            this.alpha = 0;
        }

        public show():void {
            this.alpha = 1;
            this.animation.play(10, false, false);
        }
    }
}