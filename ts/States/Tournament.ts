module MortalKombat {

    import Tutorial = Fabrique.Tutorial;
    import Settings = Fabrique.Settings;
    import Title = Fabrique.Title;
    import Tower = Fabrique.Tower;
    import UpgradeCharacteristics = Fabrique.UpgradeCharacteristics;

    export class Tournament extends Phaser.State{
        public static Name: string = "tournament";
        public name: string = Tournament.Name;

        private groupContent: Phaser.Group;
        private videoSprite:Phaser.Sprite;
        private backgroundSprite:Phaser.Sprite;
        private tween:Phaser.Tween;
        private title:Title;
        private settings:Settings;
        private tutorial:Tutorial;
        private backButton:Phaser.Button;
        private settingsButton:Phaser.Button;
        private helpButton:Phaser.Button;
        private startButton:Phaser.Button;
        private tower:Tower;
        private userUpgradeCharacteristics:UpgradeCharacteristics;
        private enemyUpgradeCharacteristics:UpgradeCharacteristics;

        constructor() {
            super();
        }

        public create() {
            this.groupContent = new Phaser.Group(this.game, this.stage);

            this.backgroundSprite = new Phaser.Sprite(this.game, -5,-5, Images.UpgradeImage);
            this.backgroundSprite.scale.set(1.025);
            this.groupContent.addChild(this.backgroundSprite);

            this.tween = this.game.add.tween(this.backgroundSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0}, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);

            this.videoSprite = new Phaser.Sprite(this.game,0,0,Atlases.Video3,0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupContent.addChild(this.videoSprite);

            let anim: Phaser.Animation = this.videoSprite.animations.add(Atlases.Video3);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);

            this.createContent();

            this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        }

        public shutdown(){
            this.tween.stop();
            this.tween = null;
            this.title.removeChildren();
            this.tower.removeChildren();
            this.tower.removeAll();
            this.tutorial.removeChildren();
            this.userUpgradeCharacteristics.removeChildren();
            this.userUpgradeCharacteristics.removeAll();
            this.enemyUpgradeCharacteristics.removeChildren();
            this.enemyUpgradeCharacteristics.removeAll();
            this.groupContent.removeAll();
            this.game.stage.removeChildren();
        }

        private onCompleteVideo():void {
            this.tween.start();

            this.title.show();
            if(Config.settintTutorial === true) this.tutorial.show(0, 150);

            this.tower.show(this.tower.x, 0);
            this.userUpgradeCharacteristics.show(50, this.userUpgradeCharacteristics.y);
            this.enemyUpgradeCharacteristics.show(600, this.enemyUpgradeCharacteristics.y);

            this.backButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonBackMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backButton.name = Constants.BACK_MENU;
            this.groupContent.addChild(this.backButton);

            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), 5, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupContent.addChild(this.settingsButton);

            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupContent.addChild(this.helpButton);

            this.startButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), (Constants.GAME_HEIGHT - 50), Sheet.ButtonStartBattle, this.onButtonClick, this, 1, 2, 2, 2);
            this.startButton.name = Constants.START;
            this.groupContent.addChild(this.startButton);
        }

        private onTweenComplete(event:any):void {
            this.tween.start();
        }

        private createContent():void{
            /* tower */
            this.tower = new Tower(this.game);
            this.tower.x = (Constants.GAME_HEIGHT / 2) - (this.tower.width / 3);
            this.tower.y = Constants.GAME_WIDTH;
            this.groupContent.addChild(this.tower);

            /* title */
            this.title = new Title(this.game, 0, -50, 'ТУРНИР');
            this.groupContent.addChild(this.title);
                        
            /* tutorial */
            this.tutorial = new Tutorial(this.game, GameData.Data.tutorList[1]);
            this.tutorial.x = -500;
            this.tutorial.y = 150;
            this.groupContent.addChild(this.tutorial);

            /* Upgrade */
            this.userUpgradeCharacteristics = new UpgradeCharacteristics(this.game, true);
            this.userUpgradeCharacteristics.x = -500;
            this.userUpgradeCharacteristics.y = 300;
            this.groupContent.addChild(this.userUpgradeCharacteristics);
            this.enemyUpgradeCharacteristics = new UpgradeCharacteristics(this.game, false);
            this.enemyUpgradeCharacteristics.x = Constants.GAME_WIDTH + 500;
            this.enemyUpgradeCharacteristics.y = 300;
            this.groupContent.addChild(this.enemyUpgradeCharacteristics);

            Utilits.Data.debugLog("TOURNAMENT - CHANGE USER PERSOHAGE", GameData.Data.user_personage);
        }

        private onButtonClick(event) {
            switch (event.name) {
                case Constants.START:
                    {
                        this.game.state.start(Level.Name, true, false);
                        break;
                    }
                
                case Constants.BACK_MENU:
                    {
                        if(GameData.Data.tournamentProgress === 0) this.game.state.start(Fighters.Name, true, false);
                        else this.game.state.start(Menu.Name, true, false);
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.settingsClose();
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

        private settingsCreate() {
            this.tutorial.x = -500;
            this.tutorial.y = 150;
            
            this.settings = new Settings(this.game, this.groupContent);
            this.settings.event.add(this.onButtonClick.bind(this));
        }

        private settingsClose() {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupContent.removeChild(this.settings);
            
            if(Config.settintTutorial === true){
                let tweenTutorial: Phaser.Tween = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: 0, y: 150}, 500, 'Linear');
                tweenTutorial.start();
            }
        }
    }

}