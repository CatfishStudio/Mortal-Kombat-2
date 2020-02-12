module Game {
    export interface IPersonage {
        id:number;
        name:string;
        animBlock:string[];
        animDamage:string[];
        animHitHand:string[];
        animHitLeg:string[];
        animLose:string[];
        animStance:string[];
        animWin:string[];
    }

    export class Data {
        public static initPersonages(game: Phaser.Game):void {
            
        }
    }
}