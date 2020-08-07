module MortalKombat {
    export class GameOver extends Phaser.State{
        public static Name: string = "gameover";
        public name: string = GameOver.Name;

        private messageText: Phaser.Text;
        private groupContent: Phaser.Group;
        private closeButton:Phaser.Button;
        private inviteButton:Phaser.Button;
        
        constructor() {
            super();
        }

        public create() {
            this.groupContent = new Phaser.Group(this.game, this.stage);
            if(GameData.Data.tournamentProgress <= 0) {
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_lose));
                this.messageText = this.game.add.text(400, 100, 'Вы проиграли!\nУ вас не осталось попыток.\nВы можете начать игру заново, \nили получить 1 дополнительную попытку\nза приглашение друга в игру.', { font: "18px Georgia", fill: "#AAAAAA", align: "left" });
            } else { 
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_win));
                this.messageText = this.game.add.text(400, 100, '', { font: "18px Georgia", fill: "#AAAAAA", align: "left" });
            }
            this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
            this.groupContent.addChild(this.messageText);

            this.closeButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - 255 - 50, (Constants.GAME_HEIGHT - 50), Sheet.ButtonClose, this.onButtonClick, this, 1, 2, 2, 2);
            this.closeButton.name = Constants.CLOSE;
            this.groupContent.addChild(this.closeButton);

            this.inviteButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) + 50, (Constants.GAME_HEIGHT - 50), Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
            this.inviteButton.name = Constants.INVITE;
            this.groupContent.addChild(this.inviteButton);
        }

        public shutdown(){
            this.groupContent.removeChildren();
            this.groupContent.removeAll();
            this.groupContent.destroy();
            this.messageText.destroy();
            this.closeButton.destroy();
            this.inviteButton.destroy();
            this.game.stage.removeChildren();
        }

        private onButtonClick(event) {
            switch (event.name) {
                case Constants.CLOSE:
                    {
                        this.game.state.start(Menu.Name, true, false);
                        break;
                    }
                case Constants.INVITE:
                    {
                        
                        break;
                    }
                default:
                    break;
            }
        }
    }
}