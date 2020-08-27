module Match3 {
    export class Timer extends Phaser.Sprite {

        public static TIMER_END = "timer_end";
        public static STATUS_RUN = "status_run";
        public static STATUS_PAUSE = "status_pause";
        public static STATUS_STOP = "status_stop";

        public event: Phaser.Signal;
        private count: number;
        private timerText: Phaser.Text;
        private messageText: Phaser.Text;
        
        private timer: Phaser.Timer;
        private status: string;

        constructor(game: Phaser.Game, x: number, y: number, imageTablo:string) {
            super(game, x, y, imageTablo);
            this.init();
        }

        public shutdown(): void {
            this.timer.stop(true);
            this.removeChildren();
        }

        private init(): void {
            this.event = new Phaser.Signal();

            this.count = 10;

            this.timer = this.game.time.create(false);
            this.timer.loop(1000, this.onTimerComplete, this);

            this.timerText = this.game.add.text(75, 55, "0:" + this.count.toString(), { font: "bold 24px arial", fill: "#FFFFFF", align: "left" })
            this.timerText.alpha = 0.7;
            this.addChild(this.timerText);

            this.messageText = this.game.add.text(52, 85, "............................", { font: "bold 12px arial", fill: "#FFFFFF", align: "left" })
            this.messageText.alpha = 0.7;
            this.addChild(this.messageText);
        }

        private onTimerComplete(): void {
            this.count--;
            if (this.timerText !== undefined && this.timerText !== null) {
                if (this.count > 9) this.timerText.text = "0:" + this.count.toString();
                else this.timerText.text = "0:0" + this.count.toString();
            }

            if (this.count === 0) {
                this.event.dispatch(Timer.TIMER_END);
                this.count = 10;
                //Utilits.Data.debugLog("TIMER:", "ON COMPLETE");
            }
        }

        private run(): void {
            this.timer.start(this.count);
        }

        public runTimer(): void {
            this.resetTimer();
            this.run();
            this.status = Timer.STATUS_RUN;
        }

        public pauseTimer(value: boolean = true): void {
            if (value === true) this.timer.stop(false);
            else this.timer.start(this.count);
            //Utilits.Data.debugLog("TIMER PAUSE:", value);
            this.status = Timer.STATUS_PAUSE;
        }

        public stopTimer(): void {
            this.timer.stop(false);
            this.count = 10;
            this.setMessage("............................");
            //Utilits.Data.debugLog("TIMER:", "STOP");
            this.status = Timer.STATUS_STOP;
        }

        public resetTimer(): void {
            this.count = 10;
        }

        public destroyTimer(): void {
            this.timer.stop(true);
            this.timer.destroy();
            this.count = 0;
            this.setMessage("............................");
            //Utilits.Data.debugLog("TIMER:", "STOP");
            this.status = Timer.STATUS_STOP;
        }

        public setMessage(value: string): void {
            if (this.messageText !== undefined && this.messageText !== null) {
                this.messageText.text = value;
                if (value.length < 10) this.messageText.x = 72;
                else this.messageText.x = 52;
            }
        }

        public getStatusTimer():string {
            return this.status;
        }
    }
}