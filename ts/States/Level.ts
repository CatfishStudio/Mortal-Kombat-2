module MortalKombat {
    import AnimationFighter = Fabrique.AnimationFighter;
    import Field = Match3.Field;

    export class Level extends Phaser.State{
        public static Name: string = "level";
        public name: string = Tournament.Name;
    
        private groupContent: Phaser.Group;
        private backgroundSprite:Phaser.Sprite;
        private borderSprite:Phaser.Sprite;
        private helpButton:Phaser.Button;
        private persUser:GameData.IPersonage;
        private animUser:AnimationFighter;
        private persEnemies:GameData.IPersonage;
        private animEnemies:AnimationFighter;
        private field:Field;

        constructor() {
            super();
        }

        public create() {
            this.groupContent = new Phaser.Group(this.game, this.stage);

            this.backgroundSprite = new Phaser.Sprite(this.game, 0, 0, GameData.Data.levels[GameData.Data.tournamentProgress][0]);
            this.groupContent.addChild(this.backgroundSprite);

            this.persUser = GameData.Data.user_personage;
            this.animUser = new AnimationFighter(this.game, this.persUser.id, this.persUser);
            this.animUser.x = 100 - (this.animUser.width / 2);
            this.animUser.y = Constants.GAME_HEIGHT - (this.animUser.height*2);
            this.animUser.scale.x = 1.5;
            this.animUser.scale.y = 1.5;
            this.groupContent.addChild(this.animUser);

            this.persEnemies = GameData.Data.getPersonage(GameData.Data.id_enemies[GameData.Data.tournamentProgress]);
            this.animEnemies = new AnimationFighter(this.game, this.persEnemies.id, this.persEnemies);
            this.animEnemies.x = Constants.GAME_WIDTH - 25 - (this.animEnemies.width / 2);
            this.animEnemies.y = Constants.GAME_HEIGHT - (this.animEnemies.height*2);
            this.animEnemies.anchor.setTo(.0, .0);
            this.animEnemies.scale.x = 1.5;
            this.animEnemies.scale.y = 1.5;
            this.animEnemies.scale.x *= -1;
            this.groupContent.addChild(this.animEnemies);

            this.borderSprite = new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage);
            this.groupContent.addChild(this.borderSprite);

            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupContent.addChild(this.helpButton);

            this.field = new Field(this.game, this.groupContent);
        }

        public shutdown(){
            this.field.removeAll();
            this.groupContent.removeAll();
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
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG_TWIST);
                        break;
                    }  
                default:
                    break;
            }
        }
    }
}