module Fabrique {
    export class PanelIcons extends Phaser.Group {

        private icons:Icon[][];
        private windowPersonage:WindowPersonage;
        private windowCharacteristics:WindowCharacteristics;
        private defaultFighterID:string = Constants.ID_LIUKANG;

        constructor(game:Phaser.Game, parent:any){
            super(game, parent);
            this.updateTransform();
            this.init();
        }

        private init():void{
            this.icons = [
                [
                    new Icon(this.game, 0, 0, Images.LiuKangIcon, Constants.ID_LIUKANG), 
                    new Icon(this.game, 95, 0, Images.KungLaoIcon, Constants.ID_KUNGLAO), 
                    new Icon(this.game, 190, 0, Images.JohnnyCageIcon, Constants.ID_JOHNYCAGE), 
                    new Icon(this.game, 285, 0, Images.ReptileIcon, Constants.ID_REPTILE)
                ],
                [
                    new Icon(this.game, 0, 125, Images.SubZeroIcon, Constants.ID_SUBZERO), 
                    new Icon(this.game, 95, 125, Images.ShangTsungIcon, Constants.ID_SHANGTSUNG), 
                    new Icon(this.game, 190, 125, Images.KitanaIcon, Constants.ID_KITANA), 
                    new Icon(this.game, 285, 125, Images.JaxIcon, Constants.ID_JAX)
                ],
                [
                    new Icon(this.game, 0, 250, Images.MileenaIcon, Constants.ID_MILEENA), 
                    new Icon(this.game, 95, 250, Images.BarakaIcon, Constants.ID_BARAKA), 
                    new Icon(this.game, 190, 250, Images.ScorpionIcon, Constants.ID_SCORPION), 
                    new Icon(this.game, 285, 250, Images.RaidenIcon, Constants.ID_RAIDEN)
                ]
            ];

            this.x = -400;
            this.y = 150;
            this.icons.forEach((iconsLine: Icon[]) => {
                iconsLine.forEach((icon: Icon) => {
                    icon.event.add(this.onChange, this);
                    this.addChild(icon);
                });
            });

            this.icons[0][0].select();

            this.windowPersonage = new WindowPersonage(this.game, -225, 122);
            this.windowPersonage.showPersonage(this.defaultFighterID);
            this.addChild(this.windowPersonage);

            this.windowCharacteristics = new WindowCharacteristics(this.game, -225, 375);
            this.windowCharacteristics.showCharacteristics(this.defaultFighterID);
            this.addChild(this.windowCharacteristics);

            GameData.Data.user_personage = GameData.Data.getNewPersonage(this.defaultFighterID);
        }

        private onChange(target, id): void {
            //Utilits.Data.debugLog('Change [target/type]:', [target, id]);
            this.playIconSound();

            this.icons.forEach((iconsLine: Icon[]) => {
                iconsLine.forEach((icon: Icon) => {
                    icon.unselect();
                    if(icon.id === id) icon.select()
                });
            });

            this.windowPersonage.changePersonage(id);
            this.windowCharacteristics.showCharacteristics(id);
            GameData.Data.user_personage = GameData.Data.getPersonage(id);
        }

        public show():void{
            let tween:Phaser.Tween = this.game.add.tween(this);
            tween.to({x: 245, y: 150}, 500, 'Linear');
            tween.start();
        }

        private playIconSound():void {
            if(Config.settingSound){
                GameData.Data.iconSound.loop = false;
                GameData.Data.iconSound.volume = 1.0;
                GameData.Data.iconSound.play();
            }
        }
    }
}