module MortalKombat {
    export class Level extends Phaser.State{
        public static Name: string = "level";
        public name: string = Tournament.Name;
    
        constructor() {
            super();
        }

        public create() {
            
        }

        public shutdown(){
            
            this.game.stage.removeChildren();
        }

        private onButtonClick(event) {
            switch (event.name) {
                case Constants.BACK_MENU:
                    {
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        break;
                    }
                case Constants.HELP:
                    {
                        break;
                    }  
                default:
                    break;
            }
        }
    }
}