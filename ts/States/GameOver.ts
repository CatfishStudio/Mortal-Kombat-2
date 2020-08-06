module MortalKombat {
    export class GameOver extends Phaser.State{
        public static Name: string = "gameover";
        public name: string = GameOver.Name;

        private messageText: Phaser.Text;
        private groupContent: Phaser.Group;
        
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
        }

        public shutdown(){
            this.groupContent.removeChildren();
            this.groupContent.removeAll();
            this.groupContent.destroy();
            this.game.stage.removeChildren();
        }
    }
}