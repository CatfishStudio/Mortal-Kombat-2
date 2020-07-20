module MortalKombat {
    import AnimationFighter = Fabrique.AnimationFighter;
    import LifeBar = Fabrique.LifeBar;
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
        private lifebar:LifeBar;
        private field:Field;

        constructor() {
            super();
        }

        public create() {
            this.groupContent = new Phaser.Group(this.game, this.stage);

            this.backgroundSprite = new Phaser.Sprite(this.game, 0, 0, GameData.Data.levels[GameData.Data.tournamentProgress][0]);
            this.groupContent.addChild(this.backgroundSprite);

            this.borderSprite = new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage);
            this.groupContent.addChild(this.borderSprite);

            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupContent.addChild(this.helpButton);

            this.lifebar = new LifeBar(this.game, this.groupContent);
            

            let valueJSON = this.game.cache.getJSON(GameData.Data.levels[GameData.Data.tournamentProgress][1]);
            this.field = new Field(this.game, this.groupContent);
            this.field.event.add(this.onMatch, this);
            this.field.createMatchField(valueJSON);

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
        }

        /* Произошло событие match на поле */
        public onMatch(hitType:any, hitCount:number, statusAction:String):void
        {
            Utilits.Data.debugLog("LEVEL: match |", "type=" + hitType + " | count=" + hitCount + " | status=" + statusAction);
            if(hitType === null && hitCount=== null){
                if(statusAction === Field.ACTION_PLAYER){
                    this.animUser.block = false; // сбросить блок игрока
                    this.animUser.stanceAnimation();
                }else{
                    this.animEnemies.block = false; // сбросить блок оппонента
                    this.animEnemies.stanceAnimation();
                }
            }else{
                if(statusAction === Field.ACTION_PLAYER){
                    if(hitType === Constants.HAND)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND);
                    if(hitType === Constants.LEG)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG);
                    if(hitType === Constants.BLOCK)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_BLOCK);
                    if(hitType === Constants.TWIST)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG_TWIST);
                    if(hitType === Constants.UPPERCUT)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT);
                    this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_DAMAGE);
                }else{
                    if(hitType === Constants.HAND)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND);
                    if(hitType === Constants.LEG)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG);
                    if(hitType === Constants.BLOCK)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_BLOCK);
                    if(hitType === Constants.TWIST)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG_TWIST);
                    if(hitType === Constants.UPPERCUT)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT);
                    this.animUser.changeAnimation(Constants.ANIMATION_TYPE_DAMAGE);
                }
            }
        }

        public shutdown(){
            this.field.shutdown();
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
                        
                        break;
                    }  
                default:
                    break;
            }
        }

    }
}