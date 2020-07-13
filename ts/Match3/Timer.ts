module Match3 {
    export class Timer extends Phaser.Sprite {

        public static TIMER_END = "timer_end";

        public event: Phaser.Signal;
        private count: number;
        private timerText: Phaser.Text;
        private messageText: Phaser.Text;

        private timer: Phaser.Timer;

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

            this.timerText = this.game.add.text(65, 12, "0:" + this.count.toString(), { font: "bold 24px arial", fill: "#FFFFFF", align: "left" })
            this.addChild(this.timerText);

            this.messageText = this.game.add.text(60, 40, "............................", { font: "bold 12px arial", fill: "#FFFFFF", align: "left" })
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
                Utilits.Data.debugLog("TIMER:", "ON COMPLETE");
            }
        }

        private run(): void {
            this.timer.start(this.count);
        }

        public runTimer(): void {
            this.resetTimer();
            this.run();
        }

        public pauseTimer(value: boolean = true): void {
            if (value === true) this.timer.stop(false);
            else this.timer.start(this.count);
            Utilits.Data.debugLog("TIMER PAUSE:", value);
        }

        public stopTimer(): void {
            this.timer.stop(false);
            this.count = 10;
            this.setMessage("............................");
            Utilits.Data.debugLog("TIMER:", "STOP");
        }

        public resetTimer(): void {
            this.count = 10;
        }

        public setMessage(value: string): void {
            if (this.messageText !== undefined && this.messageText !== null) {
                this.messageText.text = value;
                if (value.length < 10) this.messageText.x = 62;
                else this.messageText.x = 40;
            }
        }
    }
}