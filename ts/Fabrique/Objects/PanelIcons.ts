module Fabrique {
    export class PanelIcons extends Phaser.Group {

        private icons:Icon[][];
        private winPersonage:WindowPersonage;

        constructor(game:Phaser.Game, parent:any){
            super(game, parent);
            this.updateTransform();
            this.init();
        }

        private init():void{
            this.icons = [
                [
                    new Icon(this.game, 0, 0, Images.LiuKangIcon), 
                    new Icon(this.game, 95, 0, Images.KungLaoIcon), 
                    new Icon(this.game, 190, 0, Images.JohnnyCageIcon), 
                    new Icon(this.game, 285, 0, Images.ReptileIcon)
                ],
                [
                    new Icon(this.game, 0, 125, Images.SubZeroIcon), 
                    new Icon(this.game, 95, 125, Images.ShangTsungIcon), 
                    new Icon(this.game, 190, 125, Images.KitanaIcon), 
                    new Icon(this.game, 285, 125, Images.JaxIcon)
                ],
                [
                    new Icon(this.game, 0, 250, Images.MileenaIcon), 
                    new Icon(this.game, 95, 250, Images.BarakaIcon), 
                    new Icon(this.game, 190, 250, Images.ScorpionIcon), 
                    new Icon(this.game, 285, 250, Images.RaidenIcon)
                ]
            ];
            this.x = -400;
            this.y = 150;
            this.icons.forEach((iconsLine: Icon[]) => {
                iconsLine.forEach((icon: Icon) => {
                    this.addChild(icon);
                });
            });

            this.icons[0][0].select();

            this.winPersonage = new WindowPersonage(this.game, -225, 50);
            this.winPersonage.showPersonage(Atlases.LiukangAnimation, 'liukang_stance_left_to_right_');
            this.addChild(this.winPersonage);
        }

        public show():void{
            let tween:Phaser.Tween = this.game.add.tween(this);
            tween.to({x: 250, y: 150}, 500, 'Linear');
            tween.start();
        }
    }
}