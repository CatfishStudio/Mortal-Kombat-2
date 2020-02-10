module MortalKombat {
    export class Boot extends Fabrique.State {
        public static Name: string = 'booter';
        public name: string = Boot.Name;
        
        constructor() {
            super();
        }
        
        /*
        * Загружаем ассеты необходимые для прелоадера
        */
        
        public init(): void {
            // отключаем контекстное меню
            this.game.canvas.oncontextmenu = function(e) {
                e.preventDefault();
            }
        }
        
        public preload() {
            this.game.load.image(Images.PreloaderImage, 'assets/images/' + Images.PreloaderImage);
            this.game.load.atlas(Atlases.LogoAtlas, 'assets/atlas/' + Atlases.LogoAtlas + '.png','assets/atlas/' + Atlases.LogoAtlas + '.json');
        }
        
        public create() {
            this.game.state.start(Preloader.Name, true, false, {
                nextStage: Menu.Name,
                preloadHandler: (): void => {
                    Images.preloadList.forEach((assetName: string) => {
                        this.game.load.image(assetName, 'assets/images/' + assetName);
                    });
                    
                    Atlases.preloadList.forEach((assetName: string) => {
                        this.game.load.atlas(assetName, 'assets/atlas/' + assetName + '.png','assets/atlas/' + assetName + '.json');
                    });
                    
                    Sheet.preloadList.forEach((assetName: string) => {
                        this.game.load.spritesheet(assetName, 'assets/images/' + assetName, 255, 50);
                    });
                }
            });
        }
        
        public shutdown(){
            //this.game.stage.removeChildren();
        }
    }
}