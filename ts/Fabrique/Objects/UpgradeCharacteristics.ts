module Fabrique {

    export class UpgradeCharacteristics extends Phaser.Group 
    {
        private background:Phaser.Sprite;
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
        
        constructor(game:Phaser.Game){
            super(game);
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

            this.textCap1 = new Phaser.Text(this.game, 15, 110, "Удар ногой\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textValueCap1 = new Phaser.Text(this.game, 40, 125, Constants.LEG + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textCap2 = new Phaser.Text(this.game, 90, 110, "Удар рукой\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textValueCap2 = new Phaser.Text(this.game, 115, 125, Constants.HAND +" x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textCap3 = new Phaser.Text(this.game, 185, 110, "Блок\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textValueCap3 = new Phaser.Text(this.game, 195, 125, Constants.BLOCK + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textCap4 = new Phaser.Text(this.game, 245, 110, "Апперкот\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textValueCap4 = new Phaser.Text(this.game, 265, 125, Constants.UPPERCUT + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textCap5 = new Phaser.Text(this.game, 315, 110, "С разворота\n", {font: "12px Arial", fill: "#C4C4C4", align: "left"});
            this.textValueCap5 = new Phaser.Text(this.game, 345, 125, Constants.TWIST + " x", {font: "12px Arial", fill: "#C4C4C4", align: "left"});

            this.namePersonage = new Phaser.Text(this.game, 50, 15, "", {font: "22px Georgia", fill: "#B7B7B7", align: "left"});
            
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
            this.addChild(this.border);
        }

        public show(x:number, y:number):void {
            let tween: Phaser.Tween = this.game.add.tween(this);
            tween.to({ x: x, y: y}, 1000, 'Linear');
            tween.start();
        }
    }
}