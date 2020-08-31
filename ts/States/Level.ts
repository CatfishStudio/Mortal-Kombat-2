module MortalKombat {
    import AnimationFighter = Fabrique.AnimationFighter;
    import LifeBar = Fabrique.LifeBar;
    import Field = Match3.Field;
    import DamageCounter = Fabrique.DamageCounter;
    import DialodFightWinsDied = Fabrique.DialodFightWinsDied;
    import Tutorial = Fabrique.Tutorial;
    import Settings = Fabrique.Settings;
    import Help = Fabrique.Help;

    export class Level extends Phaser.State{
        public static Name: string = "level";
        public name: string = Tournament.Name;
    
        private groupContent: Phaser.Group;
        private backgroundSprite:Phaser.Sprite;
        private borderSprite:Phaser.Sprite;
        private surrenderButton:Phaser.Button;
        private settingsButton:Phaser.Button;
        private helpButton:Phaser.Button;
        private tutorial:Tutorial;
        private settings:Settings;
        private help:Help;
        private persUser:GameData.IPersonage;
        private animUser:AnimationFighter;
        private damageCounterUser: DamageCounter;
        private persEnemies:GameData.IPersonage;
        private animEnemies:AnimationFighter;
        private damageCounterEnemies: DamageCounter;
        private userLifebar:LifeBar;
        private enemiesLifebar:LifeBar;
        private field:Field;
        private dialog: DialodFightWinsDied;

        constructor() {
            super();
        }

        public create() {
            this.playMusic();

            this.groupContent = new Phaser.Group(this.game, this.stage);

            this.backgroundSprite = new Phaser.Sprite(this.game, 0, 0, GameData.Data.levels[GameData.Data.tournamentProgress][0]);
            this.groupContent.addChild(this.backgroundSprite);

            this.borderSprite = new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage);
            this.groupContent.addChild(this.borderSprite);

            this.surrenderButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonSurrender, this.onButtonClick, this, 1, 2, 2, 2);
            this.surrenderButton.name = Constants.SURRENDER;
            this.groupContent.addChild(this.surrenderButton);

            this.helpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.helpButton.name = Constants.HELP;
            this.groupContent.addChild(this.helpButton);

            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), (Constants.GAME_HEIGHT - 50), Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupContent.addChild(this.settingsButton);

            let valueJSON = this.game.cache.getJSON(GameData.Data.levels[GameData.Data.tournamentProgress][1]);
            this.field = new Field(this.game, this.groupContent);
            this.field.event.add(this.onMatch, this);
            this.field.createMatchField(valueJSON);

            //this.persUser = GameData.Data.user_personage;
            this.persUser = <GameData.IPersonage>{};
            this.persUser.id = GameData.Data.user_personage.id;
            this.persUser.name = GameData.Data.user_personage.name;
            this.persUser.hand = GameData.Data.user_personage.hand;
            this.persUser.leg = GameData.Data.user_personage.leg;
            this.persUser.block = GameData.Data.user_personage.block;
            this.persUser.uppercut = GameData.Data.user_personage.uppercut;
            this.persUser.twist = GameData.Data.user_personage.twist;
            this.persUser.life = GameData.Data.user_personage.life;
            this.persUser.animStance = GameData.Data.user_personage.animStance;
            this.persUser.animHitHand = GameData.Data.user_personage.animHitHand;
            this.persUser.animHitHandUppercut = GameData.Data.user_personage.animHitHandUppercut;
            this.persUser.animHitLeg = GameData.Data.user_personage.animHitLeg;
            this.persUser.animHitLegTwist = GameData.Data.user_personage.animHitLegTwist;
            this.persUser.animBlock = GameData.Data.user_personage.animBlock;
            this.persUser.animDamage = GameData.Data.user_personage.animDamage;
            this.persUser.animLose = GameData.Data.user_personage.animLose;
            this.persUser.animWin = GameData.Data.user_personage.animWin;

            this.animUser = new AnimationFighter(this.game, this.persUser.id, this.persUser, false);
            this.animUser.x = 100 - (this.animUser.width / 2);
            this.animUser.y = Constants.GAME_HEIGHT - (this.animUser.height*2);
            this.animUser.scale.x = 1.5;
            this.animUser.scale.y = 1.5;
            this.groupContent.addChild(this.animUser);

            this.damageCounterUser = new DamageCounter(this.game, this.animUser.x + (this.animUser.width / 2) - 15, this.animUser.y - 15);
            this.groupContent.addChild(this.damageCounterUser);

            this.persEnemies = GameData.Data.getNewPersonage(GameData.Data.id_enemies[GameData.Data.tournamentProgress]);
            this.animEnemies = new AnimationFighter(this.game, this.persEnemies.id, this.persEnemies, false);
            if(GameData.Data.tournamentProgress < 11) {
                this.animEnemies.x = Constants.GAME_WIDTH - 25 - (this.animEnemies.width / 2);
                this.animEnemies.y = Constants.GAME_HEIGHT - (this.animEnemies.height*2);
                this.animEnemies.anchor.setTo(.0, .0);
                this.animEnemies.scale.x = 1.5;
                this.animEnemies.scale.y = 1.5;
                this.animEnemies.scale.x *= -1;
            }else{
                this.animEnemies.x = Constants.GAME_WIDTH - 135 - (this.animEnemies.width / 2);
                this.animEnemies.y = Constants.GAME_HEIGHT - (this.animEnemies.height*2);
                this.animEnemies.anchor.setTo(.0, .0);
                this.animEnemies.scale.x = 1.5;
                this.animEnemies.scale.y = 1.5;
            }
            this.groupContent.addChild(this.animEnemies);

            this.damageCounterEnemies = new DamageCounter(this.game, this.animEnemies.x + (this.animEnemies.width / 2) - 15, this.animEnemies.y - 15);
            this.groupContent.addChild(this.damageCounterEnemies);

            this.userLifebar = new LifeBar(this.game, 45, 35, this.persUser.name, this.persUser.life);
            this.groupContent.addChild(this.userLifebar);

            this.enemiesLifebar = new LifeBar(this.game, 282, 35, this.persEnemies.name, this.persEnemies.life);
            this.groupContent.addChild(this.enemiesLifebar);

            /* tutorial */
            this.tutorial = new Tutorial(this.game, 'Соберите 3-и фишки\nв ряд чтобы\nнанести удар');
            this.tutorial.x = Constants.GAME_WIDTH + 50;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupContent.addChild(this.tutorial);
            if(Config.settingTutorial === true && GameData.Data.tournamentProgress == 0) this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));

            this.dialog = new DialodFightWinsDied(this.game);
            this.dialog.event.add(this.onDialog, this);
            this.groupContent.addChild(this.dialog);
            this.dialog.showFight();
            this.playSoundFight();

            Utilits.Data.debugLog("PERS USER:", this.persUser);
            Utilits.Data.debugLog("PERS ENEMIES:", this.persEnemies);
            Utilits.Data.debugLog("PERSONAGER:", GameData.Data.personages);
        }

        /* Произошло событие match на поле */
        public onMatch(hitType:any, hitCount:number, statusAction:String):void
        {
            //Utilits.Data.debugLog("LEVEL: match |", "type=" + hitType + " | count=" + hitCount + " | status=" + statusAction);
            if(GameData.Data.tournamentProgress == 0 && this.tutorial.x != Constants.GAME_WIDTH) this.tutorial.x = Constants.GAME_WIDTH + 50;
            if(this.field.gameOver === true) return;

            if(hitType === null && hitCount=== null){
                if(statusAction === Field.ACTION_PLAYER){
                    this.animUser.block = false; // сбросить блок игрока
                    this.animUser.changeAnimation(Constants.ANIMATION_TYPE_STANCE);
                }else{
                    this.animEnemies.block = false; // сбросить блок оппонента
                    this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_STANCE);
                }
                this.checkGameOver(); // проверка завершения битвы
            }else{
                this.playUserEnemiesSound(statusAction, hitType);
                if(statusAction === Field.ACTION_PLAYER){ // Противник получает урон
                    let damageValue = GameData.Data.calcDamage(this.persUser, this.animEnemies.block, hitType, hitCount);
                    if(hitType === Constants.HAND)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND);
                    if(hitType === Constants.LEG)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG);
                    if(hitType === Constants.BLOCK)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_BLOCK);
                    if(hitType === Constants.TWIST)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG_TWIST);
                    if(hitType === Constants.UPPERCUT)this.animUser.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT);
                    if(hitType !== Constants.BLOCK) {
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_DAMAGE);
                        this.animEnemies.showBlood();
                        this.damageCounterEnemies.show(damageValue.toString(), this.animEnemies.block);
                    }
                    this.persEnemies.life = this.persEnemies.life - damageValue;
                    this.enemiesLifebar.lifeUpdate(this.persEnemies.life);
                }else{ // Игрок получает урон
                    let damageValue = GameData.Data.calcDamage(this.persEnemies, this.animUser.block, hitType, hitCount);
                    if(hitType === Constants.HAND)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND);
                    if(hitType === Constants.LEG)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG);
                    if(hitType === Constants.BLOCK)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_BLOCK);
                    if(hitType === Constants.TWIST)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_LEG_TWIST);
                    if(hitType === Constants.UPPERCUT)this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_HIT_HAND_UPPERCUT);
                    if(hitType !== Constants.BLOCK) {
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_DAMAGE);
                        this.animUser.showBlood();
                        this.damageCounterUser.show(damageValue.toString(), this.animUser.block);
                    }
                    this.persUser.life = this.persUser.life - damageValue;
                    this.userLifebar.lifeUpdate(this.persUser.life);
                }
            }
        }

        public shutdown(){
            this.field.shutdown();
            this.groupContent.removeChild(this.backgroundSprite);
            this.backgroundSprite.destroy();
            this.groupContent.removeChild(this.borderSprite);
            this.borderSprite.destroy();
            this.groupContent.removeChild(this.surrenderButton);
            this.surrenderButton.destroy();
            this.groupContent.removeChild(this.helpButton);
            this.helpButton.destroy();
            this.groupContent.removeChild(this.settingsButton);
            this.settingsButton.destroy();
            this.groupContent.removeChild(this.animUser);
            this.animUser.destroy();
            this.groupContent.removeChild(this.damageCounterUser);
            this.damageCounterUser.destroy();
            this.groupContent.removeChild(this.animEnemies);
            this.animEnemies.destroy();
            this.groupContent.removeChild(this.damageCounterEnemies);
            this.damageCounterEnemies.destroy();
            this.groupContent.removeChild(this.userLifebar);
            this.userLifebar.destroy();
            this.groupContent.removeChild(this.enemiesLifebar);
            this.enemiesLifebar.destroy();
            this.groupContent.removeChild(this.tutorial);
            this.tutorial.destroy();
            this.groupContent.removeChild(this.dialog);
            this.dialog.destroy();
            this.groupContent.removeChildren();
            this.groupContent.removeAll();
            this.groupContent.destroy();
            this.game.stage.removeChildren();
        }

        private onButtonClick(event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.SURRENDER:
                    {
                        this.field.isGameOver();
                        this.animUser.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                        this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                        this.dialog.showDied();
                        this.playSoundLost();
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.field.timerPause(true);
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.field.timerPause(false);
                        this.settingsClose();
                        break;
                    }
                case Constants.HELP:
                    {
                        this.field.timerPause(true);
                        this.helpCreate();
                        break;
                    }  
                case Constants.HELP_CLOSE:
                    {
                        this.field.timerPause(false);
                        this.helpClose();
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
            
            this.settings = new Settings(this.game, this.groupContent);
            this.settings.event.add(this.onButtonClick.bind(this));
        }

        private settingsClose() {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupContent.removeChild(this.settings);
            
            if(Config.settingTutorial === true && GameData.Data.tournamentProgress == 0){
                let tweenTutorial: Phaser.Tween = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175)}, 500, 'Linear');
                tweenTutorial.start();
            }
        }

        private checkGameOver():void {
            Utilits.Data.debugLog("LIFE:", "User = " + this.persUser.life + " | Enemies = " + this.persEnemies.life);
            if(this.persUser.life > 0 && this.persEnemies.life <= 0){ // Пользователь - победил
                this.field.isGameOver();
                this.animUser.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                this.dialog.showWins();
                this.playSoundWin();
            }else if(this.persUser.life <= 0 && this.persEnemies.life > 0){ // Оппонент - победил
                this.field.isGameOver();
                this.animUser.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                this.dialog.showDied();
                this.playSoundLost();
            }else if(this.persUser.life <= 0 && this.persEnemies.life <= 0){ // Ничья
                this.field.isGameOver();
                this.animUser.changeAnimation(Constants.ANIMATION_TYPE_WIN);
                this.animEnemies.changeAnimation(Constants.ANIMATION_TYPE_LOSE);
                this.dialog.showWins();
                this.playSoundWin();
            }else{ // бой продолжается

            }
        }

        private onDialog(event:any):void {
            //Utilits.Data.debugLog("DIALOG EVENT:", event);
            if(event === DialodFightWinsDied.WINS){
                if(this.persEnemies.id === Constants.ID_GORO) GameData.Data.user_upgrade_points += 1;
                else GameData.Data.user_upgrade_points += 1;
                GameData.Data.tournamentProgress++;
                SocialVK.vkWallPost();
            }else{
                GameData.Data.user_continue--;
            }
            GameData.Data.saveData = SocialVK.vkSaveData();
            if(GameData.Data.user_continue <= 0) this.game.state.start(GameOver.Name, true, false); 
            else if(GameData.Data.tournamentProgress > 12) this.game.state.start(GameOver.Name, true, false); 
            else this.game.state.start(Tournament.Name, true, false);
            this.playMenuMusic();
        }

        private helpCreate() {
            this.help = new Help(this.game, this.groupContent, "- Чтобы победить противника у него должа закончиться жизнь.\n\n- Чтобы нанести удар противнику вы должны собрать на поле\nв ряд 3-и и более фишек.\n\n- Удары наносятся по очереди, сначала вы потом ваш оппонент.\n\n- На принятие решения у вас есть 10-ть секунд, после чего\nход переходит к противнику.\n\n- Кнопка \"Сдаться\" завершает битву и вам будет засчитано\n поражение в битве.");
            this.help.event.add(this.onButtonClick.bind(this));
        }

        private helpClose() {
            this.help.removeChildren();
            this.help.removeAll();
            this.groupContent.removeChild(this.help);
        }

        private playSoundFight():void {
            if(Config.settingSound){
                GameData.Data.voiceSound.key = Sounds.fight;
                GameData.Data.voiceSound.loop = false;
                GameData.Data.voiceSound.volume = 1.0;
                GameData.Data.voiceSound.play();
            }
        }

        private playSoundLost():void {
            if(Config.settingSound){
                GameData.Data.voiceSound.key = Sounds.lost;
                GameData.Data.voiceSound.loop = false;
                GameData.Data.voiceSound.volume = 1.0;
                GameData.Data.voiceSound.play();
            }
        }

        private playSoundWin():void {
            if(Config.settingSound){
                GameData.Data.voiceSound.key = Sounds.wins;
                GameData.Data.voiceSound.loop = false;
                GameData.Data.voiceSound.volume = 1.0;
                GameData.Data.voiceSound.play();
            }
        }

        private playMusic():void {
            GameData.Data.music.stop();
            GameData.Data.music.key = GameData.Data.musicList[GameData.Data.musicSelected][0];
            GameData.Data.music.loop = true;
            GameData.Data.music.volume = GameData.Data.musicList[GameData.Data.musicSelected][1];
            if(Config.settingMusic) GameData.Data.music.play();
            if(GameData.Data.musicSelected === 1) GameData.Data.musicSelected = 2;
            else GameData.Data.musicSelected = 1;
        }

        private playMenuMusic():void {
            GameData.Data.music.stop();
            GameData.Data.music.key = GameData.Data.musicList[0][0];
            GameData.Data.music.loop = true;
            GameData.Data.music.volume = GameData.Data.musicList[0][1];
            if(Config.settingMusic) GameData.Data.music.play();
        }

        private playUserEnemiesSound(statusAction, hitType):void {
            GameData.Data.userSound.loop = false;
            GameData.Data.userSound.volume = 1.0;
            GameData.Data.enemieSound.loop = false;
            GameData.Data.enemieSound.volume = 1.0;
            if(statusAction === Field.ACTION_PLAYER){ // Противник получает урон
                if(hitType === Constants.HAND) GameData.Data.userSound.key = Sounds.hit_2_4;
                if(hitType === Constants.LEG) GameData.Data.userSound.key = Sounds.hit_1_5;
                if(hitType === Constants.TWIST) GameData.Data.userSound.key = Sounds.hit_1_5;
                if(hitType === Constants.UPPERCUT) GameData.Data.userSound.key = Sounds.hit_2_4;
                
                if(hitType === Constants.BLOCK) {
                    GameData.Data.enemieSound.key = Sounds.hit_block;
                    if(Config.settingSound) {
                        GameData.Data.enemieSound.play();
                    }
                }
                else {
                    if(this.persEnemies.id === Constants.ID_KITANA || this.persEnemies.id === Constants.ID_MILEENA) GameData.Data.enemieSound.key = Sounds.f_d_03;
                    else GameData.Data.enemieSound.key = Sounds.m_d_03;

                    if(Config.settingSound) {
                        GameData.Data.userSound.play();
                        if(this.animEnemies.block === false) GameData.Data.enemieSound.play();
                    }
                }
            }else{ // Игрок получает урон
                if(hitType === Constants.HAND) GameData.Data.enemieSound.key = Sounds.hit_2_4;
                if(hitType === Constants.LEG) GameData.Data.enemieSound.key = Sounds.hit_1_5;
                if(hitType === Constants.TWIST) GameData.Data.enemieSound.key = Sounds.hit_1_5;
                if(hitType === Constants.UPPERCUT) GameData.Data.enemieSound.key = Sounds.hit_2_4;
                
                if(hitType === Constants.BLOCK) {
                    GameData.Data.userSound.key = Sounds.hit_block;
                    if(Config.settingSound) {
                        GameData.Data.userSound.play();
                    }
                }
                else { 
                    if(this.persUser.id === Constants.ID_KITANA || this.persUser.id === Constants.ID_MILEENA) GameData.Data.userSound.key = Sounds.f_d_03;
                    else GameData.Data.userSound.key = Sounds.m_d_03;

                    if(Config.settingSound) {
                        GameData.Data.enemieSound.play();
                        if(this.animUser.block === false) GameData.Data.userSound.play();
                    }
                }
            }
            
        }
    }
}