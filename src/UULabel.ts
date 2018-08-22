// TypeScript file
interface ILabel extends IUUBase {
    text: string,
    textColor?: number,
    size?: number,
    lineSpacing?: number,
    textAlign?: string
}
/**
 * 文字组件
 */
class UULabel extends eui.Label implements ILabel {
    data: any;
    layerName:string = '文字'

    text: string = '双击此处进行编辑'

    textColor: number = 0xff000

    size: number = 16

    lineSpacing: 12

    textAlign: string = egret.HorizontalAlign.JUSTIFY

    name: string = ''

    static uuType = UUType.TEXT;

    constructor () {
        super();
    }

    
}