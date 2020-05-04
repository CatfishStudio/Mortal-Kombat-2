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
            this.stanceAnimation();
        }

        /*
        public winAnimation():void{
            this.animation.stop();
            this.animation.onComplete.removeAll();
            this.animation.destroy();
            this.animationType = Constants.ANIMATION_TYPE_STANCE;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animWin);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(10, true, false);
        }
        */

        public stanceAnimation()
        {
            this.animationType = Constants.ANIMATION_TYPE_STANCE;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(10, true, false);
        }

        public changeAnimation(type)
        {
            this.animation.stop();
            this.animation.onComplete.removeAll();
            this.animation.destroy();
            this.animationType = type;
            if(this.animationType === Constants.ANIMATION_TYPE_STANCE) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            if(this.animationType === Constants.ANIMATION_TYPE_BLOCK) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animBlock);
            if(this.animationType === Constants.ANIMATION_TYPE_DAMAGE) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animDamage);
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_HAND) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitHand);
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitHandUppercut);
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_LEG) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitLeg);
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_LEG_TWIST) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitLegTwist);
            if(this.animationType === Constants.ANIMATION_TYPE_LOSE) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animLose);
            if(this.animationType === Constants.ANIMATION_TYPE_WIN) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animWin);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(10, false, false);
        }

        private onComplete(sprite, animation): void {
            //console.log( (sprite as AnimationFighter).animation);
            if(this.animationType === Constants.ANIMATION_TYPE_STANCE) return;
            else this.stanceAnimation();
        }
    }
}