module Fabrique {
    export class AnimationFighter extends Phaser.Sprite {
        private animation: Phaser.Animation;
        private personageAnimation: GameData.IPersonage;


        constructor(game: Phaser.Game, personageiD: string, personageAnim: GameData.IPersonage) {
            super(game, 0, 0, personageiD, 1);
            this.personageAnimation = personageAnim;
            this.init();
        }

        private init(): void {

            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(15, true, false);
        }

        private onComplete(sprite, animation): void {
            //console.log( (sprite as AnimationFighter).animation);

        }
    }
}