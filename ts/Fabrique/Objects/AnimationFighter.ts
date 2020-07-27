module Fabrique {
    import Blood = Fabrique.Blood;
    
    export class AnimationFighter extends Phaser.Sprite {
        
        private animation: Phaser.Animation;
        private personageAnimation: GameData.IPersonage;
        private animationType: string;
        private blood: Blood;
        public block: boolean;        

        constructor(game: Phaser.Game, personageiD: string, personage: GameData.IPersonage) {
            super(game, 0, 0, personageiD, 1);
            this.personageAnimation = personage;
            this.init();
        }

        private init(): void {
            this.block = false;
            this.stanceAnimation();
            this.blood = new Blood(this.game);
            this.blood.x = -100;
            this.blood.y = this.y - 50;
            this.addChild(this.blood);
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

        public blockAnimation()
        {
            this.animationType = Constants.ANIMATION_TYPE_BLOCK;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animBlock);
            this.animation.onComplete.add(this.onComplete, this);
            this.frameName = this.personageAnimation.animBlock[this.personageAnimation.animBlock.length-1];
        }

        public changeAnimation(type)
        {
            this.animation.stop();
            this.animation.onComplete.removeAll();
            this.animation.destroy();
            this.animationType = type;
            if(this.animationType === Constants.ANIMATION_TYPE_STANCE) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            if(this.animationType === Constants.ANIMATION_TYPE_BLOCK) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animBlock);
            if(this.animationType === Constants.ANIMATION_TYPE_DAMAGE && this.block === false) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animDamage);
            if(this.animationType === Constants.ANIMATION_TYPE_DAMAGE && this.block === true) this.blockAnimation(); 
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_HAND) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitHand);
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitHandUppercut);
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_LEG) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitLeg);
            if(this.animationType === Constants.ANIMATION_TYPE_HIT_LEG_TWIST) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animHitLegTwist);
            if(this.animationType === Constants.ANIMATION_TYPE_LOSE) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animLose);
            if(this.animationType === Constants.ANIMATION_TYPE_WIN) this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animWin);
            this.animation.onComplete.add(this.onComplete, this);
            if(this.animationType === Constants.ANIMATION_TYPE_LOSE) this.animation.play(10, true, true);
            else this.animation.play(10, false, false);
        }

        private onComplete(sprite, animation): void {
            //console.log( (sprite as AnimationFighter).animation);
            if(this.animationType === Constants.ANIMATION_TYPE_BLOCK) this.block = true;
            if(this.animationType === Constants.ANIMATION_TYPE_STANCE || this.animationType === Constants.ANIMATION_TYPE_WIN || this.animationType === Constants.ANIMATION_TYPE_LOSE) return;
            else {
                if(this.block === false) this.stanceAnimation();
                else this.blockAnimation();
            }
        }

        public showBlood():void
        {
            if(this.block === false) this.blood.show();
        }

    }
}