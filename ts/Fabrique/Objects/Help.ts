module Fabrique {

    export class Help extends Phaser.Group {
        public event: Phaser.Signal;

        constructor(game:Phaser.Game, parent:Phaser.Group, text:string){
            super(game, parent);
            this.init(text);
        }

        private init(text:string):void{
            this.event = new Phaser.Signal();
            
            let startX:number = (Constants.GAME_WIDTH / 2) - 310;
            let startY:number = (Constants.GAME_HEIGHT / 2) - 250;
            /* bacground and border */
            let polygon:Phaser.Polygon = new Phaser.Polygon([   
                new Phaser.Point(startX, startY), 
                new Phaser.Point(startX+10, startY-10), 
                new Phaser.Point(startX+600, startY-10), 
                new Phaser.Point(startX+610, startY),  
                new Phaser.Point(startX+610, startY+400),
                new Phaser.Point(startX+600, startY+410),
                new Phaser.Point(startX+10, startY+410),
                new Phaser.Point(startX, startY+400)
            ]);
            let graphicOverlay: Phaser.Graphics = new Phaser.Graphics(this.game, 0, 0);
            graphicOverlay.beginFill(0x000000, 0.5);
            graphicOverlay.drawRect(0, 0, this.game.width, this.game.height);
            graphicOverlay.endFill();
            
            graphicOverlay.beginFill(0x000000, 0.9);
            graphicOverlay.lineStyle(2, 0x777777, 1);
            graphicOverlay.drawPolygon(polygon)
            graphicOverlay.endFill();
            
            graphicOverlay.inputEnabled = true;
            this.addChild(graphicOverlay);

            let labelText:Phaser.Text = new Phaser.Text(this.game, startX+50, startY+35, text, { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelText);

            /* button close */
            let buttonClose = new Phaser.Button(this.game, startX+180, startY+350, Sheet.ButtonClose, this.onButtonCloseClick, this, 1, 2);
            buttonClose.name = Constants.HELP_CLOSE;
            this.addChild(buttonClose);

            this.updateTransform();
        }

        private onButtonCloseClick(event) {
            this.event.dispatch(event);
        }
    }
}