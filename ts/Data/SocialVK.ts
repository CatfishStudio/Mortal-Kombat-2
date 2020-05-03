class SocialVK {
    public static vkInvite(): void {
        //VK.callMethod("showInviteBox");
    }

    public static vkWallPost(): void {
        //if (GameData.Data.progressIndex > 0) {
        //    let postPers: GameData.IPersonage = GameData.Data.personages[GameData.Data.tournamentListIds[GameData.Data.progressIndex - 1]];
            //VK.api("wall.post", { message: 'Я одержал победу в схватке с ' + postPers.name + ' в игре Street Fighter Cards.\nДрузья присоединяйтесь к игре https://vk.com/app5883565', attachments: 'photo-62618339_456239021' });
        //}
    }


    public static vkWallPostWin(): void {
        //VK.api("wall.post", { message: 'Примите поздравления! Вы победили всех соперников в игре Street Fighter Cards.\nДрузья присоединяйтесь к игре https://vk.com/app5883565', attachments: 'photo-62618339_456239022' });
    }

    /**
     * Сохранение данных на сервер VK
     */
    public static vkSaveData(): string {
        let jsonData: string = '{';
        jsonData += '"continue": ' + GameData.Data.user_continue.toString() + ',';
        jsonData += '"points": ' + GameData.Data.user_upgrade_points.toString() + ',';
        jsonData += '"progress": ' + GameData.Data.tournamentProgress.toString() + ',';
        jsonData += '"enemies": [';
        GameData.Data.id_enemies.forEach((name: string) => {
            jsonData += "\"" + name + "\",";
        });
        jsonData = jsonData.slice(0, -1);
        jsonData += '],';
        jsonData += '"personage": {';
        jsonData += '"id": "' + GameData.Data.user_personage.id.toString() + '",';
        jsonData += '"name": "' + GameData.Data.user_personage.name.toString() + '",';
        jsonData += '"hand": ' + GameData.Data.user_personage.hand.toString() + ',';
        jsonData += '"leg": ' + GameData.Data.user_personage.leg.toString() + ',';
        jsonData += '"block": ' + GameData.Data.user_personage.block.toString() + ',';
        jsonData += '"uppercut": ' + GameData.Data.user_personage.uppercut.toString() + ',';
        jsonData += '"twist": ' + GameData.Data.user_personage.twist.toString() + ',';
        jsonData += '"life": ' + GameData.Data.user_personage.life.toString();
        jsonData += '}';
        jsonData += '}';

        //VK.api('storage.set', { key: 'sfc_data', value: jsonData, global: 0 }, SocialVK.onVkDataSet, SocialVK.onVkSetDataError);

        Utilits.Data.debugLog('VK SAVE DATA:', jsonData);
        return jsonData;
    }

    public static onVkDataSet(response: any): void {
        //Utilits.Data.debugLog('VK SET DATA:', response);
    }

    public static onVkSetDataError(response: any): void {
        //console.error('VK SET DATA ERROR:', response);
    }

    /**
     * Загрузка данных с сервера VK
     */
    public static vkLoadData(onVkDataGet: any): void {
        //VK.api('storage.get', { key: 'sfc_data' }, onVkDataGet, onVkDataGet);
    }

    public static onVkGetDataError(response: any): void {
        console.error('VK GET DATA ERROR:', response);
    }

    public static LoadData(jsonData: string): boolean {
        Utilits.Data.debugLog('jsonData',jsonData);
        if(jsonData === "" || jsonData === undefined) return false;

        JSON.parse(jsonData, function (key, value) {
            if (key === 'continue') GameData.Data.user_continue = value;
            if (key === 'points') GameData.Data.user_upgrade_points = value;
            if (key === 'progress') GameData.Data.tournamentProgress = value;
            if (key === 'enemies') GameData.Data.id_enemies = value;
            if (key === 'personage') {
                GameData.Data.user_personage = GameData.Data.getPersonage(value.id);
                GameData.Data.user_personage.hand = value.hand;
                GameData.Data.user_personage.leg = value.leg;
                GameData.Data.user_personage.block = value.block;
                GameData.Data.user_personage.uppercut = value.uppercut;
                GameData.Data.user_personage.twist = value.twist;
                GameData.Data.user_personage.life = value.life;
            }
            return value;
        });

        Utilits.Data.debugLog('LOAD DATA',
            GameData.Data.user_continue.toString() + " " +
            GameData.Data.user_upgrade_points.toString() + " " +
            GameData.Data.tournamentProgress.toString() + " " +
            GameData.Data.id_enemies.toString());
        Utilits.Data.debugLog('LOAD PERSONAGE', GameData.Data.user_personage);

        GameData.Data.enemiesUpgrade();
        GameData.Data.initLevels();

        if (GameData.Data.tournamentProgress > -1){
            return true;
        }else{
            return false;
        }
    }
}