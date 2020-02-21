module Fabrique {

    export class Icon extends Phaser.Button {
        public event: Phaser.Signal;
        private graphics:Phaser.Graphics;
        public id:string;

        constructor(game:Phaser.Game, x:number, y:number, image:string, id:string){
            super(game, x, y, image, ()=>{
                this.event.dispatch(Constants.SELECT_FIGHTER, this.id);
            });
            this.id = id;
            this.init();
        }

        private init():void{
            this.event = new Phaser.Signal();
            this.graphics = this.game.add.graphics(0, 0);
            this.graphics.beginFill(0x000000, 0);
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0,0,90,120);
            this.graphics.endFill();

            this.addChild(this.graphics);
        }

        public select():void{
            this.graphics.lineStyle(2, 0xFFFFFF, 1);
            this.graphics.drawRect(0,0,90,120);
            this.graphics.lineStyle(1, 0x000000, 1);
            this.graphics.drawRect(0,0,90,120);
        }

        public unselect():void{
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0,0,90,120);
        }
    }
}