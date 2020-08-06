module MortalKombat {
    export class GameOver extends Phaser.State{
        public static Name: string = "gameover";
        public name: string = GameOver.Name;

        private groupContent: Phaser.Group;
        
        constructor() {
            super();
        }

        public create() {
            this.groupContent = new Phaser.Group(this.game, this.stage);
            if(GameData.Data.tournamentProgress <= 0) this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_lose));
            else this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.game_win));
            this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        }

        public shutdown(){
            this.groupContent.removeChildren();
            this.groupContent.removeAll();
            this.groupContent.destroy();
            this.game.stage.removeChildren();
        }
    }
}