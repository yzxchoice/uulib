// TypeScript file

/**
 * 文字组件
 */
class UULabel extends eui.Label implements IUUBase {
    data: UUData<ILabel>;
    layerName:string = '文字'

    text: string = '请输入文本'

    textColor: number = 0x000000

    size: number = 40
    fontFamily: string = 'Arial'

    lineSpacing: 12

    textAlign: string = egret.HorizontalAlign.JUSTIFY

    name: string = ''

    static uuType = UUType.TEXT;
    

    constructor () {
        super();
    }

    getProps (): ILabel {
        return {
            text: this.text,
            textColor: this.textColor,
            size: this.size,
            fontFamily: this.fontFamily
            // textAlign: this.textAlign,
            // lineSpacing: this.lineSpacing
        }
    }

    setProps (data: UUData<ILabel>) {
        this.text = data.props.text;
        this.textColor = data.props.textColor;
        this.size = data.props.size;
        this.fontFamily = data.props.fontFamily;
    }

    redraw(){

    }
}