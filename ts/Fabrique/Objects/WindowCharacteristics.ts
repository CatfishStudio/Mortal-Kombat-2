module Fabrique {

    export class WindowCharacteristics extends Phaser.Sprite {
        private border:Phaser.Sprite;
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

        constructor(game:Phaser.Game, x:number, y:number){
            super(game, x, y, Images.WindowBackground2);
            this.init();
        }

        private init():void{
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder2);
            this.cap1 = new Phaser.Sprite(this.game, 15, 20, Images.capShangTsung);
            this.cap1.scale.x = 0.8;
            this.cap1.scale.y = 0.8;
            this.cap2 = new Phaser.Sprite(this.game, 90, 20, Images.capJax);
            this.cap2.scale.x = 0.8;
            this.cap2.scale.y = 0.8;
            this.cap3 = new Phaser.Sprite(this.game, 165, 20, Images.capMileena);
            this.cap3.scale.x = 0.8;
            this.cap3.scale.y = 0.8;
            this.cap4 = new Phaser.Sprite(this.game, 240, 20, Images.capRaiden);
            this.cap4.scale.x = 0.8;
            this.cap4.scale.y = 0.8;
            this.cap5 = new Phaser.Sprite(this.game, 315, 20, Images.capReptile);
            this.cap5.scale.x = 0.8;
            this.cap5.scale.y = 0.8;

            this.textCap1 = new Phaser.Text(this.game, 15, 90, "Удар ногой\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap1 = new Phaser.Text(this.game, 35, 105, Constants.LEG + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap2 = new Phaser.Text(this.game, 90, 90, "Удар рукой\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap2 = new Phaser.Text(this.game, 90, 105, Constants.HAND +" x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap3 = new Phaser.Text(this.game, 185, 90, "Блок\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap3 = new Phaser.Text(this.game, 185, 105, Constants.BLOCK + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap4 = new Phaser.Text(this.game, 245, 90, "Апперкот\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap4 = new Phaser.Text(this.game, 245, 105, Constants.UPPERCUT + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap5 = new Phaser.Text(this.game, 315, 90, "С разворота\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap5 = new Phaser.Text(this.game, 315, 105, Constants.TWIST + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});

            this.addChild(this.cap1);
            this.addChild(this.textCap1);
            this.addChild(this.textValueCap1);
            this.addChild(this.cap2);
            this.addChild(this.textCap2);
            this.addChild(this.textValueCap2);
            this.addChild(this.cap3);
            this.addChild(this.textCap3);
            this.addChild(this.textValueCap3);
            this.addChild(this.cap4);
            this.addChild(this.textCap4);
            this.addChild(this.textValueCap4);
            this.addChild(this.cap5);
            this.addChild(this.textCap5);
            this.addChild(this.textValueCap5);
            this.addChild(this.border);
        }

        public showCharacteristics(personageID:string):void{
            GameData.Data.personages.forEach((personage: GameData.IPersonage) => {
                if(personage.id === personageID){
                    this.textValueCap1.text = Constants.LEG + " x " + personage.leg;
                    this.textValueCap2.text = Constants.HAND + " x " + personage.hand;
                    this.textValueCap3.text = Constants.BLOCK + " x " + personage.block;
                    this.textValueCap4.text = Constants.UPPERCUT + " x " + personage.uppercut;
                    this.textValueCap5.text = Constants.TWIST + " x " + personage.twist;
                    return;
                }
            });
        }
    }
}