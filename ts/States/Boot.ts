module MortalKombat {
    export class Boot extends Phaser.State {
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

                    Animations.preloadList.forEach((assetName: string) => {
                        this.game.load.json(assetName, 'assets/atlas/'+ assetName);
                    });

                    Characteristics.preloadList.forEach((assetName: string) => {
                        this.game.load.json(assetName, 'assets/data/'+ assetName);
                    });

                    Levels.levelsList.forEach((assetName: string)=>{
                        this.game.load.json(assetName, 'assets/levels/'+ assetName);
                    });

                    Sounds.preloadList.forEach((assetName: string)=>{
                        this.game.load.audio(assetName, ['assets/sounds/'+assetName+'.mp3', 'assets/sounds/'+assetName+'.ogg']);
                    });
                }
            });
        }
        
        public shutdown(){
            //this.game.stage.removeChildren();
        }
    }
}