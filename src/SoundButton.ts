// TypeScript file
interface uiData {
    id: string,
    name: string,
    url?: string
}
class SoundButton extends eui.Button implements BaseUI {
    data: uiData;
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