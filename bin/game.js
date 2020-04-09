var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MortalKombat;
(function (MortalKombat) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, {
                enableDebug: false,
                width: Constants.GAME_WIDTH,
                height: Constants.GAME_HEIGHT,
                renderer: Phaser.AUTO,
                parent: 'content',
                transparent: true,
                antialias: true,
                forceSetTimeOut: false
            }) || this;
            _this.state.add(MortalKombat.Boot.Name, MortalKombat.Boot, false);
            _this.state.add(MortalKombat.Preloader.Name, MortalKombat.Preloader, false);
            _this.state.add(MortalKombat.Menu.Name, MortalKombat.Menu, false);
            _this.state.add(MortalKombat.Fighters.Name, MortalKombat.Fighters, false);
            _this.state.add(MortalKombat.Tournament.Name, MortalKombat.Tournament, false);
            return _this;
        }
        Game.getInstance = function () {
            if (MortalKombat.Game.instance === null) {
                Game.instance = new Game();
            }
            return Game.instance;
        };
        Game.prototype.start = function () {
            this.state.start(MortalKombat.Boot.Name);
        };
        Game.instance = null;
        return Game;
    }(Phaser.Game));
    MortalKombat.Game = Game;
})(MortalKombat || (MortalKombat = {}));
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.GAME_WIDTH = 860;
    Constants.GAME_HEIGHT = 730;
    Constants.START = 'start';
    Constants.BACK_MENU = 'back_menu';
    Constants.SETTINGS = 'settings';
    Constants.SETTINGS_CLOSE = 'settings_close';
    Constants.HELP = 'help';
    Constants.SELECT_FIGHTER = 'select_fighter';
    Constants.SOUND = 'sound';
    Constants.MUSIC = 'music';
    Constants.TUTORIAL = 'tutorial';
    Constants.INVITE = 'invite';
    Constants.CONTINUE = 'continue';
    Constants.ANIMATION_TYPE_STANCE = "animation_type_stance";
    Constants.ANIMATION_TYPE_BLOCK = "animation_type_block";
    Constants.ANIMATION_TYPE_HIT = "animation_type_hit";
    Constants.ANIMATION_TYPE_DAMAGE = "animation_type_damage";
    Constants.ANIMATION_TYPE_LOSE = "animation_type_lose";
    Constants.ANIMATION_TYPE_WIN = "animation_type_win";
    Constants.DAMAGE_HAND = 3;
    Constants.DAMAGE_LEG = 5;
    Constants.DAMAGE_BLOCK = 3;
    Constants.DAMAGE_UPPERCUT = 6;
    Constants.DAMAGE_TWIST = 10;
    Constants.MAX_HIT_HAND = 12;
    Constants.MAX_HIT_LEG = 6;
    Constants.MAX_HIT_BLOCK = 12;
    Constants.MAX_HIT_UPPERCUT = 5;
    Constants.MAX_HIT_TWIST = 3;
    Constants.HAND = "hand";
    Constants.LEG = "leg";
    Constants.BLOCK = "block";
    Constants.UPPERCUT = "uppercut";
    Constants.TWIST = "twist";
    Constants.ID_BARAKA = 'baraka';
    Constants.ID_GORO = 'goro';
    Constants.ID_JAX = 'jax';
    Constants.ID_JOHNYCAGE = 'johnnycage';
    Constants.ID_KITANA = 'kitana';
    Constants.ID_KUNGLAO = 'kunglao';
    Constants.ID_LIUKANG = 'liukang';
    Constants.ID_MILEENA = 'mileena';
    Constants.ID_RAIDEN = 'raiden';
    Constants.ID_REPTILE = 'reptile';
    Constants.ID_SCORPION = 'scorpion';
    Constants.ID_SHANGTSUNG = 'shangtsung';
    Constants.ID_SHAOKAHN = 'shaokahn';
    Constants.ID_SUBZERO = 'subzero';
    return Constants;
}());
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.buildDev = true;
    Config.settintSound = true;
    Config.settintMusic = true;
    Config.settintTutorial = true;
    return Config;
}());
var Utilits;
(function (Utilits) {
    var Data = /** @class */ (function () {
        function Data() {
        }
        /* Debug отладка */
        Data.debugLog = function (title, value) {
            if (Config.buildDev)
                console.log(title, value);
        };
        /* Проверка четности и нечетности */
        Data.checkEvenOrOdd = function (n) {
            if (n & 1) {
                return false; // odd (нечетное число)
            }
            else {
                return true; // even (четное число)
            }
        };
        /* Генератор случайных чисел */
        Data.getRandomIndex = function () {
            var index = Math.round(Math.random() / 0.1);
            return index;
        };
        /* Генератор случайных чисел из диапазона чисел мин/макс */
        Data.getRandomRangeIndex = function (min, max) {
            max -= min;
            var index = (Math.random() * ++max) + min;
            return Math.floor(index);
        };
        /* Функция перемешивает элементы массива */
        Data.compareRandom = function (a, b) {
            return Math.random() - 0.5;
        };
        return Data;
    }());
    Utilits.Data = Data;
})(Utilits || (Utilits = {}));
var Images = /** @class */ (function () {
    function Images() {
    }
    Images.PreloaderImage = 'preloader.jpg';
    Images.BackgroundImage = 'background.png';
    Images.MenuImage = 'menu.png';
    Images.LogoImage = 'logo.png';
    Images.FightersImage = 'fighters.png';
    Images.UpgradeImage = 'upgrade.png';
    Images.ButtonOn = 'buttons_on.png';
    Images.ButtonOff = 'buttons_off.png';
    Images.Title = 'title.png';
    Images.ButtonLeft = 'button_left.png';
    Images.ButtonRight = 'button_right.png';
    Images.WindowBackground = 'window_background.png';
    Images.WindowBorder = 'window_border.png';
    Images.WindowBackground2 = 'window_2_background.png';
    Images.WindowBorder2 = 'window_2_border.png';
    Images.capJax = 'jax_cap.png';
    Images.capMileena = 'mileena_cap.png';
    Images.capRaiden = 'raiden_cap.png';
    Images.capReptile = 'reptile_cap.png';
    Images.capShangTsung = 'shangtsung_cap.png';
    Images.towerHeader = 'tower_header.png';
    Images.towerContent = 'tower_content.png';
    Images.towerFooter = 'tower_footer.png';
    Images.ButtonPlus = 'button_plus.png';
    Images.BarakaIcon = 'baraka.png';
    Images.GoroIcon = 'goro.png';
    Images.JaxIcon = 'jax.png';
    Images.JohnnyCageIcon = 'johnnycage.png';
    Images.KitanaIcon = 'kitana.png';
    Images.KungLaoIcon = 'kunglao.png';
    Images.LiuKangIcon = 'liukang.png';
    Images.MileenaIcon = 'mileena.png';
    Images.RaidenIcon = 'raiden.png';
    Images.ReptileIcon = 'reptile.png';
    Images.ScorpionIcon = 'scorpion.png';
    Images.ShangTsungIcon = 'shangtsung.png';
    Images.ShaoKahnIcon = 'shaokahn.png';
    Images.SubZeroIcon = 'subzero.png';
    Images.preloadList = [
        Images.BackgroundImage,
        Images.MenuImage,
        Images.LogoImage,
        Images.FightersImage,
        Images.UpgradeImage,
        Images.ButtonOn,
        Images.ButtonOff,
        Images.Title,
        Images.ButtonLeft,
        Images.ButtonRight,
        Images.WindowBackground,
        Images.WindowBorder,
        Images.WindowBackground2,
        Images.WindowBorder2,
        Images.capJax,
        Images.capMileena,
        Images.capRaiden,
        Images.capReptile,
        Images.capShangTsung,
        Images.towerHeader,
        Images.towerContent,
        Images.towerFooter,
        Images.ButtonPlus,
        Images.BarakaIcon,
        Images.GoroIcon,
        Images.JaxIcon,
        Images.JohnnyCageIcon,
        Images.KitanaIcon,
        Images.KungLaoIcon,
        Images.LiuKangIcon,
        Images.MileenaIcon,
        Images.RaidenIcon,
        Images.ReptileIcon,
        Images.ScorpionIcon,
        Images.ShangTsungIcon,
        Images.ShaoKahnIcon,
        Images.SubZeroIcon
    ];
    return Images;
}());
var Atlases = /** @class */ (function () {
    function Atlases() {
    }
    Atlases.LogoAtlas = 'logo_atlas';
    Atlases.Video1 = 'video1';
    Atlases.Video2 = 'video2';
    Atlases.Video3 = 'video3';
    Atlases.VideoHelp = 'video_help';
    Atlases.BarakaAnimation = 'baraka';
    Atlases.GoroAnimation = 'goro';
    Atlases.JaxAnimation = 'jax';
    Atlases.JohnnyCageAnimation = 'johnnycage';
    Atlases.KitanaAnimation = 'kitana';
    Atlases.KungLaoAnimation = 'kunglao';
    Atlases.LiuKangAnimation = 'liukang';
    Atlases.MileenaAnimation = 'mileena';
    Atlases.RaidenAnimation = 'raiden';
    Atlases.ReptileAnimation = 'reptile';
    Atlases.ScorpionAnimation = 'scorpion';
    Atlases.ShangtsungAnimation = 'shangtsung';
    Atlases.ShaokahnAnimation = 'shaokahn';
    Atlases.SubzeroAnimation = 'subzero';
    Atlases.Blood = 'blood';
    Atlases.Flash = 'flash';
    Atlases.preloadList = [
        Atlases.Video1,
        Atlases.Video2,
        Atlases.Video3,
        Atlases.VideoHelp,
        Atlases.Blood,
        Atlases.Flash,
        Atlases.BarakaAnimation,
        Atlases.GoroAnimation,
        Atlases.JaxAnimation,
        Atlases.JohnnyCageAnimation,
        Atlases.KitanaAnimation,
        Atlases.KungLaoAnimation,
        Atlases.LiuKangAnimation,
        Atlases.MileenaAnimation,
        Atlases.RaidenAnimation,
        Atlases.ReptileAnimation,
        Atlases.ScorpionAnimation,
        Atlases.ShangtsungAnimation,
        Atlases.ShaokahnAnimation,
        Atlases.SubzeroAnimation
    ];
    return Atlases;
}());
var Sheet = /** @class */ (function () {
    function Sheet() {
    }
    Sheet.ButtonStartNewGame = 'button_start_new_game_sheet.png';
    Sheet.ButtonСontinueGame = 'button_continue_game_sheet.png';
    Sheet.ButtonSettings = 'button_settings_sheet.png';
    Sheet.ButtonInvite = 'button_invite_sheet.png';
    Sheet.ButtonClose = 'button_close_sheet.png';
    Sheet.ButtonSelectFighter = 'button_select_fighter_sheet.png';
    Sheet.ButtonBackMenuMini = 'button_back_menu_mini_sheet.png';
    Sheet.ButtonBackMini = 'button_back_mini_sheet.png';
    Sheet.ButtonHelpMini = 'button_help_mini_sheet.png';
    Sheet.preloadList = [
        Sheet.ButtonStartNewGame,
        Sheet.ButtonСontinueGame,
        Sheet.ButtonSettings,
        Sheet.ButtonInvite,
        Sheet.ButtonClose,
        Sheet.ButtonSelectFighter,
        Sheet.ButtonBackMenuMini,
        Sheet.ButtonBackMini,
        Sheet.ButtonHelpMini
    ];
    return Sheet;
}());
var Characteristics = /** @class */ (function () {
    function Characteristics() {
    }
    Characteristics.barakaJson = 'baraka_json.json';
    Characteristics.goroJson = 'goro_json.json';
    Characteristics.jaxJson = 'jax_json.json';
    Characteristics.johnnycageJson = 'johnnycage_json.json';
    Characteristics.kitanaJson = 'kitana_json.json';
    Characteristics.kunglaoJson = 'kunglao_json.json';
    Characteristics.liukangJson = 'liukang_json.json';
    Characteristics.mileenaJson = 'mileena_json.json';
    Characteristics.raidenJson = 'raiden_json.json';
    Characteristics.reptileJson = 'reptile_json.json';
    Characteristics.scorpionJson = 'scorpion_json.json';
    Characteristics.shangtsungJson = 'shangtsung_json.json';
    Characteristics.shaokahnJson = 'shaokahn_json.json';
    Characteristics.subzeroJson = 'subzero_json.json';
    Characteristics.preloadList = [
        Characteristics.barakaJson,
        Characteristics.goroJson,
        Characteristics.jaxJson,
        Characteristics.johnnycageJson,
        Characteristics.kitanaJson,
        Characteristics.kunglaoJson,
        Characteristics.liukangJson,
        Characteristics.mileenaJson,
        Characteristics.raidenJson,
        Characteristics.reptileJson,
        Characteristics.scorpionJson,
        Characteristics.shangtsungJson,
        Characteristics.shaokahnJson,
        Characteristics.subzeroJson
    ];
    return Characteristics;
}());
var Animations = /** @class */ (function () {
    function Animations() {
    }
    Animations.BarakaJson = 'baraka.json';
    Animations.GoroJson = 'goro.json';
    Animations.JaxJson = 'jax.json';
    Animations.JohnnyCageJson = 'johnnycage.json';
    Animations.KitanaJson = 'kitana.json';
    Animations.KungLaoJson = 'kunglao.json';
    Animations.LiuKangJson = 'liukang.json';
    Animations.MileenaJson = 'mileena.json';
    Animations.RaidenJson = 'raiden.json';
    Animations.ReptileJson = 'reptile.json';
    Animations.ScorpionJson = 'scorpion.json';
    Animations.ShangtsungJson = 'shangtsung.json';
    Animations.ShaokahnJson = 'shaokahn.json';
    Animations.SubzeroJson = 'subzero.json';
    Animations.preloadList = [
        Animations.BarakaJson,
        Animations.GoroJson,
        Animations.JaxJson,
        Animations.JohnnyCageJson,
        Animations.KitanaJson,
        Animations.KungLaoJson,
        Animations.LiuKangJson,
        Animations.MileenaJson,
        Animations.RaidenJson,
        Animations.ReptileJson,
        Animations.ScorpionJson,
        Animations.ShangtsungJson,
        Animations.ShaokahnJson,
        Animations.SubzeroJson
    ];
    return Animations;
}());
var GameData;
(function (GameData) {
    var Data = /** @class */ (function () {
        function Data() {
        }
        Data.initNewGame = function () {
            this.user_continue = 9;
            this.user_upgrade_points = 0;
            this.tournamentProgress = 0;
            this.id_enemies = [];
            var listIDs = [
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
            var id;
            while (listIDs.length > 0) {
                id = listIDs.splice(Utilits.Data.getRandomRangeIndex(0, listIDs.length - 1), 1)[0];
                if (id === this.user_personage.id)
                    continue;
                this.id_enemies.push(id);
            }
            this.id_enemies.push(Constants.ID_GORO);
            this.id_enemies.push(Constants.ID_SHAOKAHN);
            Utilits.Data.debugLog("Tournament List:", this.id_enemies);
        };
        /* инициализация персонажей */
        Data.initPersonages = function (game) {
            var _this = this;
            GameData.Data.personages = [];
            var personage;
            Characteristics.preloadList.forEach(function (value) {
                personage = {};
                personage.id = game.cache.getJSON(value).id;
                personage.name = game.cache.getJSON(value).name;
                personage.hand = game.cache.getJSON(value).hand;
                personage.leg = game.cache.getJSON(value).leg;
                personage.block = game.cache.getJSON(value).block;
                personage.uppercut = game.cache.getJSON(value).uppercut;
                personage.twist = game.cache.getJSON(value).twist;
                personage.life = game.cache.getJSON(value).life;
                _this.loadAnimation(game, personage);
                GameData.Data.personages.push(personage);
            });
            Utilits.Data.debugLog("PERSONAGES", GameData.Data.personages);
        };
        /* получить данные персонажа по его ID */
        Data.getPersonage = function (personageID) {
            var personageChange;
            GameData.Data.personages.forEach(function (personage) {
                if (personage.id === personageID) {
                    personageChange = personage;
                    return;
                }
            });
            return personageChange;
        };
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
        Data.loadAnimation = function (game, personage) {
            try {
                var json = game.cache.getJSON(personage.id + '.json');
                var block = [];
                var damage = [];
                var hit_hand = [];
                var hit_hand_uppercut = [];
                var hit_leg = [];
                var hit_leg_twist = [];
                var lose = [];
                var stance = [];
                var win = [];
                for (var key in json.frames) {
                    if ('block' == key.substr(0, 5))
                        block.push(key);
                    if ('damage' == key.substr(0, 6))
                        damage.push(key);
                    if ('hit_hand' == key.substr(0, 8))
                        hit_hand.push(key);
                    if ('hit_hand_uppercut' == key.substr(0, 17))
                        hit_hand_uppercut.push(key);
                    if ('hit_leg' == key.substr(0, 7))
                        hit_leg.push(key);
                    if ('hit_leg_twist' == key.substr(0, 13))
                        hit_leg_twist.push(key);
                    if ('lose' == key.substr(0, 4))
                        lose.push(key);
                    if ('stance' == key.substr(0, 6))
                        stance.push(key);
                    if ('win' == key.substr(0, 3))
                        win.push(key);
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
            }
            catch (error) {
                console.log(error);
            }
        };
        /* Изменение количества здоровья персонажа в соответствии с прогрессом */
        Data.upgradePersonageLife = function (personageID) {
            var personage;
            personage = this.getPersonage(personageID);
            personage.life += 50 * this.tournamentProgress;
            Utilits.Data.debugLog("UPGRADE PERSONAGE LIFE", this.getPersonage(personageID));
        };
        /* Улучшение характеристик персонажа в соответствии с прогрессом */
        Data.upgradePersonageCharacteristics = function (personageID) {
            var personage;
            personage = this.getPersonage(personageID);
            for (var i = 0; i < this.tournamentProgress; i++) {
                if (this.checkAccessPersonageUpgrade(personageID) === false) {
                    Utilits.Data.debugLog("NOT AVAILABLE - UPGRADE PERSONAGE CHARACTERISTICS", this.getPersonage(personageID));
                    return;
                }
                var index = Utilits.Data.getRandomRangeIndex(1, 5);
                while (index > 0) {
                    if (index === 1) {
                        if (personage.leg < Constants.MAX_HIT_LEG) {
                            personage.leg++;
                            index = 0;
                        }
                    }
                    else if (index === 2) {
                        if (personage.hand < Constants.MAX_HIT_HAND) {
                            personage.hand++;
                            index = 0;
                        }
                    }
                    else if (index === 3) {
                        if (personage.block < Constants.MAX_HIT_BLOCK) {
                            personage.block++;
                            index = 0;
                        }
                    }
                    else if (index === 4) {
                        if (personage.uppercut < Constants.MAX_HIT_UPPERCUT) {
                            personage.uppercut++;
                            index = 0;
                        }
                    }
                    else if (index === 5) {
                        if (personage.twist < Constants.MAX_HIT_TWIST) {
                            personage.twist++;
                            index = 0;
                        }
                    }
                    if (index !== 0)
                        index = Utilits.Data.getRandomRangeIndex(1, 5);
                }
            }
            Utilits.Data.debugLog("UPGRADE PERSONAGE CHARACTERISTICS", this.getPersonage(personageID));
        };
        /* Проверить доступен ли upgrade персонажа */
        Data.checkAccessPersonageUpgrade = function (personageID) {
            var personage;
            personage = this.getPersonage(personageID);
            if (personage.leg < Constants.MAX_HIT_LEG)
                return true;
            if (personage.hand < Constants.MAX_HIT_HAND)
                return true;
            if (personage.block < Constants.MAX_HIT_BLOCK)
                return true;
            if (personage.uppercut < Constants.MAX_HIT_UPPERCUT)
                return true;
            if (personage.twist < Constants.MAX_HIT_TWIST)
                return true;
            return false;
        };
        Data.tutorList = [
            'Нажмите на кнопку\n"начать игру"\nчтобы начать\nтурнир.',
            'Нажмите на иконку\nбойца и на кнопку\n"Выбрать бойца',
            '',
            '',
            ''
        ];
        return Data;
    }());
    GameData.Data = Data;
})(GameData || (GameData = {}));
var Fabrique;
(function (Fabrique) {
    var Tutorial = /** @class */ (function (_super) {
        __extends(Tutorial, _super);
        function Tutorial(game, text) {
            var _this = _super.call(this, game, 0, 0, Atlases.VideoHelp, 0) || this;
            _this.text = text;
            _this.init();
            return _this;
        }
        Tutorial.prototype.init = function () {
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0x000000, 0);
            graphics.lineStyle(10, 0x000000, 1);
            graphics.drawRect(0, 0, 400, 116);
            graphics.endFill();
            graphics.beginFill(0x000000, 0.6);
            graphics.lineStyle(1, 0x000000, 1);
            graphics.drawRect(150, 0, 250, 116);
            graphics.endFill();
            graphics.beginFill(0x000000, 0.5);
            graphics.lineStyle(2, 0x999999, 0.5);
            graphics.drawRect(0, 0, 400, 116);
            graphics.endFill();
            this.addChild(graphics);
            var messageText = this.game.add.text(175, 10, this.text, { font: "18px Georgia", fill: "#AAAAAA", align: "left" });
            this.addChild(messageText);
            var anim = this.animations.add(Atlases.VideoHelp);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(10, true, false);
        };
        Tutorial.prototype.onCompleteVideo = function () {
        };
        Tutorial.prototype.show = function (x, y) {
            var tween = this.game.add.tween(this);
            tween.to({ x: x, y: y }, 500, 'Linear');
            tween.start();
        };
        return Tutorial;
    }(Phaser.Sprite));
    Fabrique.Tutorial = Tutorial;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Settings = /** @class */ (function (_super) {
        __extends(Settings, _super);
        function Settings(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.init();
            return _this;
        }
        Settings.prototype.init = function () {
            this.event = new Phaser.Signal();
            var startX = (Constants.GAME_WIDTH / 2) - 150;
            var startY = (Constants.GAME_HEIGHT / 2) - 150;
            /* bacground and border */
            var polygon = new Phaser.Polygon([
                new Phaser.Point(startX, startY),
                new Phaser.Point(startX + 10, startY - 10),
                new Phaser.Point(startX + 300, startY - 10),
                new Phaser.Point(startX + 310, startY),
                new Phaser.Point(startX + 310, startY + 200),
                new Phaser.Point(startX + 300, startY + 210),
                new Phaser.Point(startX + 10, startY + 210),
                new Phaser.Point(startX, startY + 200)
            ]);
            var graphicOverlay = new Phaser.Graphics(this.game, 0, 0);
            graphicOverlay.beginFill(0x000000, 0.5);
            graphicOverlay.drawRect(0, 0, this.game.width, this.game.height);
            graphicOverlay.endFill();
            graphicOverlay.beginFill(0x000000, 0.8);
            graphicOverlay.lineStyle(2, 0x777777, 1);
            graphicOverlay.drawPolygon(polygon);
            graphicOverlay.endFill();
            graphicOverlay.inputEnabled = true;
            this.addChild(graphicOverlay);
            /* title */
            var title = new Phaser.Text(this.game, startX + 35, startY + 5, "НАСТРОЙКИ ИГРЫ", { font: "24px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(title);
            /* sound */
            var buttonSound;
            if (Config.settintSound === true)
                buttonSound = new Phaser.Button(this.game, startX + 25, startY + 50, Images.ButtonOn, this.onButtonClick, this);
            else
                buttonSound = new Phaser.Button(this.game, startX + 25, startY + 50, Images.ButtonOff, this.onButtonClick, this);
            buttonSound.name = Constants.SOUND;
            this.addChild(buttonSound);
            var labelSound = new Phaser.Text(this.game, startX + 90, startY + 55, "Звук", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelSound);
            /* music */
            var buttonMusic;
            if (Config.settintMusic === true)
                buttonMusic = new Phaser.Button(this.game, startX + 155, startY + 50, Images.ButtonOn, this.onButtonClick, this);
            else
                buttonMusic = new Phaser.Button(this.game, startX + 155, startY + 50, Images.ButtonOff, this.onButtonClick, this);
            buttonMusic.name = Constants.MUSIC;
            this.addChild(buttonMusic);
            var labelMusic = new Phaser.Text(this.game, startX + 220, startY + 55, "Музыка", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelMusic);
            /* tutorial */
            var buttonTutorial;
            if (Config.settintTutorial === true)
                buttonTutorial = new Phaser.Button(this.game, startX + 25, startY + 100, Images.ButtonOn, this.onButtonClick, this);
            else
                buttonTutorial = new Phaser.Button(this.game, startX + 25, startY + 100, Images.ButtonOff, this.onButtonClick, this);
            buttonTutorial.name = Constants.TUTORIAL;
            this.addChild(buttonTutorial);
            var labelTutorial = new Phaser.Text(this.game, startX + 90, startY + 105, "Обучение в игре", { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(labelTutorial);
            /* button close */
            var buttonClose = new Phaser.Button(this.game, startX + 25, startY + 150, Sheet.ButtonClose, this.onButtonCloseClick, this, 1, 2);
            buttonClose.name = Constants.SETTINGS_CLOSE;
            this.addChild(buttonClose);
            this.updateTransform();
        };
        Settings.prototype.onButtonCloseClick = function (event) {
            this.event.dispatch(event);
        };
        Settings.prototype.onButtonClick = function (event) {
            switch (event.name) {
                case Constants.SOUND:
                    {
                        if (Config.settintSound === true) {
                            Config.settintSound = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.SOUND;
                            this.addChild(event);
                        }
                        else {
                            Config.settintSound = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.SOUND;
                            this.addChild(event);
                        }
                        break;
                    }
                case Constants.MUSIC:
                    {
                        if (Config.settintMusic === true) {
                            Config.settintMusic = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.MUSIC;
                            this.addChild(event);
                        }
                        else {
                            Config.settintMusic = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.MUSIC;
                            this.addChild(event);
                        }
                        break;
                    }
                case Constants.TUTORIAL:
                    {
                        if (Config.settintTutorial === true) {
                            Config.settintTutorial = false;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOff, this.onButtonClick, this);
                            event.name = Constants.TUTORIAL;
                            this.addChild(event);
                        }
                        else {
                            Config.settintTutorial = true;
                            this.removeChild(event);
                            event = new Phaser.Button(this.game, event.x, event.y, Images.ButtonOn, this.onButtonClick, this);
                            event.name = Constants.TUTORIAL;
                            this.addChild(event);
                        }
                        break;
                    }
                default:
                    break;
            }
        };
        return Settings;
    }(Phaser.Group));
    Fabrique.Settings = Settings;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Title = /** @class */ (function (_super) {
        __extends(Title, _super);
        function Title(game, x, y, text) {
            var _this = _super.call(this, game, x, y, Images.Title) || this;
            _this.posX = 0;
            _this.posY = 0;
            _this.text = text;
            _this.posX = ((Constants.GAME_WIDTH / 2) - (_this.width / 2));
            _this.posY = Constants.GAME_HEIGHT / 10;
            if (x >= 0)
                _this.x = _this.posX;
            if (y >= 0)
                _this.y = _this.posY;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        Title.prototype.init = function () {
            var size = 12 * this.text.length;
            var posX = (this.width / 2) - (size / 2);
            var titleText = this.game.add.text(posX, 20, this.text, { font: "18px Georgia", fill: "#FFFFFF", align: "left" });
            this.addChild(titleText);
        };
        Title.prototype.show = function () {
            var tween = this.game.add.tween(this);
            tween.to({ x: this.posX, y: this.posY }, 500, 'Linear');
            tween.start();
        };
        return Title;
    }(Phaser.Sprite));
    Fabrique.Title = Title;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Tower = /** @class */ (function (_super) {
        __extends(Tower, _super);
        function Tower(game) {
            var _this = _super.call(this, game) || this;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        Tower.prototype.init = function () {
            var x = 0;
            var y = 0;
            this.towerHeader = new Phaser.Sprite(this.game, x, y, Images.towerHeader);
            this.addChild(this.towerHeader);
            y += 135;
            var count = GameData.Data.id_enemies.length - 1;
            while (count > 0) {
                var photo_1 = new Phaser.Sprite(this.game, 200, y + 15, GameData.Data.id_enemies[count] + '.png');
                photo_1.scale.x = 0.6;
                photo_1.scale.y = 0.6;
                this.addChild(photo_1);
                var towerContent = new Phaser.Sprite(this.game, 0, y, Images.towerContent);
                this.addChild(towerContent);
                y += 95;
                count--;
            }
            var photo = new Phaser.Sprite(this.game, 200, y + 15, GameData.Data.id_enemies[0] + '.png');
            photo.scale.x = 0.6;
            photo.scale.y = 0.6;
            this.addChild(photo);
            this.towerFooter = new Phaser.Sprite(this.game, 0, y, Images.towerFooter);
            this.addChild(this.towerFooter);
            this.personageIcon = new Phaser.Sprite(this.game, 125, y + 18, GameData.Data.user_personage.id + '.png');
            this.personageIcon.scale.x = 0.55;
            this.personageIcon.scale.y = 0.55;
            this.addChild(this.personageIcon);
        };
        Tower.prototype.show = function (x, y) {
            if (GameData.Data.tournamentProgress === 0) {
                var tween = this.game.add.tween(this);
                tween.to({ x: x, y: y - 725 }, 5000, 'Linear');
                tween.start();
            }
            else {
                this.y = y - 725 + (90 * (GameData.Data.tournamentProgress - 1));
                var tween = this.game.add.tween(this);
                tween.to({ x: x, y: this.y + 90 }, 1000, 'Linear');
                tween.start();
                this.personageIcon.y = this.personageIcon.y - (95 * (GameData.Data.tournamentProgress - 1));
                var tweenIcon = this.game.add.tween(this.personageIcon);
                tweenIcon.to({ y: this.personageIcon.y - 95 }, 1000, 'Linear');
                tweenIcon.start();
            }
        };
        return Tower;
    }(Phaser.Group));
    Fabrique.Tower = Tower;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var AnimationFighter = /** @class */ (function (_super) {
        __extends(AnimationFighter, _super);
        function AnimationFighter(game, personageiD, personage) {
            var _this = _super.call(this, game, 0, 0, personageiD, 1) || this;
            _this.personageAnimation = personage;
            _this.init();
            return _this;
        }
        AnimationFighter.prototype.init = function () {
            this.animationType = Constants.ANIMATION_TYPE_STANCE;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animStance);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(10, true, false);
        };
        AnimationFighter.prototype.onComplete = function (sprite, animation) {
            //console.log( (sprite as AnimationFighter).animation);
            if (this.animationType === Constants.ANIMATION_TYPE_STANCE)
                return;
        };
        AnimationFighter.prototype.winAnimation = function () {
            this.animation.stop();
            this.animation.onComplete.removeAll();
            this.animation.destroy();
            this.animationType = Constants.ANIMATION_TYPE_STANCE;
            this.animation = this.animations.add(this.personageAnimation.id, this.personageAnimation.animWin);
            this.animation.onComplete.add(this.onComplete, this);
            this.animation.play(15, true, false);
        };
        return AnimationFighter;
    }(Phaser.Sprite));
    Fabrique.AnimationFighter = AnimationFighter;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Icon = /** @class */ (function (_super) {
        __extends(Icon, _super);
        function Icon(game, x, y, image, id) {
            var _this = _super.call(this, game, x, y, image, function () {
                _this.event.dispatch(Constants.SELECT_FIGHTER, _this.id);
            }) || this;
            _this.id = id;
            _this.init();
            return _this;
        }
        Icon.prototype.init = function () {
            this.event = new Phaser.Signal();
            this.graphics = this.game.add.graphics(0, 0);
            this.graphics.beginFill(0x000000, 0);
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0, 0, 90, 120);
            this.graphics.endFill();
            this.addChild(this.graphics);
        };
        Icon.prototype.select = function () {
            this.graphics.lineStyle(2, 0xFFFFFF, 1);
            this.graphics.drawRect(0, 0, 90, 120);
            this.graphics.lineStyle(1, 0x000000, 1);
            this.graphics.drawRect(0, 0, 90, 120);
        };
        Icon.prototype.unselect = function () {
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.drawRect(0, 0, 90, 120);
        };
        return Icon;
    }(Phaser.Button));
    Fabrique.Icon = Icon;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var WindowPersonage = /** @class */ (function (_super) {
        __extends(WindowPersonage, _super);
        function WindowPersonage(game, x, y) {
            var _this = _super.call(this, game, x, y, Images.WindowBackground) || this;
            _this.init();
            return _this;
        }
        WindowPersonage.prototype.init = function () {
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
            this.fighter = new Phaser.Group(this.game, this);
        };
        WindowPersonage.prototype.showPersonage = function (personageID) {
            var personage;
            personage = GameData.Data.getPersonage(personageID);
            this.animPersonage = new Fabrique.AnimationFighter(this.game, personage.id, personage);
            this.animPersonage.x = (this.width - this.animPersonage.width) / 3;
            this.animPersonage.y = (this.height - this.animPersonage.height) / 4;
            this.animPersonage.scale.x = 1.5;
            this.animPersonage.scale.y = 1.5;
            this.fighter.addChild(this.animPersonage);
            this.addChild(this.border);
        };
        WindowPersonage.prototype.changePersonage = function (personageID) {
            var personage;
            personage = GameData.Data.getPersonage(personageID);
            this.animPersonage.destroy();
            this.fighter.removeAll();
            this.animPersonage = new Fabrique.AnimationFighter(this.game, personage.id, personage);
            this.animPersonage.x = (this.width - this.animPersonage.width) / 3;
            this.animPersonage.y = (this.height - this.animPersonage.height) / 4;
            this.animPersonage.scale.x = 1.5;
            this.animPersonage.scale.y = 1.5;
            this.fighter.addChild(this.animPersonage);
            Utilits.Data.debugLog("change personage", personage);
        };
        return WindowPersonage;
    }(Phaser.Sprite));
    Fabrique.WindowPersonage = WindowPersonage;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var WindowCharacteristics = /** @class */ (function (_super) {
        __extends(WindowCharacteristics, _super);
        function WindowCharacteristics(game, x, y) {
            var _this = _super.call(this, game, x, y, Images.WindowBackground2) || this;
            _this.init();
            return _this;
        }
        WindowCharacteristics.prototype.init = function () {
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder2);
            this.cap1 = new Phaser.Sprite(this.game, 15, 45, Images.capShangTsung);
            this.cap1.scale.x = 0.8;
            this.cap1.scale.y = 0.8;
            this.cap2 = new Phaser.Sprite(this.game, 90, 45, Images.capJax);
            this.cap2.scale.x = 0.8;
            this.cap2.scale.y = 0.8;
            this.cap3 = new Phaser.Sprite(this.game, 165, 45, Images.capMileena);
            this.cap3.scale.x = 0.8;
            this.cap3.scale.y = 0.8;
            this.cap4 = new Phaser.Sprite(this.game, 240, 45, Images.capRaiden);
            this.cap4.scale.x = 0.8;
            this.cap4.scale.y = 0.8;
            this.cap5 = new Phaser.Sprite(this.game, 315, 45, Images.capReptile);
            this.cap5.scale.x = 0.8;
            this.cap5.scale.y = 0.8;
            this.textCap1 = new Phaser.Text(this.game, 15, 110, "Удар ногой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap1 = new Phaser.Text(this.game, 40, 125, Constants.LEG + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap2 = new Phaser.Text(this.game, 90, 110, "Удар рукой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap2 = new Phaser.Text(this.game, 115, 125, Constants.HAND + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap3 = new Phaser.Text(this.game, 185, 110, "Блок\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap3 = new Phaser.Text(this.game, 195, 125, Constants.BLOCK + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap4 = new Phaser.Text(this.game, 245, 110, "Апперкот\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap4 = new Phaser.Text(this.game, 265, 125, Constants.UPPERCUT + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textCap5 = new Phaser.Text(this.game, 315, 110, "С разворота\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.textValueCap5 = new Phaser.Text(this.game, 345, 125, Constants.TWIST + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.namePersonage = new Phaser.Text(this.game, 50, 15, "", { font: "22px Georgia", fill: "#B7B7B7", align: "left" });
            this.addChild(this.namePersonage);
            this.addChild(this.cap1);
            this.addChild(this.textCap1);
            this.addChild(this.textValueCap1);
            this.addChild(this.cap2);
            this.addChild(this.textCap2);
            this.addChild(this.textValueCap2);
            this.addChild(this.cap3);
            this.addChild(this.textCap3);
            this.addChild(this.textValueCap3);
            this.addChild(this.cap4);
            this.addChild(this.textCap4);
            this.addChild(this.textValueCap4);
            this.addChild(this.cap5);
            this.addChild(this.textCap5);
            this.addChild(this.textValueCap5);
            this.addChild(this.border);
        };
        WindowCharacteristics.prototype.showCharacteristics = function (personageID) {
            var _this = this;
            GameData.Data.personages.forEach(function (personage) {
                if (personage.id === personageID) {
                    /*
                    this.textValueCap1.text = (Constants.LEG*personage.leg)+" ["+Constants.LEG+" x "+personage.leg+"]";
                    this.textValueCap2.text = (Constants.HAND*personage.hand)+" ["+Constants.HAND+" x "+personage.hand+"]";
                    this.textValueCap3.text = (Constants.BLOCK*personage.block)+"["+Constants.BLOCK+" x "+personage.block+"]";
                    this.textValueCap4.text = (Constants.UPPERCUT*personage.uppercut)+"["+Constants.UPPERCUT+" x "+personage.uppercut+"]";
                    this.textValueCap5.text = (Constants.TWIST*personage.twist)+"["+Constants.TWIST+" x "+personage.twist+"]";
                    */
                    _this.namePersonage.text = personage.name;
                    _this.namePersonage.x = (400 / 2) - (_this.namePersonage.text.length * 5);
                    _this.textValueCap1.text = (Constants.DAMAGE_LEG * personage.leg).toString();
                    _this.textValueCap2.text = (Constants.DAMAGE_HAND * personage.hand).toString();
                    _this.textValueCap3.text = (Constants.DAMAGE_BLOCK * personage.block).toString();
                    _this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT * personage.uppercut).toString();
                    _this.textValueCap5.text = (Constants.DAMAGE_TWIST * personage.twist).toString();
                    return;
                }
            });
        };
        return WindowCharacteristics;
    }(Phaser.Sprite));
    Fabrique.WindowCharacteristics = WindowCharacteristics;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var UpgradeCharacteristics = /** @class */ (function (_super) {
        __extends(UpgradeCharacteristics, _super);
        function UpgradeCharacteristics(game, thisIsPersonage) {
            if (thisIsPersonage === void 0) { thisIsPersonage = true; }
            var _this = _super.call(this, game) || this;
            _this.thisIsPersonage = thisIsPersonage;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        UpgradeCharacteristics.prototype.init = function () {
            this.background = new Phaser.Sprite(this.game, 0, 0, Images.WindowBackground);
            this.addChild(this.background);
            this.cap1 = new Phaser.Sprite(this.game, 10, 10, Images.capShangTsung);
            this.cap1.scale.x = 0.5;
            this.cap1.scale.y = 0.5;
            this.addChild(this.cap1);
            this.cap2 = new Phaser.Sprite(this.game, 10, 55, Images.capJax);
            this.cap2.scale.x = 0.5;
            this.cap2.scale.y = 0.5;
            this.addChild(this.cap2);
            this.cap3 = new Phaser.Sprite(this.game, 10, 100, Images.capMileena);
            this.cap3.scale.x = 0.5;
            this.cap3.scale.y = 0.5;
            this.addChild(this.cap3);
            this.cap4 = new Phaser.Sprite(this.game, 10, 145, Images.capRaiden);
            this.cap4.scale.x = 0.5;
            this.cap4.scale.y = 0.5;
            this.addChild(this.cap4);
            this.cap5 = new Phaser.Sprite(this.game, 10, 190, Images.capReptile);
            this.cap5.scale.x = 0.5;
            this.cap5.scale.y = 0.5;
            this.addChild(this.cap5);
            this.textCap1 = new Phaser.Text(this.game, 50, 25, "Удар ногой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap1);
            this.textValueCap1 = new Phaser.Text(this.game, 150, 25, Constants.LEG + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap1);
            this.textCap2 = new Phaser.Text(this.game, 50, 70, "Удар рукой\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap2);
            this.textValueCap2 = new Phaser.Text(this.game, 150, 70, Constants.HAND + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap2);
            this.textCap3 = new Phaser.Text(this.game, 50, 115, "Блок\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap3);
            this.textValueCap3 = new Phaser.Text(this.game, 150, 115, Constants.BLOCK + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap3);
            this.textCap4 = new Phaser.Text(this.game, 50, 160, "Апперкот\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap4);
            this.textValueCap4 = new Phaser.Text(this.game, 150, 160, Constants.UPPERCUT + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap4);
            this.textCap5 = new Phaser.Text(this.game, 50, 205, "С разворота\n", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textCap5);
            this.textValueCap5 = new Phaser.Text(this.game, 150, 205, Constants.TWIST + " x", { font: "12px Arial", fill: "#C4C4C4", align: "left" });
            this.addChild(this.textValueCap5);
            this.upgradePoints = new Phaser.Text(this.game, 50, 230, "Очки улучшений: 0", { font: "12px Arial", fill: "#B7B7B7", align: "left" });
            this.addChild(this.upgradePoints);
            this.border = new Phaser.Sprite(this.game, 0, 0, Images.WindowBorder);
            this.addChild(this.border);
        };
        UpgradeCharacteristics.prototype.show = function (x, y) {
            if (this.thisIsPersonage) {
                this.textValueCap1.text = Constants.DAMAGE_LEG + " x" + GameData.Data.user_personage.leg;
                this.textValueCap2.text = Constants.DAMAGE_HAND + " x" + GameData.Data.user_personage.hand;
                this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x" + GameData.Data.user_personage.block;
                this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x" + GameData.Data.user_personage.uppercut;
                this.textValueCap5.text = Constants.DAMAGE_TWIST + " x" + GameData.Data.user_personage.twist;
                this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                if (GameData.Data.user_upgrade_points > 0) {
                    this.textValueCap1.x = 125;
                    this.textValueCap2.x = 125;
                    this.textValueCap3.x = 125;
                    this.textValueCap4.x = 125;
                    this.textValueCap5.x = 125;
                    if (GameData.Data.user_personage.leg < Constants.MAX_HIT_LEG) {
                        this.buttonLegPlus = new Phaser.Button(this.game, 160, 10, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonLegPlus.name = Constants.LEG;
                        this.addChild(this.buttonLegPlus);
                    }
                    else {
                        this.textValueCap1.text = Constants.DAMAGE_LEG + " x" + GameData.Data.user_personage.leg + " (макс.)";
                    }
                    if (GameData.Data.user_personage.hand < Constants.MAX_HIT_HAND) {
                        this.buttonHandPlus = new Phaser.Button(this.game, 160, 55, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonHandPlus.name = Constants.HAND;
                        this.addChild(this.buttonHandPlus);
                    }
                    else {
                        this.textValueCap2.text = Constants.DAMAGE_HAND + " x" + GameData.Data.user_personage.hand + " (макс.)";
                    }
                    if (GameData.Data.user_personage.block < Constants.MAX_HIT_BLOCK) {
                        this.buttonBlockPlus = new Phaser.Button(this.game, 160, 100, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonBlockPlus.name = Constants.BLOCK;
                        this.addChild(this.buttonBlockPlus);
                    }
                    else {
                        this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x" + GameData.Data.user_personage.block + " (макс.)";
                    }
                    if (GameData.Data.user_personage.uppercut < Constants.MAX_HIT_UPPERCUT) {
                        this.buttonUppercutPlus = new Phaser.Button(this.game, 160, 145, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonUppercutPlus.name = Constants.UPPERCUT;
                        this.addChild(this.buttonUppercutPlus);
                    }
                    else {
                        this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x" + GameData.Data.user_personage.uppercut + " (макс.)";
                    }
                    if (GameData.Data.user_personage.twist < Constants.MAX_HIT_TWIST) {
                        this.buttonTwistPlus = new Phaser.Button(this.game, 160, 190, Images.ButtonPlus, this.onButtonClick, this);
                        this.buttonTwistPlus.name = Constants.TWIST;
                        this.addChild(this.buttonTwistPlus);
                    }
                    else {
                        this.textValueCap5.text = Constants.DAMAGE_TWIST + " x" + GameData.Data.user_personage.twist + " (макс.)";
                    }
                }
            }
            else {
                this.textValueCap1.text = (Constants.DAMAGE_LEG * GameData.Data.personages[GameData.Data.tournamentProgress].leg).toString();
                this.textValueCap2.text = (Constants.DAMAGE_HAND * GameData.Data.personages[GameData.Data.tournamentProgress].hand).toString();
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK * GameData.Data.personages[GameData.Data.tournamentProgress].block).toString();
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT * GameData.Data.personages[GameData.Data.tournamentProgress].uppercut).toString();
                this.textValueCap5.text = (Constants.DAMAGE_TWIST * GameData.Data.personages[GameData.Data.tournamentProgress].twist).toString();
                this.upgradePoints.text = "";
            }
            var tween = this.game.add.tween(this);
            tween.to({ x: x, y: y }, 1000, 'Linear');
            tween.start();
        };
        UpgradeCharacteristics.prototype.onButtonClick = function (event) {
            switch (event.name) {
                case Constants.LEG:
                    {
                        GameData.Data.user_personage.leg++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap1.text = Constants.DAMAGE_LEG + " x" + GameData.Data.user_personage.leg;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.HAND:
                    {
                        GameData.Data.user_personage.hand++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap2.text = Constants.DAMAGE_HAND + " x" + GameData.Data.user_personage.hand;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.BLOCK:
                    {
                        GameData.Data.user_personage.block++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x" + GameData.Data.user_personage.block;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.UPPERCUT:
                    {
                        GameData.Data.user_personage.uppercut++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x" + GameData.Data.user_personage.uppercut;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                case Constants.TWIST:
                    {
                        GameData.Data.user_personage.twist++;
                        GameData.Data.user_upgrade_points--;
                        this.textValueCap5.text = Constants.DAMAGE_TWIST + " x" + GameData.Data.user_personage.twist;
                        this.upgradePoints.text = "Очки улучшений: " + GameData.Data.user_upgrade_points.toString();
                        this.removeUpgradeButtons();
                        break;
                    }
                default:
                    break;
            }
        };
        UpgradeCharacteristics.prototype.removeUpgradeButtons = function () {
            if (GameData.Data.user_upgrade_points == 0) {
                this.removeChild(this.buttonLegPlus);
                this.removeChild(this.buttonHandPlus);
                this.removeChild(this.buttonBlockPlus);
                this.removeChild(this.buttonUppercutPlus);
                this.removeChild(this.buttonTwistPlus);
                this.textValueCap1.text = (Constants.DAMAGE_LEG * GameData.Data.user_personage.leg).toString();
                this.textValueCap2.text = (Constants.DAMAGE_HAND * GameData.Data.user_personage.hand).toString();
                this.textValueCap3.text = (Constants.DAMAGE_BLOCK * GameData.Data.user_personage.block).toString();
                this.textValueCap4.text = (Constants.DAMAGE_UPPERCUT * GameData.Data.user_personage.uppercut).toString();
                this.textValueCap5.text = (Constants.DAMAGE_TWIST * GameData.Data.user_personage.twist).toString();
                this.textValueCap1.x = 150;
                this.textValueCap2.x = 150;
                this.textValueCap3.x = 150;
                this.textValueCap4.x = 150;
                this.textValueCap5.x = 150;
            }
            else {
                if (GameData.Data.user_personage.leg == Constants.MAX_HIT_LEG) {
                    this.removeChild(this.buttonLegPlus);
                    this.textValueCap1.text = Constants.DAMAGE_LEG + " x" + GameData.Data.user_personage.leg + " (макс.)";
                }
                if (GameData.Data.user_personage.hand == Constants.MAX_HIT_HAND) {
                    this.removeChild(this.buttonHandPlus);
                    this.textValueCap2.text = Constants.DAMAGE_HAND + " x" + GameData.Data.user_personage.hand + " (макс.)";
                }
                if (GameData.Data.user_personage.block == Constants.MAX_HIT_BLOCK) {
                    this.removeChild(this.buttonBlockPlus);
                    this.textValueCap3.text = Constants.DAMAGE_BLOCK + " x" + GameData.Data.user_personage.block + " (макс.)";
                }
                if (GameData.Data.user_personage.uppercut == Constants.MAX_HIT_UPPERCUT) {
                    this.removeChild(this.buttonUppercutPlus);
                    this.textValueCap4.text = Constants.DAMAGE_UPPERCUT + " x" + GameData.Data.user_personage.uppercut + " (макс.)";
                }
                if (GameData.Data.user_personage.twist == Constants.MAX_HIT_TWIST) {
                    this.removeChild(this.buttonTwistPlus);
                    this.textValueCap5.text = Constants.DAMAGE_TWIST + " x" + GameData.Data.user_personage.twist + " (макс.)";
                }
            }
        };
        return UpgradeCharacteristics;
    }(Phaser.Group));
    Fabrique.UpgradeCharacteristics = UpgradeCharacteristics;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var PanelIcons = /** @class */ (function (_super) {
        __extends(PanelIcons, _super);
        function PanelIcons(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.defaultFighterID = Constants.ID_LIUKANG;
            _this.updateTransform();
            _this.init();
            return _this;
        }
        PanelIcons.prototype.init = function () {
            var _this = this;
            this.icons = [
                [
                    new Fabrique.Icon(this.game, 0, 0, Images.LiuKangIcon, Constants.ID_LIUKANG),
                    new Fabrique.Icon(this.game, 95, 0, Images.KungLaoIcon, Constants.ID_KUNGLAO),
                    new Fabrique.Icon(this.game, 190, 0, Images.JohnnyCageIcon, Constants.ID_JOHNYCAGE),
                    new Fabrique.Icon(this.game, 285, 0, Images.ReptileIcon, Constants.ID_REPTILE)
                ],
                [
                    new Fabrique.Icon(this.game, 0, 125, Images.SubZeroIcon, Constants.ID_SUBZERO),
                    new Fabrique.Icon(this.game, 95, 125, Images.ShangTsungIcon, Constants.ID_SHANGTSUNG),
                    new Fabrique.Icon(this.game, 190, 125, Images.KitanaIcon, Constants.ID_KITANA),
                    new Fabrique.Icon(this.game, 285, 125, Images.JaxIcon, Constants.ID_JAX)
                ],
                [
                    new Fabrique.Icon(this.game, 0, 250, Images.MileenaIcon, Constants.ID_MILEENA),
                    new Fabrique.Icon(this.game, 95, 250, Images.BarakaIcon, Constants.ID_BARAKA),
                    new Fabrique.Icon(this.game, 190, 250, Images.ScorpionIcon, Constants.ID_SCORPION),
                    new Fabrique.Icon(this.game, 285, 250, Images.RaidenIcon, Constants.ID_RAIDEN)
                ]
            ];
            this.x = -400;
            this.y = 150;
            this.icons.forEach(function (iconsLine) {
                iconsLine.forEach(function (icon) {
                    icon.event.add(_this.onChange, _this);
                    _this.addChild(icon);
                });
            });
            this.icons[0][0].select();
            this.windowPersonage = new Fabrique.WindowPersonage(this.game, -225, 122);
            this.windowPersonage.showPersonage(this.defaultFighterID);
            this.addChild(this.windowPersonage);
            this.windowCharacteristics = new Fabrique.WindowCharacteristics(this.game, -225, 375);
            this.windowCharacteristics.showCharacteristics(this.defaultFighterID);
            this.addChild(this.windowCharacteristics);
            GameData.Data.user_personage = GameData.Data.getPersonage(this.defaultFighterID);
        };
        PanelIcons.prototype.onChange = function (target, id) {
            //Utilits.Data.debugLog('Change [target/type]:', [target, id]);
            this.icons.forEach(function (iconsLine) {
                iconsLine.forEach(function (icon) {
                    icon.unselect();
                    if (icon.id === id)
                        icon.select();
                });
            });
            this.windowPersonage.changePersonage(id);
            this.windowCharacteristics.showCharacteristics(id);
            GameData.Data.user_personage = GameData.Data.getPersonage(id);
        };
        PanelIcons.prototype.show = function () {
            var tween = this.game.add.tween(this);
            tween.to({ x: 245, y: 150 }, 500, 'Linear');
            tween.start();
        };
        return PanelIcons;
    }(Phaser.Group));
    Fabrique.PanelIcons = PanelIcons;
})(Fabrique || (Fabrique = {}));
var MortalKombat;
(function (MortalKombat) {
    var Boot = /** @class */ (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            var _this = _super.call(this) || this;
            _this.name = Boot.Name;
            return _this;
        }
        /*
        * Загружаем ассеты необходимые для прелоадера
        */
        Boot.prototype.init = function () {
            // отключаем контекстное меню
            this.game.canvas.oncontextmenu = function (e) {
                e.preventDefault();
            };
        };
        Boot.prototype.preload = function () {
            this.game.load.image(Images.PreloaderImage, 'assets/images/' + Images.PreloaderImage);
            this.game.load.atlas(Atlases.LogoAtlas, 'assets/atlas/' + Atlases.LogoAtlas + '.png', 'assets/atlas/' + Atlases.LogoAtlas + '.json');
        };
        Boot.prototype.create = function () {
            var _this = this;
            this.game.state.start(MortalKombat.Preloader.Name, true, false, {
                nextStage: MortalKombat.Menu.Name,
                preloadHandler: function () {
                    Images.preloadList.forEach(function (assetName) {
                        _this.game.load.image(assetName, 'assets/images/' + assetName);
                    });
                    Atlases.preloadList.forEach(function (assetName) {
                        _this.game.load.atlas(assetName, 'assets/atlas/' + assetName + '.png', 'assets/atlas/' + assetName + '.json');
                    });
                    Sheet.preloadList.forEach(function (assetName) {
                        _this.game.load.spritesheet(assetName, 'assets/images/' + assetName, 255, 50);
                    });
                    Animations.preloadList.forEach(function (assetName) {
                        _this.game.load.json(assetName, 'assets/atlas/' + assetName);
                    });
                    Characteristics.preloadList.forEach(function (assetName) {
                        _this.game.load.json(assetName, 'assets/data/' + assetName);
                    });
                }
            });
        };
        Boot.prototype.shutdown = function () {
            //this.game.stage.removeChildren();
        };
        Boot.Name = 'booter';
        return Boot;
    }(Phaser.State));
    MortalKombat.Boot = Boot;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Preloader = /** @class */ (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            var _this = _super.call(this) || this;
            _this.name = Preloader.Name;
            _this.loadPercent = 0;
            return _this;
        }
        Preloader.prototype.init = function (config) {
            this.config = config;
        };
        Preloader.prototype.preload = function () {
            this.game.add.sprite(0, 0, Images.PreloaderImage);
            this.logo = this.game.add.sprite(0, 0, Atlases.LogoAtlas, "load_1.png");
            this.logo.x = (this.game.world.width / 2) - (this.logo.width / 2);
            this.logo.y = (this.game.world.height / 2) - (this.logo.height / 2);
            this.game.load.onLoadStart.add(this.onLoadStart, this);
            this.game.load.onFileComplete.add(this.onFileComplete, this);
            this.game.load.onLoadComplete.add(this.onLoadComplete, this);
            this.config.preloadHandler();
            if (this.game.load.totalQueuedFiles() === 0) {
                this.onLoadComplete();
            }
        };
        Preloader.prototype.onLoadStart = function () {
            this.preloadText = this.game.add.text(335, 600, "ЗАГРУЗКА 0%", { font: "24px Georgia", fill: "#505050" });
        };
        Preloader.prototype.onFileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            this.loadPercent = Math.round(progress * 0.1);
            if (this.loadPercent <= 0)
                this.loadPercent = 1;
            if (this.preloadText !== null) {
                this.logo.frameName = "load_" + this.loadPercent + ".png";
                this.preloadText.text = "ЗАГРУЗКА " + this.loadPercent + "0 %";
            }
        };
        Preloader.prototype.onLoadComplete = function () {
            this.logo.frameName = "load_" + this.loadPercent + ".png";
            this.game.stage.removeChildren();
            this.game.state.start(this.config.nextStage, true, false);
        };
        Preloader.Name = "preloader";
        return Preloader;
    }(Phaser.State));
    MortalKombat.Preloader = Preloader;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Tutorial = Fabrique.Tutorial;
    var Settings = Fabrique.Settings;
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            var _this = _super.call(this) || this;
            _this.name = Menu.Name;
            return _this;
        }
        Menu.prototype.create = function () {
            this.groupMenu = new Phaser.Group(this.game, this.stage);
            this.menuSprite = new Phaser.Sprite(this.game, -5, -5, Images.MenuImage);
            this.menuSprite.scale.set(1.025);
            this.groupMenu.addChild(this.menuSprite);
            this.tween = this.game.add.tween(this.menuSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0 }, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            this.videoSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Video1, 0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupMenu.addChild(this.videoSprite);
            var anim = this.videoSprite.animations.add(Atlases.Video1);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);
            this.createButtons();
            this.groupMenu.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        };
        Menu.prototype.shutdown = function () {
            this.tween.stop();
            this.tween = null;
            this.groupButtons.removeAll();
            this.groupMenu.removeAll();
            this.game.stage.removeChildren();
        };
        Menu.prototype.createButtons = function () {
            this.groupButtons = new Phaser.Group(this.game, this.groupMenu);
            this.groupButtons.x = -500;
            this.groupButtons.y = 0;
            this.groupButtons.visible = false;
            this.groupButtons.addChild(new Phaser.Sprite(this.game, 35, 80, Images.LogoImage));
            var buttonStart = new Phaser.Button(this.game, 75, 400, Sheet.ButtonStartNewGame, this.onButtonClick, this, 1, 2);
            buttonStart.name = Constants.START;
            this.groupButtons.addChild(buttonStart);
            var buttonSettings = new Phaser.Button(this.game, 75, 475, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            buttonSettings.name = Constants.SETTINGS;
            this.groupButtons.addChild(buttonSettings);
            var buttonInvite = new Phaser.Button(this.game, 75, 550, Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
            buttonInvite.name = Constants.INVITE;
            this.groupButtons.addChild(buttonInvite);
            this.continueGame();
            this.tutorial = new Tutorial(this.game, GameData.Data.tutorList[0]);
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupMenu.addChild(this.tutorial);
        };
        Menu.prototype.onCompleteVideo = function () {
            var _this = this;
            this.groupButtons.visible = true;
            var tweenButtons = this.game.add.tween(this.groupButtons);
            tweenButtons.to({ x: 0, y: 0 }, 500, 'Linear');
            tweenButtons.onComplete.add(function () {
                _this.tween.start();
                if (Config.settintTutorial === true)
                    _this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));
            }, this);
            tweenButtons.start();
        };
        Menu.prototype.onTweenComplete = function (event) {
            this.tween.start();
        };
        Menu.prototype.onButtonClick = function (event) {
            switch (event.name) {
                case Constants.START:
                    {
                        GameData.Data.initPersonages(this.game);
                        this.game.state.start(MortalKombat.Fighters.Name, true, false);
                        break;
                    }
                case Constants.CONTINUE:
                    {
                        this.game.state.start(MortalKombat.Tournament.Name, true, false);
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.settingsClose();
                        break;
                    }
                case Constants.INVITE:
                    {
                        break;
                    }
                default:
                    break;
            }
        };
        Menu.prototype.settingsCreate = function () {
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.settings = new Settings(this.game, this.groupMenu);
            this.settings.event.add(this.onButtonClick.bind(this));
        };
        Menu.prototype.settingsClose = function () {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupMenu.removeChild(this.settings);
            if (Config.settintTutorial === true) {
                var tweenTutorial = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175) }, 500, 'Linear');
                tweenTutorial.start();
            }
        };
        Menu.prototype.continueGame = function () {
            if (GameData.Data.tournamentProgress > 0) {
                var buttonStart = new Phaser.Button(this.game, 75, 475, Sheet.ButtonStartNewGame, this.onButtonClick, this, 1, 2);
                buttonStart.name = Constants.START;
                this.groupButtons.addChild(buttonStart);
                var buttonSettings = new Phaser.Button(this.game, 75, 550, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
                buttonSettings.name = Constants.SETTINGS;
                this.groupButtons.addChild(buttonSettings);
                var buttonInvite = new Phaser.Button(this.game, 75, 625, Sheet.ButtonInvite, this.onButtonClick, this, 1, 2, 2, 2);
                buttonInvite.name = Constants.INVITE;
                this.groupButtons.addChild(buttonInvite);
                var buttonContinue = new Phaser.Button(this.game, 75, 400, Sheet.ButtonСontinueGame, this.onButtonClick, this, 1, 2);
                buttonContinue.name = Constants.CONTINUE;
                this.groupButtons.addChild(buttonContinue);
            }
        };
        Menu.Name = "menu";
        return Menu;
    }(Phaser.State));
    MortalKombat.Menu = Menu;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Tutorial = Fabrique.Tutorial;
    var Settings = Fabrique.Settings;
    var Title = Fabrique.Title;
    var PanelIcons = Fabrique.PanelIcons;
    var Fighters = /** @class */ (function (_super) {
        __extends(Fighters, _super);
        function Fighters() {
            var _this = _super.call(this) || this;
            _this.name = MortalKombat.Menu.Name;
            return _this;
        }
        Fighters.prototype.create = function () {
            this.groupFighters = new Phaser.Group(this.game, this.stage);
            this.fightersSprite = new Phaser.Sprite(this.game, -5, -5, Images.FightersImage);
            this.fightersSprite.scale.set(1.025);
            this.groupFighters.addChild(this.fightersSprite);
            this.tween = this.game.add.tween(this.fightersSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0 }, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            this.videoSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Video2, 0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupFighters.addChild(this.videoSprite);
            var anim = this.videoSprite.animations.add(Atlases.Video2);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);
            this.createContent();
            this.groupFighters.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        };
        Fighters.prototype.shutdown = function () {
            this.tween.stop();
            this.tween = null;
            this.title.removeChildren();
            this.panelIcons.removeChildren();
            this.panelIcons.removeAll();
            this.tutorial.removeChildren();
            this.groupFighters.removeChildren();
            this.groupFighters.removeAll();
            this.game.stage.removeChildren();
        };
        Fighters.prototype.onCompleteVideo = function () {
            this.tween.start();
            this.title.show();
            if (Config.settintTutorial === true)
                this.tutorial.show((Constants.GAME_WIDTH / 2), (Constants.GAME_HEIGHT - 175));
            this.backMenuButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonBackMenuMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backMenuButton.name = Constants.BACK_MENU;
            this.groupFighters.addChild(this.backMenuButton);
            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), 5, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupFighters.addChild(this.settingsButton);
            this.backHalpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backHalpButton.name = Constants.HELP;
            this.groupFighters.addChild(this.backHalpButton);
            this.selectButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), (Constants.GAME_HEIGHT - 50), Sheet.ButtonSelectFighter, this.onButtonClick, this, 1, 2, 2, 2);
            this.selectButton.name = Constants.SELECT_FIGHTER;
            this.groupFighters.addChild(this.selectButton);
            this.panelIcons.show();
        };
        Fighters.prototype.onTweenComplete = function (event) {
            this.tween.start();
        };
        Fighters.prototype.createContent = function () {
            /* title */
            this.title = new Title(this.game, 0, -50, 'ВЫБОР БОЙЦА');
            this.groupFighters.addChild(this.title);
            /* panel icons */
            this.panelIcons = new PanelIcons(this.game, this.groupFighters);
            /* tutorial */
            this.tutorial = new Tutorial(this.game, GameData.Data.tutorList[1]);
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.groupFighters.addChild(this.tutorial);
        };
        Fighters.prototype.onButtonClick = function (event) {
            switch (event.name) {
                case Constants.BACK_MENU:
                    {
                        this.game.state.start(MortalKombat.Menu.Name, true, false);
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.settingsClose();
                        break;
                    }
                case Constants.HELP:
                    {
                        break;
                    }
                case Constants.SELECT_FIGHTER:
                    {
                        this.game.state.start(MortalKombat.Tournament.Name, true, false);
                        break;
                    }
                default:
                    break;
            }
        };
        Fighters.prototype.settingsCreate = function () {
            this.tutorial.x = Constants.GAME_WIDTH;
            this.tutorial.y = (Constants.GAME_HEIGHT - 175);
            this.settings = new Settings(this.game, this.groupFighters);
            this.settings.event.add(this.onButtonClick.bind(this));
        };
        Fighters.prototype.settingsClose = function () {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupFighters.removeChild(this.settings);
            if (Config.settintTutorial === true) {
                var tweenTutorial = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: (Constants.GAME_WIDTH / 2), y: (Constants.GAME_HEIGHT - 175) }, 500, 'Linear');
                tweenTutorial.start();
            }
        };
        Fighters.Name = "fighters";
        return Fighters;
    }(Phaser.State));
    MortalKombat.Fighters = Fighters;
})(MortalKombat || (MortalKombat = {}));
var MortalKombat;
(function (MortalKombat) {
    var Tutorial = Fabrique.Tutorial;
    var Settings = Fabrique.Settings;
    var Title = Fabrique.Title;
    var Tower = Fabrique.Tower;
    var UpgradeCharacteristics = Fabrique.UpgradeCharacteristics;
    var Tournament = /** @class */ (function (_super) {
        __extends(Tournament, _super);
        function Tournament() {
            var _this = _super.call(this) || this;
            _this.name = Tournament.Name;
            return _this;
        }
        Tournament.prototype.create = function () {
            this.groupContent = new Phaser.Group(this.game, this.stage);
            this.backgroundSprite = new Phaser.Sprite(this.game, -5, -5, Images.UpgradeImage);
            this.backgroundSprite.scale.set(1.025);
            this.groupContent.addChild(this.backgroundSprite);
            this.tween = this.game.add.tween(this.backgroundSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0 }, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);
            this.videoSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Video3, 0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupContent.addChild(this.videoSprite);
            var anim = this.videoSprite.animations.add(Atlases.Video3);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);
            if (GameData.Data.tournamentProgress === 0)
                GameData.Data.initNewGame();
            this.createContent();
            this.groupContent.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));
        };
        Tournament.prototype.shutdown = function () {
            this.tween.stop();
            this.tween = null;
            this.title.removeChildren();
            this.tower.removeChildren();
            this.tower.removeAll();
            this.tutorial.removeChildren();
            this.userUpgradeCharacteristics.removeChildren();
            this.userUpgradeCharacteristics.removeAll();
            this.enemyUpgradeCharacteristics.removeChildren();
            this.enemyUpgradeCharacteristics.removeAll();
            this.groupContent.removeAll();
            this.game.stage.removeChildren();
        };
        Tournament.prototype.onCompleteVideo = function () {
            this.tween.start();
            this.title.show();
            if (Config.settintTutorial === true)
                this.tutorial.show(0, 150);
            this.tower.show(this.tower.x, 0);
            this.userUpgradeCharacteristics.show(50, this.userUpgradeCharacteristics.y);
            this.enemyUpgradeCharacteristics.show(600, this.enemyUpgradeCharacteristics.y);
            this.backButton = new Phaser.Button(this.game, -25, 5, Sheet.ButtonBackMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backButton.name = Constants.BACK_MENU;
            this.groupContent.addChild(this.backButton);
            this.settingsButton = new Phaser.Button(this.game, (Constants.GAME_WIDTH / 2) - (255 / 2), 5, Sheet.ButtonSettings, this.onButtonClick, this, 1, 2, 2, 2);
            this.settingsButton.name = Constants.SETTINGS;
            this.groupContent.addChild(this.settingsButton);
            this.backHalpButton = new Phaser.Button(this.game, Constants.GAME_WIDTH - 230, 5, Sheet.ButtonHelpMini, this.onButtonClick, this, 1, 2, 2, 2);
            this.backHalpButton.name = Constants.HELP;
            this.groupContent.addChild(this.backHalpButton);
        };
        Tournament.prototype.onTweenComplete = function (event) {
            this.tween.start();
        };
        Tournament.prototype.createContent = function () {
            /* tower */
            this.tower = new Tower(this.game);
            this.tower.x = (Constants.GAME_HEIGHT / 2) - (this.tower.width / 3);
            this.tower.y = Constants.GAME_WIDTH;
            this.groupContent.addChild(this.tower);
            /* title */
            this.title = new Title(this.game, 0, -50, 'ТУРНИР');
            this.groupContent.addChild(this.title);
            /* tutorial */
            this.tutorial = new Tutorial(this.game, GameData.Data.tutorList[1]);
            this.tutorial.x = -500;
            this.tutorial.y = 150;
            this.groupContent.addChild(this.tutorial);
            /* Upgrade */
            this.userUpgradeCharacteristics = new UpgradeCharacteristics(this.game, true);
            this.userUpgradeCharacteristics.x = -500;
            this.userUpgradeCharacteristics.y = 300;
            this.groupContent.addChild(this.userUpgradeCharacteristics);
            this.enemyUpgradeCharacteristics = new UpgradeCharacteristics(this.game, false);
            this.enemyUpgradeCharacteristics.x = Constants.GAME_WIDTH + 500;
            this.enemyUpgradeCharacteristics.y = 300;
            this.groupContent.addChild(this.enemyUpgradeCharacteristics);
            Utilits.Data.debugLog("user_personage", GameData.Data.user_personage);
        };
        Tournament.prototype.onButtonClick = function (event) {
            switch (event.name) {
                case Constants.BACK_MENU:
                    {
                        if (GameData.Data.tournamentProgress === 0)
                            this.game.state.start(MortalKombat.Fighters.Name, true, false);
                        else
                            this.game.state.start(MortalKombat.Menu.Name, true, false);
                        break;
                    }
                case Constants.SETTINGS:
                    {
                        this.settingsCreate();
                        break;
                    }
                case Constants.SETTINGS_CLOSE:
                    {
                        this.settingsClose();
                        break;
                    }
                case Constants.HELP:
                    {
                        break;
                    }
                default:
                    break;
            }
        };
        Tournament.prototype.settingsCreate = function () {
            this.tutorial.x = -500;
            this.tutorial.y = 150;
            this.settings = new Settings(this.game, this.groupContent);
            this.settings.event.add(this.onButtonClick.bind(this));
        };
        Tournament.prototype.settingsClose = function () {
            this.settings.removeChildren();
            this.settings.removeAll();
            this.groupContent.removeChild(this.settings);
            if (Config.settintTutorial === true) {
                var tweenTutorial = this.game.add.tween(this.tutorial);
                tweenTutorial.to({ x: 0, y: 150 }, 500, 'Linear');
                tweenTutorial.start();
            }
        };
        Tournament.Name = "tournament";
        return Tournament;
    }(Phaser.State));
    MortalKombat.Tournament = Tournament;
})(MortalKombat || (MortalKombat = {}));
/// <reference path="..\node_modules\phaser-ce\typescript\phaser.d.ts" />
/// <reference path="Data\Constants.ts" />
/// <reference path="Data\Config.ts" />
/// <reference path="Data\Utilits.ts" />
/// <reference path="Data\Images.ts" />
/// <reference path="Data\Atlases.ts" />
/// <reference path="Data\Sheets.ts" />
/// <reference path="Data\Characteristics.ts" />
/// <reference path="Data\Animations.ts" />
/// <reference path="Data\GameData.ts" />
/// <reference path="Fabrique\Objects\Tutorial.ts" />
/// <reference path="Fabrique\Objects\Settings.ts" />
/// <reference path="Fabrique\Objects\Title.ts" />
/// <reference path="Fabrique\Objects\Tower.ts" />
/// <reference path="Fabrique\Objects\AnimationFighter.ts" />
/// <reference path="Fabrique\Objects\Icon.ts" />
/// <reference path="Fabrique\Objects\WindowPersonage.ts" />
/// <reference path="Fabrique\Objects\WindowCharacteristics.ts" />
/// <reference path="Fabrique\Objects\UpgradeCharacteristics.ts" />
/// <reference path="Fabrique\Objects\PanelIcons.ts" />
/// <reference path="States\Boot.ts" />
/// <reference path="States\Preloader.ts" />
/// <reference path="States\Menu.ts" />
/// <reference path="States\Fighters.ts" />
/// <reference path="States\Tournament.ts" />
/// <reference path="app.ts" />
