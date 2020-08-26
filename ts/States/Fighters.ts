module MortalKombat {

    import Tutorial = Fabrique.Tutorial;
    import Settings = Fabrique.Settings;
    import Help = Fabrique.Help;
    import Title = Fabrique.Title;
    import PanelIcons = Fabrique.PanelIcons;

    export class Fighters extends Phaser.State{
        public static Name: string = "fighters";
        public name: string = Menu.Name;

        private tween:Phaser.Tween;
        private groupFighters: Phaser.Group;
        private videoSprite:Phaser.Sprite;
        private fightersSprite:Phaser.Sprite;
        private title:Title;
        private panelIcons:PanelIcons;
        private tutorial:Tutorial;
        private settings:Settings;
        private help:Help;
        private backMenuButton:Phaser.Button;
        private settingsButton:Phaser.Button;
        private helpButton:Phaser.Button;
        private selectButton:Phaser.Button;

        constructor(){
            super();
        }

        public create(){
            this.groupFighters = new Phaser.Group(this.game, this.stage)

            this.fightersSprite = new Phaser.Sprite(this.game, -5, -5, Images.FightersImage);
            this.fightersSprite.scale.set(1.025);
            this.groupFighters.addChild(this.fightersSprite);

            this.tween = this.game.add.tween(this.fightersSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0}, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);

            this.videoSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Video2, 0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupFighters.addChild(this.videoSprite);

            let anim:Phaser.Animation = this.videoSprite.animations.add(Atlases.Video2);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);

            this.createContent();

            this.groupFighters.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage))
        }

        public shutdown(){
            this.tween.stop();
            this.tween = null;
            this.title.removeChildren();
            this.panelIcons.removeChildren();
            this.panelIcons.removeAll();
            this.tutorial.removeChildren();
            this.groupFighters.removeChildren();
            this.groupFighters.removeAll();
            this.game.stage.removeChildren();
        }

        private onCompleteVideo():void{
            this.tween.start();
            this.title.show();
            if(Config.settingTutorial === true) this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));

            this.backMenuButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonBackMenuMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backMenuButton.name = Constants.BACK_MENU;
            this.groupFighters.addChild(this.backMenuButton);

            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), 5, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupFighters.addChild(this.settingsButton);

            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupFighters.addChild(this.helpButton);

            this.selectButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), (Constants.GAME_HEIGHT - 50), Sheet.ButtonSelectFighter, this.onButtonClick, this, 1, 2, 2, 2);
            this.selectButton.name = Constants.SELECT_FIGHTER;
            this.groupFighters.addChild(this.selectButton);

            this.panelIcons.show();
        }

        private onTweenComplete(event:any){
            this.tween.start();
        }

        private createContent():void{
            /* title */
            this.title = new Title(this.game, 0, -50, 'ВЫБОР БОЙЦА');
            this.groupFighters.addChild(this.title);

            /* panel icons */
            this.panelIcons = new PanelIcons(this.game, this.groupFighters);
                        
            /* tutorial */
            this.tutorial = new Tutorial(this.game, 'Нажмите на иконку\nбойца и на кнопку\n"Выбрать бойца');
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupFighters.addChild(this.tutorial);
        }

        private onButtonClick(event) {
            switch (event.name) {
                case Constants.BACK_MENU:
                    {
                        this.game.state.start(Menu.Name, true, false);
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
                        this.helpCreate();
                        break;
                    }  
                case Constants.HELP_CLOSE:
                    {
                        this.helpClose();
                        break;
                    }  
                case Constants.SELECT_FIGHTER:
                    {
                        GameData.Data.initNewGame();
                        GameData.Data.saveData = SocialVK.vkSaveData();
                        this.game.state.start(Tournament.Name, true, false);
                        break;
                    }                        
                default:
                    break;
            }
        }

        private settingsCreate() {
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            
            this.settings = new Settings(this.game, this.groupFighters);
            this.settings.event.add(this.onButtonClick.bind(this));
        }

        private settingsClose() {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupFighters.removeChild(this.settings);
            
            if(Config.settingTutorial === true){
                let tweenTutorial: Phaser.Tween = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175)}, 500, 'Linear');
                tweenTutorial.start();
            }
        }

        private helpCreate() {
            this.help = new Help(this.game, this.groupFighters, "ВЫБОР БОЙЦА.");
            this.help.event.add(this.onButtonClick.bind(this));
        }

        private helpClose() {
            this.help.removeChildren();
            this.help.removeAll();
            this.groupFighters.removeChild(this.help);
        }
    }
}