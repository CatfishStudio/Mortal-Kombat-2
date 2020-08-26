module Fabrique {

    export class Settings extends Phaser.Group {
        public event: Phaser.Signal;

        constructor(game:Phaser.Game, parent:Phaser.Group){
            super(game, parent);
            this.init();
        }

        private init():void{
            this.event = new Phaser.Signal();
            
            let startX:number = (Constants.GAME_WIDTH / 2) - 150;
            let startY:number = (Constants.GAME_HEIGHT / 2) - 150;
            /* bacground and border */
            let polygon:Phaser.Polygon = new Phaser.Polygon([   
                new Phaser.Point(startX, startY), 
                new Phaser.Point(startX+10, startY-10), 
                new Phaser.Point(startX+300, startY-10), 
                new Phaser.Point(startX+310, startY),  
                new Phaser.Point(startX+310, startY+200),
                new Phaser.Point(startX+300, startY+210),
                new Phaser.Point(startX+10, startY+210),
                new Phaser.Point(startX, startY+200)
            ]);
            let graphicOverlay: Phaser.Graphics = new Phaser.Graphics(this.game, 0, 0);
            graphicOverlay.beginFill(0x000000, 0.5);
            graphicOverlay.drawRect(0, 0, this.game.width, this.game.height);
            graphicOverlay.endFill();
            
            graphicOverlay.beginFill(0x000000, 0.8);
            graphicOverlay.lineStyle(2, 0x777777, 1);
            graphicOverlay.drawPolygon(polygon)
            graphicOverlay.endFill();
            
            graphicOverlay.inputEnabled = true;
            this.addChild(graphicOverlay);

            /* title */
            let title:Phaser.Text = new Phaser.Text(this.game, startX+35, startY+5, "НАСТРОЙКИ ИГРЫ", { font: "24px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(title);

            /* sound */
            let buttonSound:Phaser.Button;
            if(Config.settingSound === true) buttonSound = new Phaser.Button(this.game, startX+25, startY+50, Images.ButtonOn, this.onButtonClick, this);
            else buttonSound = new Phaser.Button(this.game, startX+25, startY+50, Images.ButtonOff, this.onButtonClick, this);
            buttonSound.name = Constants.SOUND;
            this.addChild(buttonSound);

            let labelSound:Phaser.Text = new Phaser.Text(this.game, startX+90, startY+55, "Звук", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelSound);

            /* music */
            let buttonMusic:Phaser.Button;
            if(Config.settingMusic === true) buttonMusic = new Phaser.Button(this.game, startX+155, startY+50, Images.ButtonOn, this.onButtonClick, this);
            else buttonMusic = new Phaser.Button(this.game, startX+155, startY+50, Images.ButtonOff, this.onButtonClick, this);
            buttonMusic.name = Constants.MUSIC;
            this.addChild(buttonMusic);

            let labelMusic:Phaser.Text = new Phaser.Text(this.game, startX+220, startY+55, "Музыка", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelMusic);

            /* tutorial */
            let buttonTutorial:Phaser.Button;
            if(Config.settingTutorial === true) buttonTutorial = new Phaser.Button(this.game, startX+25, startY+100, Images.ButtonOn, this.onButtonClick, this);
            else buttonTutorial = new Phaser.Button(this.game, startX+25, startY+100, Images.ButtonOff, this.onButtonClick, this);
            buttonTutorial.name = Constants.TUTORIAL;
            this.addChild(buttonTutorial);

            let labelTutorial:Phaser.Text = new Phaser.Text(this.game, startX+90, startY+105, "Обучение в игре", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelTutorial);
            
            /* button close */
            let buttonClose = new Phaser.Button(this.game, startX+25, startY+150, Sheet.ButtonClose, this.onButtonCloseClick, this, 1, 2);
            buttonClose.name = Constants.SETTINGS_CLOSE;
            this.addChild(buttonClose);

            this.updateTransform();
        }

         private onButtonCloseClick(event) {
            this.playButtonSound();
            this.event.dispatch(event);
            this.removeAll();
         }

         private onButtonClick(event) {
            this.playButtonSound();
             switch (event.name) {
                case Constants.SOUND:
                    {
                        if(Config.settingSound === true){
                            Config.settingSound = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.SOUND;
                            this.addChild(event);
                        }else{
                            Config.settingSound = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.SOUND;
                            this.addChild(event);
                        }
                        break;
                    }
                case Constants.MUSIC:
                    {
                        if(Config.settingMusic === true){
                            this.stopMusic();
                            Config.settingMusic = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.MUSIC;
                            this.addChild(event);
                        }else{
                            this.playMusic();
                            Config.settingMusic = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.MUSIC;
                            this.addChild(event);
                        }
                        break;
                    }
                case Constants.TUTORIAL:
                    {
                        if(Config.settingTutorial === true){
                            Config.settingTutorial = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.TUTORIAL;
                            this.addChild(event);
                        }else{
                            Config.settingTutorial = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.TUTORIAL;
                            this.addChild(event);
                        }
                        break;
                    }
                default:
                    break;
            }
        }

        private stopMusic():void {
            GameData.Data.music.stop();
        }

        private playMusic():void {
            GameData.Data.music.play();
        }

        private playButtonSound():void {
            if(Config.settingSound){
                GameData.Data.buttonSound.loop = false;
                GameData.Data.buttonSound.volume = 0.5;
                GameData.Data.buttonSound.play();
            }
        }
    }
}