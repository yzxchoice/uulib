// TypeScript file
interface uiData {
    id: string,
    name: string,
    url?: string
}
/**
 * 声音组件
 */
class SoundButton extends eui.Button implements IUUBase {
    data: uiData;
    layerName:string = '声音'
    static uuType = UUType.SOUND;
    constructor () {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        this.init(); 
        // this.bindHandler();
    }

    private init () {

    }
}