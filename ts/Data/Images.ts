class Images {
    public static PreloaderImage: string = 'preloader.jpg';

    public static BackgroundImage: string = 'background.png';
    public static MenuImage: string = 'menu.png';
    public static LogoImage: string = 'logo.png';
    public static FightersImage: string = 'fighters.png';
    public static UpgradeImage: string = 'upgrade.png';
    public static ButtonOn: string = 'buttons_on.png';
    public static ButtonOff: string = 'buttons_off.png';
    public static Title: string = 'title.png';
    public static ButtonLeft: string = 'button_left.png';
    public static ButtonRight: string ='button_right.png';
    
    public static preloadList:Array<string> = [
        Images.BackgroundImage,
        Images.MenuImage,
        Images.LogoImage,
        Images.FightersImage,
        Images.UpgradeImage,
        Images.ButtonOn,
        Images.ButtonOff,
        Images.Title,
        Images.ButtonLeft,
        Images.ButtonRight
    ]; 
}