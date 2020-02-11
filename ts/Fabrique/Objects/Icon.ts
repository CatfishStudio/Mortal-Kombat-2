module Fabrique {

    export class Icon extends Phaser.Sprite {
        constructor(game:Phaser.Game, x:number, y:number, image:string){
            super(game, x, y, image);
        }
    }
}