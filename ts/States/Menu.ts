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

        private buttonContinue:Phaser.Button;
        private buttonStart:Phaser.Button;
        private buttonSettings:Phaser.Button;
        private buttonInvite:Phaser.Button; 
        
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

        public initSounds():void{
            // восстановление звука при запуске игры
            this.game.input.onDown.addOnce(() => { 
                this.game.sound.context.resume(); 
            });

            if(GameData.Data.music === undefined || GameData.Data.music === null){
                GameData.Data.music = this.game.add.audio(GameData.Data.musicList[0][0]);
                GameData.Data.buttonSound = this.game.add.audio(Sounds.button);
                GameData.Data.iconSound = this.game.add.audio(Sounds.hit_move);
                GameData.Data.voiceSound = this.game.add.audio(Sounds.fight);
                GameData.Data.userSound = this.game.add.audio(Sounds.hit_block);
                GameData.Data.enemieSound = this.game.add.audio(Sounds.hit_block);
            }else{
                GameData.Data.music.stop();
                GameData.Data.music.key = GameData.Data.musicList[0][0];
            }
            GameData.Data.music.loop = true;
            GameData.Data.music.volume = GameData.Data.musicList[0][1];
            if(Config.settingMusic) GameData.Data.music.play();
        }

        private createButtons():void{
            this.groupButtons = new Phaser.Group(this.game, this.groupMenu);
            this.groupButtons.x = -500;
            this.groupButtons.y = 0;
            this.groupButtons.visible = false;

            this.groupButtons.addChild(new Phaser.Sprite(this.game, 35, 80, Images.LogoImage));
            
            this.buttonStart = new Phaser.Button(this.game, 75, 400, Sheet.ButtonStartNewGame, this.onButtonClick, this, 1, 2);
            this.buttonStart.name = Constants.START;
            this.groupButtons.addChild(this.buttonStart);
            
            this.buttonSettings = new Phaser.Button(this.game, 75, 475, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.buttonSettings.name = Constants.SETTINGS;
            this.groupButtons.addChild(this.buttonSettings);
            
            this.buttonInvite = new Phaser.Button(this.game, 75, 550, Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
            this.buttonInvite.name = Constants.INVITE;
            this.groupButtons.addChild(this.buttonInvite);

            if(GameData.Data.saveData !== undefined){
                SocialVK.LoadData(GameData.Data.saveData);
                this.buttonContinue = new Phaser.Button(this.game, 75, 400, Sheet.ButtonСontinueGame, this.onButtonClick, this, 1, 2);
                this.buttonContinue.name = Constants.CONTINUE;
                this.groupButtons.addChild(this.buttonContinue);
                this.buttonStart.x = 75;
                this.buttonStart.y = 475;
                this.buttonSettings.x = 75;
                this.buttonSettings.y = 550;
                this.buttonInvite.x = 75;
                this.buttonInvite.y = 625;
            }else{
                SocialVK.vkLoadData(this.onVkDataGet.bind(this));
            }  

            this.tutorial = new Tutorial(this.game, 'Сразись с бойцами\nШао Кана. Победи его\nна турнире чтобы спасти\nземное царство.');
            if(GameData.Data.saveData !== undefined) this.tutorial.setText('Продолжайте битву\nна турнире.\nПобеди Шао Кана.\nСпаси земное царство.');
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupMenu.addChild(this.tutorial);
        }

        private onVkDataGet(object: any):void {
            //console.log(object);
            try{
                if(SocialVK.LoadData(object.response.toString()) === true){
                    this.buttonContinue = new Phaser.Button(this.game, 75, 400, Sheet.ButtonСontinueGame, this.onButtonClick, this, 1, 2);
                    this.buttonContinue.name = Constants.CONTINUE;
                    this.groupButtons.addChild(this.buttonContinue);
                    this.buttonStart.x = 75;
                    this.buttonStart.y = 475;
                    this.buttonSettings.x = 75;
                    this.buttonSettings.y = 550;
                    this.buttonInvite.x = 75;
                    this.buttonInvite.y = 625;
                }
            }catch (e){
                console.log(e);
            }
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
                if(Config.settingTutorial === true) this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));
            }, this);
            tweenButtons.start();
        }

        private onTweenComplete(event:any):void {
            this.tween.start();
        }

        
        private onButtonClick(event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.START:
                    {
                        GameData.Data.initPersonages(this.game);
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
                        SocialVK.vkInvite();
                        break;
                    }                
                default:
                    break;
            }
        }

        private playButtonSound():void {
            if(Config.settingSound){
                GameData.Data.buttonSound.loop = false;
                GameData.Data.buttonSound.volume = 0.5;
                GameData.Data.buttonSound.play();
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
            
            if(Config.settingTutorial === true){
                let tweenTutorial: Phaser.Tween = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175)}, 500, 'Linear');
                tweenTutorial.start();
            }
        }

    }
}