module MortalKombat {

    import Tutorial = Fabrique.Tutorial;
    import Settings = Fabrique.Settings;

    export class Menu extends Phaser.State{
        public static Name: string = "menu";
        public name: string = Menu.Name;
        private videoSprite:Phaser.Sprite;
        private menuSprite:Phaser.Sprite;
        private startLogoSprite:Phaser.Sprite;
        private groupMenu: Phaser.Group;
        private groupButtons: Phaser.Group;
        private tween:Phaser.Tween;
        private tutorial:Tutorial;
        private settings:Settings;
        
        constructor() {
            super();
        }
        
        public create() {
            GameData.Data.initPersonages(this.game);

            this.initSounds();

            this.groupMenu = new Phaser.Group(this.game, this.stage);
            
            this.menuSprite = new Phaser.Sprite(this.game, -5,-5, Images.MenuImage)
            this.menuSprite.scale.set(1.025);
            this.groupMenu.addChild(this.menuSprite);
            
            this.videoSprite = new Phaser.Sprite(this.game,0,0,Atlases.Video1,0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupMenu.addChild(this.videoSprite);

            this.startLogoSprite = new Phaser.Sprite(this.game, 125, 150, Images.StartLogoImage);
            this.startLogoSprite.alpha = 0;
            this.groupMenu.addChild(this.startLogoSprite);

            this.tween = this.game.add.tween(this.startLogoSprite);
            this.tween.to({ alpha: 1 }, 2500, 'Linear');
            this.tween.to({ alpha: 0}, 2500, 'Linear');
            this.tween.start();

            let anim: Phaser.Animation = this.videoSprite.animations.add(Atlases.Video1);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);

            this.createButtons();

            this.groupMenu.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        }

        public shutdown(){
            this.tween.stop();
            this.tween = null;
            this.groupButtons.removeAll();
            this.groupMenu.removeAll();
            this.game.stage.removeChildren();
        }

        private createButtons():void{
            this.groupButtons = new Phaser.Group(this.game, this.groupMenu);
            this.groupButtons.x = -500;
            this.groupButtons.y = 0;
            this.groupButtons.visible = false;

            this.groupButtons.addChild(new Phaser.Sprite(this.game, 35, 80, Images.LogoImage));
            
            let buttonStart = new Phaser.Button(this.game, 75, 400, Sheet.ButtonStartNewGame, this.onButtonClick, this, 1, 2);
            buttonStart.name = Constants.START;
            this.groupButtons.addChild(buttonStart);
            
            let buttonSettings = new Phaser.Button(this.game, 75, 475, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            buttonSettings.name = Constants.SETTINGS;
            this.groupButtons.addChild(buttonSettings);
            
            let buttonInvite = new Phaser.Button(this.game, 75, 550, Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
            buttonInvite.name = Constants.INVITE;
            this.groupButtons.addChild(buttonInvite);

            this.tutorial = new Tutorial(this.game, 'Нажмите на кнопку\n"Начать игру"\nчтобы начать\nновый турнир.');
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupMenu.addChild(this.tutorial);

            this.continueGame();
        }

        private onCompleteVideo():void {
            this.groupButtons.visible = true;

            this.tween = this.game.add.tween(this.menuSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0}, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);

            let tweenButtons: Phaser.Tween = this.game.add.tween(this.groupButtons);
            tweenButtons.to({ x: 0, y: 0}, 500, 'Linear');
            tweenButtons.onComplete.add(() => {
                this.tween.start();
                if(Config.settintTutorial === true) this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));
            }, this);
            tweenButtons.start();
        }

        private onTweenComplete(event:any):void {
            this.tween.start();
        }

        
        private onButtonClick(event) {
            switch (event.name) {
                case Constants.START:
                    {
                        this.game.state.start(Fighters.Name, true, false);
                        break;
                    }
                case Constants.CONTINUE:
                    {
                        if(GameData.Data.user_continue <= 0) this.game.state.start(GameOver.Name, true, false); 
                        else if(GameData.Data.tournamentProgress > 12) this.game.state.start(GameOver.Name, true, false); 
                        else this.game.state.start(Tournament.Name, true, false);
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
                case Constants.INVITE:
                    {
                        
                        break;
                    }                
                default:
                    break;
            }
        }
        
        private settingsCreate() {
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            
            this.settings = new Settings(this.game, this.groupMenu);
            this.settings.event.add(this.onButtonClick.bind(this));
        }
        
        private settingsClose() {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupMenu.removeChild(this.settings);
            
            if(Config.settintTutorial === true){
                let tweenTutorial: Phaser.Tween = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175)}, 500, 'Linear');
                tweenTutorial.start();
            }
        }

        private continueGame(){
            /* Загрузка сохраненных данных */
            let loadData = SocialVK.LoadData(GameData.Data.saveData);

            if(loadData === true){
                let buttonStart = new Phaser.Button(this.game, 75, 475, Sheet.ButtonStartNewGame, this.onButtonClick, this, 1, 2);
                buttonStart.name = Constants.START;
                this.groupButtons.addChild(buttonStart);
                
                let buttonSettings = new Phaser.Button(this.game, 75, 550, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
                buttonSettings.name = Constants.SETTINGS;
                this.groupButtons.addChild(buttonSettings);
                
                let buttonInvite = new Phaser.Button(this.game, 75, 625, Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
                buttonInvite.name = Constants.INVITE;
                this.groupButtons.addChild(buttonInvite);

                let buttonContinue = new Phaser.Button(this.game, 75, 400, Sheet.ButtonСontinueGame, this.onButtonClick, this, 1, 2);
                buttonContinue.name = Constants.CONTINUE;
                this.groupButtons.addChild(buttonContinue);

                this.tutorial.setText('Нажмите на кнопку\n"Продолжить"\nчтобы продолжить\n турнир.')
            }
        }

        public initSounds():void{
            // восстановление звука при запуске игры
            this.game.input.onDown.addOnce(() => { 
                this.game.sound.context.resume(); 
            });

            if(GameData.Data.music === undefined || GameData.Data.music === null){
                GameData.Data.music = this.game.add.audio(GameData.Data.musicList[1][0]);
                //GameData.Data.buttonSound = this.game.add.audio(Sounds.ButtonSound);
                //GameData.Data.arrowSound = this.game.add.audio(Sounds.ArrowSound);
                //GameData.Data.flipUpSound = this.game.add.audio(Sounds.CardFlipSound1);
                //GameData.Data.flipDownSound = this.game.add.audio(Sounds.CardFlipSound2);
            }else{
                GameData.Data.music.stop();
                GameData.Data.music.key = GameData.Data.musicList[1][0];
            }
            GameData.Data.music.loop = true;
            GameData.Data.music.volume = GameData.Data.musicList[1][1];
            GameData.Data.music.play();
        }
    }
}