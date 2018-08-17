// TypeScript file
enum UUType {
    /**
     * 文本
     */
    TEXT = 1,
    /**
     * 图片
     */
    IMAGE = 2,
    /**
     * 音频
     */
    SOUND = 18,
    /**
     * 背景
     */
    BACKGROUND = 99,
    /**
     * 转盘
     */
    CIRCLE_SECTOR = 101,
    /**
     * 容器框
     */
    FRAME = 102
}

interface IUUBase {
    /**
     * 组件名称
     */
    name?: string,
    /**
     * 组件数据
     */
    data: any
}



class LayerSet {
    static layerClass: any;
    constructor () {
        throw new Error('can not create a instance')
    }

    static createInstance (layerClass, prop) {
        var translater = new layerClass(prop);
        var obj = prop;
        for (let key in obj) {
            translater[key] = obj[key];
        }

        return translater;
    }

    static getLayer (list, type: number) {
        return list.filter( (item) => {
            return item.uuType == type;
        })
    }

    // static createInstance<A>(c: new () => A, prop: any): A {
    //     var translater = new c();
    //     for (let key in prop) {
    //         translater[key] = prop[key];
    //     }
    //     return translater;
    // }
}
