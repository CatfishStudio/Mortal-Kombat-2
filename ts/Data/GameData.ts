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
        
        public static buttonSound:Phaser.Sound;
        public static iconSound:Phaser.Sound;
        public static voiceSound:Phaser.Sound;
        public static playerSound:Phaser.Sound;
        public static opponentSound:Phaser.Sound;
        public static music:Phaser.Sound;
        public static musicSelected:number = 1;
        public static musicList:any[][] = [
            [Sounds.music_menu, 0.4],
            [Sounds.music_1, 0.4],
            [Sounds.music_2, 0.4]
        ];
        
        public static personages:IPersonage[]; // массив персонажей и их характеристик
        public static levels:string[][]; // массив уровней
        
        public static user_personage:IPersonage; // выбранный пользователем персонаж
        public static user_continue:number; // количество попыток
        public static user_upgrade_points:number; // количество очков улучшений
        public static tournamentProgress:number; // прогресс прохождения турнира (индекс врага)

        public static id_enemies:string[];  // идентификаторы персонажей (враги)

        public static saveData:string; // сохраняемые данные в формате json
        
        /* инициализация персонажей */
        public static initPersonages(game: Phaser.Game):void {
            GameData.Data.personages = [];
            let personage: GameData.IPersonage;
            Characteristics.preloadList.forEach((value: string)=>{
                personage = <IPersonage>{};
                personage.id = game.cache.getJSON(value).id;
                personage.name = game.cache.getJSON(value).name;
                personage.hand = game.cache.getJSON(value).hand;
                personage.leg = game.cache.getJSON(value).leg;
                personage.block = game.cache.getJSON(value).block;
                personage.uppercut = game.cache.getJSON(value).uppercut;
                personage.twist = game.cache.getJSON(value).twist;
                personage.life = game.cache.getJSON(value).life;

                this.loadAnimation(game, personage);
                GameData.Data.personages.push(personage);
            });

            Utilits.Data.debugLog("INIT PERSONAGES:", GameData.Data.personages);
        }

        /* инициализация новой игры */
        public static initNewGame():void {
            this.user_continue = 9;
            this.user_upgrade_points = 0;
            this.tournamentProgress = 0;
            this.id_enemies = [];
            this.saveData = "";

            let listIDs:string[] = [
                Constants.ID_BARAKA,
                Constants.ID_JAX,
                Constants.ID_JOHNYCAGE,
                Constants.ID_KITANA,
                Constants.ID_KUNGLAO,
                Constants.ID_LIUKANG,
                Constants.ID_MILEENA,
                Constants.ID_RAIDEN,
                Constants.ID_REPTILE,
                Constants.ID_SCORPION,
                Constants.ID_SHANGTSUNG,
                Constants.ID_SUBZERO
            ];
            let id:string;
            while(listIDs.length > 0){
                id = listIDs.splice(Utilits.Data.getRandomRangeIndex(0, listIDs.length-1), 1)[0];
                if(id === this.user_personage.id) continue;
                this.id_enemies.push(id);
            }
            this.id_enemies.push(Constants.ID_GORO);
            this.id_enemies.push(Constants.ID_SHAOKAHN);

            Utilits.Data.debugLog("INIT NEW GAME - Tournament List:", this.id_enemies);

            this.enemiesUpgrade();
            this.initLevels();
        }

        /* получить данные персонажа по его ID */
        public static getPersonage(personageID:string):IPersonage{
            let personageChange: IPersonage;
            GameData.Data.personages.forEach((personage: GameData.IPersonage) => {
                if(personage.id === personageID){
                    personageChange = personage;
                    return;
                }
            });
            return personageChange;
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
        public static loadAnimation(game: Phaser.Game, personage: IPersonage):void {
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
                    if('hit_hand' == key.substr(0, 8) && 'hit_hand_uppercut' != key.substr(0, 17)) hit_hand.push(key);
                    if('hit_hand_uppercut' == key.substr(0, 17)) hit_hand_uppercut.push(key);
                    if('hit_leg' == key.substr(0, 7) && 'hit_leg_twist' != key.substr(0, 13)) hit_leg.push(key);
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
                console.log(error);
            }
        }

        /* Прокачка врагов */
        public static enemiesUpgrade():void
        {
            let count = 0;
            let personage: IPersonage;
            this.id_enemies.forEach((personageID: string) => {
                personage = this.getPersonage(personageID);
                personage.life = personage.life + (50 * count);
                for(let i = 0; i < count; i++)
                {
                    if(this.checkAccessPersonageUpgrade(personageID)===false){
                        Utilits.Data.debugLog("NOT AVAILABLE - UPGRADE PERSONAGE CHARACTERISTICS", this.getPersonage(personageID));
                        continue;
                    }

                    let index = Utilits.Data.getRandomRangeIndex(1, 5);
                    while(index > 0)
                    {
                        if(index === 1){
                            if(personage.leg < Constants.MAX_HIT_LEG) {
                                personage.leg++;
                                index = 0;
                            }
                        }else if(index === 2){
                            if(personage.hand < Constants.MAX_HIT_HAND) {
                                personage.hand++;
                                index = 0;
                            }
                        }else if(index === 3){
                            if(personage.block < Constants.MAX_HIT_BLOCK){
                                personage.block++;
                                index = 0;
                            }
                        }else if(index === 4){
                            if(personage.uppercut < Constants.MAX_HIT_UPPERCUT){
                                personage.uppercut++;
                                index = 0;
                            }
                        }else if(index === 5){
                            if(personage.twist < Constants.MAX_HIT_TWIST){
                                personage.twist++;
                                index = 0;
                            }
                        }
                        if(index !== 0) index = Utilits.Data.getRandomRangeIndex(1, 5);
                    }
                }
                count++;
            });
            Utilits.Data.debugLog("UPGRADE ENEMIES", this.personages);
        }

        /* Проверить доступен ли upgrade персонажа */
        public static checkAccessPersonageUpgrade(personageID:string):boolean
        {
            let personage: IPersonage;
            personage = this.getPersonage(personageID);
            if(personage.leg < Constants.MAX_HIT_LEG) return true;
            if(personage.hand < Constants.MAX_HIT_HAND) return true;
            if(personage.block < Constants.MAX_HIT_BLOCK) return true;
            if(personage.uppercut < Constants.MAX_HIT_UPPERCUT) return true;
            if(personage.twist < Constants.MAX_HIT_TWIST) return true;
            return false;
        }

        /* Список уровней */
        public static initLevels():void
        {
            this.levels = [];
            let images = [
                Images.level1, Images.level2, Images.level3, Images.level4, Images.level5, Images.level6, Images.level7,
                Images.level8, Images.level9, Images.level10, Images.level11, Images.level12, Images.level13
            ];
            let files = [
                Levels.level1, Levels.level2, Levels.level3, Levels.level4, Levels.level5, Levels.level6, Levels.level7,
                Levels.level8, Levels.level9, Levels.level10, Levels.level11, Levels.level12, Levels.level13
            ];

            images.sort(Utilits.Data.compareRandom);
            for(let i = 0; i < images.length; i++){
                let img = images[i];
                let index = Utilits.Data.getRandomRangeIndex(0, files.length-1);
                let file = files.splice(index, 1);
                this.levels.push([img, file[0]]);
            }

            Utilits.Data.debugLog('LEVELS:', this.levels);
        }

        /* Расчитать урон */
        public static calcDamage(pers:GameData.IPersonage, block:boolean, hitType:any, hitCount:number):number
        {
            let damage:number = 0;
            
            if(hitType === Constants.BLOCK) return damage;

            if(hitType === Constants.HAND && hitCount === 3) damage = pers.hand * Constants.DAMAGE_HAND;
            if(hitType === Constants.HAND && hitCount === 4) damage = (pers.hand + 1) * Constants.DAMAGE_HAND;
            if(hitType === Constants.HAND && hitCount >= 5) damage = (pers.hand + 2) * Constants.DAMAGE_HAND;
            if(hitType === Constants.LEG && hitCount === 3) damage = pers.leg * Constants.DAMAGE_LEG;
            if(hitType === Constants.LEG && hitCount === 4) damage = (pers.leg + 1) * Constants.DAMAGE_LEG;
            if(hitType === Constants.LEG && hitCount >= 5) damage = (pers.leg + 2) * Constants.DAMAGE_LEG;
            if(hitType === Constants.TWIST && hitCount === 3) damage = pers.twist * Constants.DAMAGE_TWIST;
            if(hitType === Constants.TWIST && hitCount === 4) damage = (pers.twist + 1) * Constants.DAMAGE_TWIST;
            if(hitType === Constants.TWIST && hitCount >= 5) damage = (pers.twist + 2) * Constants.DAMAGE_TWIST;
            if(hitType === Constants.UPPERCUT && hitCount === 3) damage = pers.uppercut * Constants.DAMAGE_UPPERCUT;
            if(hitType === Constants.UPPERCUT && hitCount === 4) damage = (pers.uppercut + 1) * Constants.DAMAGE_UPPERCUT;
            if(hitType === Constants.UPPERCUT && hitCount >= 5) damage = (pers.uppercut + 2) * Constants.DAMAGE_UPPERCUT;

            if(block === true){
                damage = damage - (pers.block * Constants.DAMAGE_BLOCK);
                if(damage < 0) damage = 0;
            }
            return damage;
        }
    }
}