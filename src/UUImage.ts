// TypeScript file
/**
 * 图片组件
 */
class UUImage extends eui.Image implements IUUBase, IImage {
    static uuType = UUType.IMAGE;
    // base
    data: UUData<IResource>;
    layerName: string = '图片';
    isDraw: boolean = false;
    
}