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

            this.closeButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - 255 - 50, (Constants.GAME_HEIGHT - 50), Sheet.ButtonClose, this.onButtonClick, this, 1, 2, 2, 2);
            this.closeButton.name = Constants.CLOSE;
            this.inviteButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) + 50, (Constants.GAME_HEIGHT - 50), Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
            this.inviteButton.name = Constants.INVITE;

            if(GameData.Data.tournamentProgress <= 12) {
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_lose));
                this.messageText = this.game.add.text(400, 100, 'Вы проиграли!\nУ вас не осталось попыток.\nВы можете начать игру заново, \nили получить 1-ну дополнительную попытку\nза приглашение друга в игру.', { font: "18px Georgia", fill: "#AAAAAA", align: "left" });
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
                this.groupContent.addChild(this.messageText);
                this.groupContent.addChild(this.closeButton);            
                this.groupContent.addChild(this.inviteButton);
            } else { 
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_win));
                this.messageText = this.game.add.text(55, 500, 'Вы победили!\nВам удалось спасти\nземное царство от вторжения.', { font: "18px Georgia", fill: "#DDDDDD", align: "left" });
                this.closeButton.x = (Constants.GAME_WIDTH / 2) - (255 / 2);
                this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
                this.groupContent.addChild(this.messageText);
                this.groupContent.addChild(this.closeButton); 
            }
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
                        if(GameData.Data.tournamentProgress > 12) SocialVK.vkWallPostWin();
                        this.game.state.start(Menu.Name, true, false);
                        break;
                    }
                case Constants.INVITE:
                    {
                        SocialVK.vkInvite();
                        GameData.Data.user_continue += 1;
                        this.game.state.start(Tournament.Name, true, false);
                        break;
                    }
                default:
                    break;
            }
        }
    }
}