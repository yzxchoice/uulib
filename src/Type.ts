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
    FRAME = 102,
    /**
     * 轮播图组件
     */
    SLIDESHOW = 103,

    CARD = 112
}

/**
 * 资源对象
 */
interface IResource {
    id?: string,
    name?: string,
    text?: string,
    url?: string
}

interface IUUBase {
    /**
     * 组件名称
     */
    name?: string,
    /**
     * 组件数据
     */
    data?: any,
    /**
     * 图层名称
     */
    layerName?: string,

    getProps? (): any,

    /**
     * 资源类组件 
     */
    texture?: any
}

interface ILabel {
    text: string,
    textColor?: number,
    size?: number,
    fontFamily?: string,
    textAlign?: string,
    lineSpacing?: number
}

interface IQuestions {
    items: Array<IQuestion>,
    toItems: Array<IQuestion>
}

interface IQuestion {
    select: boolean | string,
    resource: IResource
}

interface CircleSectorItem {
    text: string;
    url: string;
}

interface ICircleSector {
    awards: Array<CircleSectorItem>;
}

interface SlideshowItem {
    url: string;
}
interface ISlideshow {
    awards: Array<SlideshowItem>;
}

interface IItems {
    awards: Array<IResource>
}

interface ITrigger {
    delay: number,
    eventType: number,
    /**
     * 触发对象ID
     */
    sourceId: string,
    sourceType?: string,
    /**
     * 目标对象ID
     */
    targetId: string,
    targetState?: number,
    targetType?: string
}


interface IProperty {
    /**
     * 事件对象
     */
    triggerGroup: Array<ITrigger>,
    /**
     * 页面背景音
     */
    music: IResource
}

interface UUData<T> {
    id: string,
    name: string,
    /**
     * 页面ID
     */
    pageId: number,
    /**
     * 图层类型
     */
    type: number,
    /**
     * 矩阵
     */
    matrix: Matrix,
    /**
     * 图片url
     */
    src?: string,
    /**
     * 显示属性
     */
    props: T,
    /**
     * 事件等操作
     */
    properties?: IProperty,

    /**
     * 组件音效
     */
    sound?: IResource
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

    static identity<T> (arg: T): T {
        return arg;
    }

    // static getInstance () {
    //     let m: UUData<ILabel> = this.identity;
    // }

    // static createInstance<A>(c: new () => A, prop: any): A {
    //     var translater = new c();
    //     for (let key in prop) {
    //         translater[key] = prop[key];
    //     }
    //     return translater;
    // }
}
