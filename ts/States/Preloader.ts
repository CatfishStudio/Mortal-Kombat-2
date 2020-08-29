module MortalKombat {
    export interface IPreloaderConfig {
        nextStage: string;
        preloadHandler: () => void;
    }
    
    export class Preloader extends Phaser.State{
        public static Name: string = "preloader";
        public name: string = Preloader.Name;
        private preloadText: Phaser.Text;
        private config: IPreloaderConfig;
        private logo: Phaser.Sprite;
        private loadPercent: number = 0;
        private preloadProcessText: Phaser.Text;
        private preloadtimer: Phaser.Timer;
        private preloadProcessCount: number;
        
        constructor() {
            super();
        }
        
        public init(config: IPreloaderConfig) {
            console.log("Mortal Kombat 2 Quest - Version - 1.0.0");
            this.config = config;
        }
        
        public preload() {
            this.game.add.sprite(0,0, Images.PreloaderImage);
            
            this.logo =  this.game.add.sprite(0,0, Atlases.LogoAtlas, "load_1.png");
            this.logo.x = (this.game.world.width/2) - (this.logo.width / 2);
            this.logo.y = (this.game.world.height/2) - (this.logo.height / 2);

            this.preloadProcessText = this.game.add.text(330, 650, '. . . . . . . . . . . . . . . . . . . . . .', { font: "18px Georgia", fill: "#505050", align: "left" });
            this.preloadProcessCount = 7;
            this.preloadtimer = this.game.time.create(false);
            this.preloadtimer.loop(1000, this.onTimerComplete, this);
            this.preloadtimer.start(this.preloadProcessCount);
            this.game.load.onLoadStart.add(this.onLoadStart, this);
            this.game.load.onFileComplete.add(this.onFileComplete, this);
            this.game.load.onLoadComplete.add(this.onLoadComplete, this);
            
            this.config.preloadHandler();
            if (this.game.load.totalQueuedFiles() === 0) {
                this.onLoadComplete();
            }
        }

        private onTimerComplete(): void {
            this.preloadProcessCount++;
            if(this.preloadProcessCount >= 7) {
                this.preloadProcessText.text = " ";
                this.preloadProcessCount = 1;
            } else {
                for(let i:number = 0; i < this.preloadProcessCount; i++){
                    this.preloadProcessText.text += ". ";
                }
            }
        }

        private onLoadStart() {
            this.preloadText = this.game.add.text(335, 600, "ЗАГРУЗКА 0%", {font: "24px Georgia", fill: "#505050"});
        }

        private onFileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
            this.loadPercent = Math.round(progress  * 0.1);
            if(this.loadPercent <= 0) this.loadPercent = 1;
            if (this.preloadText !== null) {
                this.logo.frameName = "load_" + this.loadPercent + ".png";
                this.preloadText.text = "ЗАГРУЗКА " + this.loadPercent + "0 %";
            }
        }
       
        private onLoadComplete() {
            this.preloadtimer.stop();
            this.preloadProcessText.text = " ";
            this.preloadtimer.destroy();
            this.logo.frameName = "load_" + this.loadPercent + ".png";
            this.game.stage.removeChildren();
            this.game.state.start(this.config.nextStage, true, false);
        }

    }   
}