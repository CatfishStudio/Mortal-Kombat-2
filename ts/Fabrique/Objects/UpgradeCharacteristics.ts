module Fabrique {

    export class UpgradeCharacteristics extends Phaser.Group 
    {
        private background:Phaser.Sprite;
        private border:Phaser.Sprite;
        private buttonLegPlus:Phaser.Button;
        private buttonHandPlus:Phaser.Button;
        private buttonBlockPlus:Phaser.Button;
        private buttonUppercutPlus:Phaser.Button;
        private buttonTwistPlus:Phaser.Button;

        private cap1:Phaser.Sprite;
        private textCap1:Phaser.Text;
        private textValueCap1:Phaser.Text;
        private cap2:Phaser.Sprite;
        private textCap2:Phaser.Text;
        private textValueCap2:Phaser.Text;
        private cap3:Phaser.Sprite;
        private textCap3:Phaser.Text;
        private textValueCap3:Phaser.Text;
        private cap4:Phaser.Sprite;
        private textCap4:Phaser.Text;
        private textValueCap4:Phaser.Text;
        private cap5:Phaser.Sprite;
        private textCap5:Phaser.Text;
        private textValueCap5:Phaser.Text;
        private upgradePoints:Phaser.Text;

        private thisIsPersonage:boolean;
        
        constructor(game:Phaser.Game, thisIsPersonage:boolean = true){
            super(game);
            this.thisIsPersonage = thisIsPersonage;
            this.updateTransform();
            this.init();
        }

        private init():void{
            this.background = new Phaser.Sprite(this.game, 0, 0, Images.WindowBackground);
            this.addChild(this.background);

            this.cap1 = new Phaser.Sprite(this.game, 10, 10, Images.capShangTsung);
            this.cap1.scale.x = 0.5;
            this.cap1.scale.y = 0.5;
            this.addChild(this.cap1);
            this.cap2 = new Phaser.Sprite(this.game, 10, 55, Images.capJax);
            this.cap2.scale.x = 0.5;
            this.cap2.scale.y = 0.5;
            this.addChild(this.cap2);
            this.cap3 = new Phaser.Sprite(this.game, 10, 100, Images.capMileena);
            this.cap3.scale.x = 0.5;
            this.cap3.scale.y = 0.5;
            this.addChild(this.cap3);
            this.cap4 = new Phaser.Sprite(this.game, 10, 145, Images.capRaiden);
            this.cap4.scale.x = 0.5;
            this.cap4.scale.y = 0.5;
            this.addChild(this.cap4);
            this.cap5 = new Phaser.Sprite(this.game, 10, 190, Images.capReptile);
            this.cap5.scale.x = 0.5;
            this.cap5.scale.y = 0.5;
            this.addChild(this.cap5);

            this.textCap1 = new Phaser.Text(this.game, 50, 25, "Удар ногой\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textCap1);
            this.textValueCap1 = new Phaser.Text(this.game, 150, 25, Constants.LEG + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textValueCap1);
            this.textCap2 = new Phaser.Text(this.game, 50, 70, "Удар рукой\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textCap2);
            this.textValueCap2 = new Phaser.Text(this.game, 150, 70, Constants.HAND +" x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textValueCap2);
            this.textCap3 = new Phaser.Text(this.game, 50, 115, "Блок\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textCap3);
            this.textValueCap3 = new Phaser.Text(this.game, 150, 115, Constants.BLOCK + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textValueCap3);
            this.textCap4 = new Phaser.Text(this.game, 50, 160, "Апперкот\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textCap4);
            this.textValueCap4 = new Phaser.Text(this.game, 150, 160, Constants.UPPERCUT + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textValueCap4);
            this.textCap5 = new Phaser.Text(this.game, 50, 205, "С разворота\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textCap5);
            this.textValueCap5 = new Phaser.Text(this.game, 150, 205, Constants.TWIST + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.addChild(this.textValueCap5);

            this.upgradePoints = new Phaser.Text(this.game, 50, 230, "Очки улучшений: 0", {font: "12px Arial", fill: "#B7B7B7", align: "left"});
            this.addChild(this.upgradePoints);

            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
            this.addChild(this.border);
        }

        public show(x:number, y:number):void {
            if(this.thisIsPersonage){
                this.textValueCap1.text = Constants.DAMAGE_LEG + " x"+ GameData.Data.user_personage.leg;
                this.textValueCap2.text = Constants.DAMAGE_HAND + " x"+ GameData.Data.user_personage.hand;
                this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x"+ GameData.Data.user_personage.block;
                this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x"+ GameData.Data.user_personage.uppercut;
                this.textValueCap5.text = Constants.DAMAGE_TWIST + " x"+ GameData.Data.user_personage.twist;
                this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();

                if(GameData.Data.user_upgrade_points > 0){
                    this.textValueCap1.x = 125;
                    this.textValueCap2.x = 125;
                    this.textValueCap3.x = 125;
                    this.textValueCap4.x = 125;
                    this.textValueCap5.x = 125;

                    if(GameData.Data.user_personage.leg < Constants.MAX_HIT_LEG){
                        this.buttonLegPlus = new Phaser.Button(this.game, 160, 10, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonLegPlus.name = Constants.LEG;
                        this.addChild(this.buttonLegPlus);
                    }else{
                        this.textValueCap1.text = Constants.DAMAGE_LEG + " x"+ GameData.Data.user_personage.leg + " (макс.)";
                    }
                    
                    if(GameData.Data.user_personage.hand < Constants.MAX_HIT_HAND){
                        this.buttonHandPlus = new Phaser.Button(this.game, 160, 55, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonHandPlus.name = Constants.HAND;
                        this.addChild(this.buttonHandPlus);
                    }else{
                        this.textValueCap2.text = Constants.DAMAGE_HAND + " x"+ GameData.Data.user_personage.hand + " (макс.)";
                    }

                    if(GameData.Data.user_personage.block < Constants.MAX_HIT_BLOCK){
                        this.buttonBlockPlus = new Phaser.Button(this.game, 160, 100, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonBlockPlus.name = Constants.BLOCK;
                        this.addChild(this.buttonBlockPlus);
                    }else{
                        this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x"+ GameData.Data.user_personage.block + " (макс.)";
                    }

                    if(GameData.Data.user_personage.uppercut < Constants.MAX_HIT_UPPERCUT){
                        this.buttonUppercutPlus = new Phaser.Button(this.game, 160, 145, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonUppercutPlus.name = Constants.UPPERCUT;
                        this.addChild(this.buttonUppercutPlus);
                    }else{
                        this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x"+ GameData.Data.user_personage.uppercut + " (макс.)";
                    }

                    if(GameData.Data.user_personage.twist < Constants.MAX_HIT_TWIST){
                        this.buttonTwistPlus = new Phaser.Button(this.game, 160, 190, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonTwistPlus.name = Constants.TWIST;
                        this.addChild(this.buttonTwistPlus);
                    }else{
                        this.textValueCap5.text = Constants.DAMAGE_TWIST + " x"+ GameData.Data.user_personage.twist + " (макс.)";
                    }
                }
            }else{
                this.textValueCap1.text = (Constants.DAMAGE_LEG*GameData.Data.personages[GameData.Data.tournamentProgress].leg).toString();
                this.textValueCap2.text = (Constants.DAMAGE_HAND*GameData.Data.personages[GameData.Data.tournamentProgress].hand).toString();
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK*GameData.Data.personages[GameData.Data.tournamentProgress].block).toString();
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT*GameData.Data.personages[GameData.Data.tournamentProgress].uppercut).toString();
                this.textValueCap5.text = (Constants.DAMAGE_TWIST*GameData.Data.personages[GameData.Data.tournamentProgress].twist).toString();
                this.upgradePoints.text = "";
            }            

            let tween: Phaser.Tween = this.game.add.tween(this);
            tween.to({ x: x, y: y}, 1000, 'Linear');
            tween.start();
        }

        private onButtonClick(event) {
            this.playButtonSound();
            switch (event.name) {
                case Constants.LEG:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.leg++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap1.text = Constants.DAMAGE_LEG + " x"+ GameData.Data.user_personage.leg;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.HAND:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.hand++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap2.text = Constants.DAMAGE_HAND + " x"+ GameData.Data.user_personage.hand;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.BLOCK:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.block++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x"+ GameData.Data.user_personage.block;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.UPPERCUT:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.uppercut++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x"+ GameData.Data.user_personage.uppercut;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.TWIST:
                    {
                        GameData.Data.user_personage.life += 50;
                        GameData.Data.user_personage.twist++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap5.text = Constants.DAMAGE_TWIST + " x"+ GameData.Data.user_personage.twist;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }  
                default:
                    break;
            }
        }

        private playButtonSound():void {
            if(Config.settingSound){
                GameData.Data.iconSound.loop = false;
                GameData.Data.iconSound.volume = 1.0;
                GameData.Data.iconSound.play();
            }
        }

        private removeUpgradeButtons()
        {
            if(GameData.Data.user_upgrade_points == 0){
                this.removeChild(this.buttonLegPlus);
                this.removeChild(this.buttonHandPlus);
                this.removeChild(this.buttonBlockPlus);
                this.removeChild(this.buttonUppercutPlus);
                this.removeChild(this.buttonTwistPlus);

                this.textValueCap1.text = (Constants.DAMAGE_LEG* GameData.Data.user_personage.leg).toString() + " x"+ GameData.Data.user_personage.leg;
                this.textValueCap2.text = (Constants.DAMAGE_HAND*GameData.Data.user_personage.hand).toString() + " x"+ GameData.Data.user_personage.hand;
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK*GameData.Data.user_personage.block).toString() + " x"+ GameData.Data.user_personage.block;
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT*GameData.Data.user_personage.uppercut).toString() + " x"+ GameData.Data.user_personage.uppercut;
                this.textValueCap5.text = (Constants.DAMAGE_TWIST*GameData.Data.user_personage.twist).toString() + " x"+ GameData.Data.user_personage.twist;

                this.textValueCap1.x = 150;
                this.textValueCap2.x = 150;
                this.textValueCap3.x = 150;
                this.textValueCap4.x = 150;
                this.textValueCap5.x = 150;
            }else{
                if(GameData.Data.user_personage.leg == Constants.MAX_HIT_LEG){
                    this.removeChild(this.buttonLegPlus);
                    this.textValueCap1.text = Constants.DAMAGE_LEG + " x"+ GameData.Data.user_personage.leg + " (макс.)";
                }
                
                if(GameData.Data.user_personage.hand == Constants.MAX_HIT_HAND){
                    this.removeChild(this.buttonHandPlus);
                    this.textValueCap2.text = Constants.DAMAGE_HAND + " x"+ GameData.Data.user_personage.hand + " (макс.)";
                }

                if(GameData.Data.user_personage.block == Constants.MAX_HIT_BLOCK){
                    this.removeChild(this.buttonBlockPlus);
                    this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x"+ GameData.Data.user_personage.block + " (макс.)";
                }

                if(GameData.Data.user_personage.uppercut == Constants.MAX_HIT_UPPERCUT){
                    this.removeChild(this.buttonUppercutPlus);
                    this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x"+ GameData.Data.user_personage.uppercut + " (макс.)";
                }

                if(GameData.Data.user_personage.twist == Constants.MAX_HIT_TWIST){
                    this.removeChild(this.buttonTwistPlus);
                    this.textValueCap5.text = Constants.DAMAGE_TWIST + " x"+ GameData.Data.user_personage.twist + " (макс.)";
                }
            }
        }
    }
}