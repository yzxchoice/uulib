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
    /**
     * 老虎机组件
     */
    SLOT_MACHINE = 104,

    CARD = 112
}

/**
 * 动画类型
 */
enum animType {
    /**
     * 直线
     */
    line = 1,
    /**
     * 圆
     */
    circle = 2,
    /**
     * 三次贝塞尔曲线
     */
    curve = 3
}

/**
 * 基础资源对象
 */
interface IResource {
    id?: string,
    name?: string,
    text?: string,
    /**
     * 图片地址
     */
    url?: string
}

/**
 * 自定义组件绑定数据实体
 */
interface IComponentData {
    awards: Array<IResource>
    bgColor?: number | string,
    bgurl?: string
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


interface ISlotMachine {
    awards: Array<SlideshowItem>;
    bgColor: number | string;
    bdUrl: string;
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

/**
 * 动画对象
 */
interface ITween {
    /**
     * 动画类型
     */
    type: number,
    /**
     * 开始点
     */
    start?: egret.Point,
    /**
     * 控制点
     */
    control?: egret.Point,
    /**
     * 结束点
     */
    end?: egret.Point,
    /**
     * 动画音效
     */
    music?: IResource
}


interface IProperty {
    /**
     * 事件对象
     */
    triggerGroup?: Array<ITrigger>,
    /**
     * 页面背景音
     */
    music?: IResource,
    /**
     * 动画对象
     */
    anims?: Array<ITween>
}

/**
 * prop 对象实体
 */
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
