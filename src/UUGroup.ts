class UUGroup extends eui.Group implements IUUBase, IGroup {
    static uuType = UUType.GROUP;
    // base 
    name: string = '';    
    data: UUData<IGroup>;
    layerName: string = '容器';
    isDraw: boolean = false;
    // props默认值
    width: number = 200;
    height: number = 200;

    constructor(props) {
        super();
        for(let key in props) {
            this[key] = props[key];
        }
    }
}