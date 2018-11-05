// TypeScript file

/**
 * 文字组件
 */
class UULabel extends eui.Label implements IUUBase, ILabel {

    static uuType = UUType.TEXT;
    // base
    name: string = '';    
    data: UUData<ILabel>;
    layerName: string = '文字';
    isDraw: boolean = false;
    // props默认值
    text: string = '请输入文本'
    textColor: number = 0x000000
    size: number = 40
    fontFamily: string = 'Arial'
    lineSpacing: 12
    textAlign: string = egret.HorizontalAlign.JUSTIFY

    constructor(props = {}) {
        super();
        for(let key in props) {
            this[key] = props[key];
        }
    }
}