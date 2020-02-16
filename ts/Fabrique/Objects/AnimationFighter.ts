module Fabrique {
    export class AnimationFighter extends Phaser.Sprite {
        private animation: Phaser.Animation;
        private personageAnimation: GameData.IPersonage;


        constructor(game: Phaser.Game, atlas: string, frame:string|number) {
            super(game, 0, 0, atlas, frame);
            this.init();
        }

        private init(): void {
            this.animation = this.animations.add('personage', [
                'liukang_stance_left_to_right_01.png',
                'liukang_stance_left_to_right_02.png',
                'liukang_stance_left_to_right_03.png',
                'liukang_stance_left_to_right_04.png',
                'liukang_stance_left_to_right_05.png',
                'liukang_stance_left_to_right_06.png',
                'liukang_stance_left_to_right_07.png'
            ], 15, true);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(15, true, false);
        }

        private onComplete(sprite, animation): void {
            //console.log( (sprite as AnimationFighter).animation);

        }
    }
}