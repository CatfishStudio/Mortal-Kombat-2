module Fabrique {

    export class WindowPersonage extends Phaser.Sprite {

        private border:Phaser.Sprite;
        private animPersonage:AnimationFighter;
        private fighter: Phaser.Group;

        constructor(game:Phaser.Game, x:number, y:number){
            super(game, x, y, Images.WindowBackground);
            this.init();
        }

        private init():void{
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
            this.fighter = new Phaser.Group(this.game, this);
        }

        public showPersonage(personageID:string):void{
            GameData.Data.personages.forEach((personage: GameData.IPersonage) => {
                if(personage.id === personageID){
                    this.animPersonage = new AnimationFighter(this.game, personage.id, personage);
                    this.animPersonage.x = (this.width - this.animPersonage.width) / 3;
                    this.animPersonage.y = (this.height - this.animPersonage.height) / 4;
                    this.animPersonage.scale.x = 1.5;
                    this.animPersonage.scale.y = 1.5;
                    this.fighter.addChild(this.animPersonage);
                    this.addChild(this.border);
                    return;
                }
            });
        }

        public changePersonage(personageID:string):void{
            GameData.Data.personages.forEach((personage: GameData.IPersonage) => {
                if(personage.id === personageID){
                    this.animPersonage.destroy();
                    this.fighter.removeAll();
                    this.animPersonage = new AnimationFighter(this.game, personage.id, personage);
                    this.animPersonage.x = (this.width - this.animPersonage.width) / 3;
                    this.animPersonage.y = (this.height - this.animPersonage.height) / 4;
                    this.animPersonage.scale.x = 1.5;
                    this.animPersonage.scale.y = 1.5;
                    this.fighter.addChild(this.animPersonage);
                    console.log(personage);
                    return;
                }
            });
        }

    }

}