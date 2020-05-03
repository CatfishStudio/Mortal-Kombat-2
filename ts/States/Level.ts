module MortalKombat {
    export class Level extends Phaser.State{
        public static Name: string = "level";
        public name: string = Tournament.Name;
    
        private groupContent: Phaser.Group;
        private backgroundSprite:Phaser.Sprite;
        private borderSprite:Phaser.Sprite;

        constructor() {
            super();
        }

        public create() {
            this.groupContent = new Phaser.Group(this.game, this.stage);

            this.backgroundSprite = new Phaser.Sprite(this.game, 0, 0, GameData.Data.levels[GameData.Data.tournamentProgress][0]);
            this.groupContent.addChild(this.backgroundSprite);

            this.borderSprite = new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage);
            this.groupContent.addChild(this.borderSprite);
        }

        public shutdown(){
            
            this.game.stage.removeChildren();
        }

        private onButtonClick(event) {
            switch (event.name) {
                case Constants.BACK_MENU:
                    {
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        break;
                    }
                case Constants.HELP:
                    {
                        break;
                    }  
                default:
                    break;
            }
        }
    }
}