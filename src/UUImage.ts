// TypeScript file
/**
 * 图片组件
 */
class UUImage extends eui.Image implements IUUBase {
    data: any;
    layerName:string = '图片'
    static uuType = UUType.IMAGE;
}