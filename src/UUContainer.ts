// TypeScript file
class UUContainer extends eui.Group implements IUUBase {
    data: any;
    items = [];
    width:number = 300;
    height:number = 300;
    static uuType = UUType.FRAME;
    
    constructor () {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        this.init(); 
    }

    private init () {
        this.width = 300;
        this.height = 300;

        var bg:egret.Shape = new egret.Shape;
        bg.graphics.lineStyle(1,0x999999);
        bg.graphics.beginFill(0xffffff,1);
        bg.graphics.drawRect(0, 0, this.width, this.height);
        bg.graphics.endFill();
        this.addChild(bg);
    }

    getProps () {
        return {
            width: this.width | 300,
            height: this.height | 300
        }
    }
}