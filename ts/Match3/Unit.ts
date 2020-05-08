module Match3 {
    export class Unit extends Phaser.Sprite {
        public event: Phaser.Signal;
        public interactive:boolean;
        public buttonMode:boolean;
        public unitType:string;
        public flagRemove:boolean;
        public posColumnI:number;
        public posRowJ:number;

        constructor(game: Phaser.Game, x: number, y: number, image:string) {
            super(game, x, y, image);
            this.init();
        }

        private init(): void {
            this.event = new Phaser.Signal();
            this.events.onInputUp.add(this.onClick, this);
        }

        private onClick(sprite: Phaser.Sprite, pointer: Phaser.Pointer) {
            Utilits.Data.debugLog('EVENT', sprite);
            this.event.dispatch(this);
        }
    }
}