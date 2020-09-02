class SocialVK {
    /* Пригласить */
    public static vkInvite(): void {
        try{
            VK.callMethod("showInviteBox");
        }catch (e){
            console.log(e);
        }
    }

    /* Пост на стену в соцсети */
    public static vkWallPost(): void {
        try{
            if (GameData.Data.tournamentProgress > 0) {
                let postPers: GameData.IPersonage =  GameData.Data.getPersonage(GameData.Data.id_enemies[GameData.Data.tournamentProgress-1]);
                if(postPers.id === Constants.ID_BARAKA) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239055' });
                if(postPers.id === Constants.ID_GORO) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239056' });
                if(postPers.id === Constants.ID_JAX) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239057' });
                if(postPers.id === Constants.ID_JOHNYCAGE) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239058' });
                if(postPers.id === Constants.ID_KITANA) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239059' });
                if(postPers.id === Constants.ID_KUNGLAO) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239060' });
                if(postPers.id === Constants.ID_LIUKANG) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239061' });
                if(postPers.id === Constants.ID_MILEENA) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239062' });
                if(postPers.id === Constants.ID_RAIDEN) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239063' });
                if(postPers.id === Constants.ID_REPTILE) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239064' });
                if(postPers.id === Constants.ID_SCORPION) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239065' });
                if(postPers.id === Constants.ID_SHANGTSUNG) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239066' });
                if(postPers.id === Constants.ID_SHAOKAHN) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239067' });
                if(postPers.id === Constants.ID_SUBZERO) VK.api("wall.post", { message: 'Я одержал(а) победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239068' });
                //VK.api("wall.post", { message: 'Я одержал победу в схватке с ' + postPers.name + ' в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239049' });
            }
        }catch (e){
            console.log(e);
        }
    }

    /* Пост на стену в соцсети */
    public static vkWallPostWin(): void {
        try{
            VK.api("wall.post", { message: 'Примите поздравления! Вы победили Шао Кана в игре Mortal Kombat 2 Quest.\nДрузья присоединяйтесь к игре https://vk.com/app4693053', attachments: 'photo-62618339_457239069' });
        }catch (e){
            console.log(e);
        }
        
    }

    /**
     * Сохранение данных на сервер VK --------------------------------------------------------------------------------------------
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

        try{
            VK.api('storage.set', { key: 'mk2q_data', value: jsonData, global: 0 }, SocialVK.onVkDataSet, SocialVK.onVkSetDataError);
        }catch (e){
            console.log(e);
        }

        Utilits.Data.debugLog('VK SAVE DATA:', jsonData);
        return jsonData;
    }

    public static onVkDataSet(response: any): void {
        //console.log(response);
    }

    public static onVkSetDataError(response: any): void {
        //console.log(response);
    }

    /**
     * Загрузка данных с сервера VK --------------------------------------------------------------------------------------------
     */
    public static vkLoadData(onVkDataGet: any): void {
        try{
            VK.api('storage.get', { key: 'mk2q_data' }, onVkDataGet, onVkDataGet);
        }catch (e){
            console.log(e);
        }
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
                GameData.Data.user_personage = GameData.Data.getNewPersonage(value.id);
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