module Fabrique {
    export class Tower extends Phaser.Group {
        private towerHeader:Phaser.Sprite;
        private towerFooter:Phaser.Sprite;
        private personageIcon:Phaser.Sprite;

        constructor(game:Phaser.Game){
            super(game);
            this.updateTransform();
            this.init();
        }

        private init():void{
            let x:number = 0;
            let y:number = 0;
            this.towerHeader = new Phaser.Sprite(this.game,x,y,Images.towerHeader);
            this.addChild(this.towerHeader);

            y += 135;

            let count = GameData.Data.id_enemies.length-1;
            while (count > 0) {
                let photo = new Phaser.Sprite(this.game, 200, y+15, GameData.Data.id_enemies[count]+'.png');
                photo.scale.x = 0.6;
                photo.scale.y = 0.6;
                this.addChild(photo);

                let towerContent = new Phaser.Sprite(this.game,0,y,Images.towerContent)
                this.addChild(towerContent);
                y += 95;
                count--;
            }

            let photo = new Phaser.Sprite(this.game, 200, y+15, GameData.Data.id_enemies[0]+'.png');
            photo.scale.x = 0.6;
            photo.scale.y = 0.6;
            this.addChild(photo);

            this.towerFooter = new Phaser.Sprite(this.game,0,y,Images.towerFooter)
            this.addChild(this.towerFooter);

            this.personageIcon = new Phaser.Sprite(this.game, 125, y+18, GameData.Data.user_personage.id+'.png');
            this.personageIcon.scale.x = 0.55;
            this.personageIcon.scale.y = 0.55;
            this.addChild(this.personageIcon);
        }

        public show(x:number, y:number):void {
            let tween: Phaser.Tween = this.game.add.tween(this);
            tween.to({ x: x, y:y-725}, 5000, 'Linear');
            tween.start();
        }
    }
}