module Fabrique {
    export class AnimationFighter extends Phaser.Sprite {
        private animation: Phaser.Animation;
        private personageAnimation: GameData.IPersonage;
        private animationType: string;


        constructor(game: Phaser.Game, personageiD: string, personage: GameData.IPersonage) {
            super(game, 0, 0, personageiD, 1);
            this.personageAnimation = personage;
            this.init();
        }

        private init(): void {
            this.animationType = Constants.ANIMATION_TYPE_STANCE;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(10, true, false);
        }

        private onComplete(sprite, animation): void {
            //console.log( (sprite as AnimationFighter).animation);
            if(this.animationType === Constants.ANIMATION_TYPE_STANCE) return;
        }

        public winAnimation():void{
            this.animation.stop();
            this.animation.onComplete.removeAll();
            this.animation.destroy();
            this.animationType = Constants.ANIMATION_TYPE_STANCE;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animWin);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(15, true, false);
        }
    }
}