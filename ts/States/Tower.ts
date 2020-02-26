module MortalKombat {

    import Tutorial = Fabrique.Tutorial;
    import Settings = Fabrique.Settings;

    export class Tower extends Phaser.State{
        public static Name: string = "tower";
        public name: string = Tower.Name;

        private groupStore: Phaser.Group;
        private videoSprite:Phaser.Sprite;
        private storeSprite:Phaser.Sprite;
        private tween:Phaser.Tween;

        constructor() {
            super();
        }

        public create() {
            this.groupStore = new Phaser.Group(this.game, this.stage);

            this.storeSprite = new Phaser.Sprite(this.game, -5,-5, Images.UpgradeImage);
            this.storeSprite.scale.set(1.025);
            this.groupStore.addChild(this.storeSprite);

            this.tween = this.game.add.tween(this.storeSprite);
            this.tween.to({ x: -200, y: -5 }, 20000, 'Linear');
            this.tween.to({ x: 0, y: 0}, 20000, 'Linear');
            this.tween.onComplete.add(this.onTweenComplete, this);

            this.videoSprite = new Phaser.Sprite(this.game,0,0,Atlases.Video3,0);
            this.videoSprite.scale.set(2.6, 2.6);
            this.groupStore.addChild(this.videoSprite);

            let anim: Phaser.Animation = this.videoSprite.animations.add(Atlases.Video3);
            anim.onComplete.add(this.onCompleteVideo, this);
            anim.play(15, false, true);

            this.groupStore.addChild(new Phaser.Sprite(this.game, 0, 0, Images.BackgroundImage));

        }

        public shutdown(){
            this.groupStore.removeAll();
        }

        private onCompleteVideo():void {
            this.tween.start();
        }

        private onTweenComplete(event:any):void {
            this.tween.start();
        }

    }

}