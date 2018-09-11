// TypeScript file
/**
 * 图片组件
 */
class UUImage extends eui.Image implements IUUBase {
    data: UUData<IResource>;
    layerName:string = '图片'
    static uuType = UUType.IMAGE;
}