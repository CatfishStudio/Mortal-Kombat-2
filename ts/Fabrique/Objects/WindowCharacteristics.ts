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
        private namePersonage:Phaser.Text;

        constructor(game:Phaser.Game, x:number, y:number){
            super(game, x, y, Images.WindowBackground2);
            this.init();
        }

        private init():void{
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder2);
            this.cap1 = new Phaser.Sprite(this.game, 15, 45, Images.capShangTsung);
            this.cap1.scale.x = 0.8;
            this.cap1.scale.y = 0.8;
            this.cap2 = new Phaser.Sprite(this.game, 90, 45, Images.capJax);
            this.cap2.scale.x = 0.8;
            this.cap2.scale.y = 0.8;
            this.cap3 = new Phaser.Sprite(this.game, 165, 45, Images.capMileena);
            this.cap3.scale.x = 0.8;
            this.cap3.scale.y = 0.8;
            this.cap4 = new Phaser.Sprite(this.game, 240, 45, Images.capRaiden);
            this.cap4.scale.x = 0.8;
            this.cap4.scale.y = 0.8;
            this.cap5 = new Phaser.Sprite(this.game, 315, 45, Images.capReptile);
            this.cap5.scale.x = 0.8;
            this.cap5.scale.y = 0.8;

            this.textCap1 = new Phaser.Text(this.game, 15, 110, "Удар ногой\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap1 = new Phaser.Text(this.game, 40, 125, Constants.LEG + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap2 = new Phaser.Text(this.game, 90, 110, "Удар рукой\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap2 = new Phaser.Text(this.game, 115, 125, Constants.HAND +" x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap3 = new Phaser.Text(this.game, 185, 110, "Блок\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap3 = new Phaser.Text(this.game, 195, 125, Constants.BLOCK + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap4 = new Phaser.Text(this.game, 245, 110, "Апперкот\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap4 = new Phaser.Text(this.game, 265, 125, Constants.UPPERCUT + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textCap5 = new Phaser.Text(this.game, 315, 110, "С разворота\n", {font: "12px Arial", fill: "#FFFFFF", align: "left"});
            this.textValueCap5 = new Phaser.Text(this.game, 345, 125, Constants.TWIST + " x", {font: "12px Arial", fill: "#FFFFFF", align: "left"});

            this.namePersonage = new Phaser.Text(this.game, 50, 15, "", {font: "22px Georgia", fill: "#FFFFFF", align: "left"});

            this.addChild(this.namePersonage);
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
                    /*
                    this.textValueCap1.text = (Constants.LEG*personage.leg)+" ["+Constants.LEG+" x "+personage.leg+"]";
                    this.textValueCap2.text = (Constants.HAND*personage.hand)+" ["+Constants.HAND+" x "+personage.hand+"]";
                    this.textValueCap3.text = (Constants.BLOCK*personage.block)+"["+Constants.BLOCK+" x "+personage.block+"]";
                    this.textValueCap4.text = (Constants.UPPERCUT*personage.uppercut)+"["+Constants.UPPERCUT+" x "+personage.uppercut+"]";
                    this.textValueCap5.text = (Constants.TWIST*personage.twist)+"["+Constants.TWIST+" x "+personage.twist+"]";
                    */
                    this.namePersonage.text = personage.name;
                    this.namePersonage.x = (400 / 2) - (this.namePersonage.text.length * 5);
                    this.textValueCap1.text = (Constants.LEG*personage.leg).toString();
                    this.textValueCap2.text = (Constants.HAND*personage.hand).toString();
                    this.textValueCap3.text = (Constants.BLOCK*personage.block).toString();
                    this.textValueCap4.text = (Constants.UPPERCUT*personage.uppercut).toString();
                    this.textValueCap5.text = (Constants.TWIST*personage.twist).toString();
                    return;
                }
            });
        }
    }
}