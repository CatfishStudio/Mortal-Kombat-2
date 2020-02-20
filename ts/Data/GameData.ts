module GameData {
    export interface IPersonage {
        id:string;
        name:string;

        hand:number;
        leg:number;
        block:number;
        uppercut:number;
        twist:number;

        life:number;

        animStance:string[];
        animHitHand:string[];
        animHitHandUppercut:string[];
        animHitLeg:string[];
        animHitLegTwist:string[];
        animBlock:string[];
        animDamage:string[];
        animLose:string[];
        animWin:string[];
    }

    export class Data {
        public static tutorList:any[] = [
            'Нажмите на кнопку\n"начать игру"\nчтобы начать\nтурнир.',
            'Нажмите на иконку\nбойца и на кнопку\n"Выбрать бойца',
            '',
            '',
            ''
        ];

        public static personages:IPersonage[]; // массив персонажей и их характеристик

        /* инициализация персонажей */
        public static initPersonages(game: Phaser.Game):void {
            GameData.Data.personages = [];
            let personage: GameData.IPersonage;
            Characteristics.preloadList.forEach((value: string)=>{
                personage = <IPersonage>{};
                personage.id = game.cache.getJSON(value).id;
                personage.name = game.cache.getJSON(value).name;
                personage.hand = game.cache.getJSON(value).hand;
                personage.uppercut = game.cache.getJSON(value).uppercut;
                personage.leg = game.cache.getJSON(value).leg;
                personage.twist = game.cache.getJSON(value).twist;
                personage.life = game.cache.getJSON(value).life;

                this.loadAnimation(game, personage);
                GameData.Data.personages.push(personage);
            });

            Utilits.Data.debugLog("PERSONAGES", GameData.Data.personages);
        }

        /* загрузка анимаций бойцов 
            damage  - damage
            hit1 - hit_leg
            hit2 - hit_hand
            hit3 - block
            hit4 - hit_hand_uppercut
            hit5 - hit_leg_twist
            lost - lose
            stance - stance
            victory - win
        */
        public static loadAnimation(game: Phaser.Game, personage: IPersonage):void {    // загрузка анимаций бойцов
            try {
                let json = game.cache.getJSON(personage.id + '.json');
                let block:string[] = [];
                let damage:string[] = [];
                let hit_hand:string[] = [];
                let hit_hand_uppercut:string[] = [];
                let hit_leg:string[] = [];
                let hit_leg_twist:string[] = [];
                let lose:string[] = [];
                let stance:string[] = [];
                let win:string[] = [];
                
                for (let key in json.frames) {
                    if('block' == key.substr(0, 5)) block.push(key);
                    if('damage' == key.substr(0, 6)) damage.push(key);
                    if('hit_hand' == key.substr(0, 8)) hit_hand.push(key);
                    if('hit_hand_uppercut' == key.substr(0, 17)) hit_hand_uppercut.push(key);
                    if('hit_leg' == key.substr(0, 7)) hit_leg.push(key);
                    if('hit_leg_twist' == key.substr(0, 13)) hit_leg_twist.push(key);
                    if('lose' == key.substr(0, 4)) lose.push(key);
                    if('stance' == key.substr(0, 6)) stance.push(key);
                    if('win' == key.substr(0, 3)) win.push(key);
                }
                
                personage.animBlock = block;
                personage.animDamage = damage;
                personage.animHitHand = hit_hand;
                personage.animHitHandUppercut = hit_hand_uppercut;
                personage.animHitLeg = hit_leg;
                personage.animHitLegTwist = hit_leg_twist;
                personage.animLose = lose;
                personage.animStance = stance;
                personage.animWin = win;
            } catch (error) {
                //console.log(error);
            }
        }
    }
}