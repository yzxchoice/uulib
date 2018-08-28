/**
 * transform 枚举
 */
declare enum ControlType {
    SCALE = 1,
    SCALE_X = 2,
    SCALE_Y = 3,
    SCALE_UNIFORM = 4,
    ROTATE = 5,
    TRANSLATE = 6,
    REGISTRATION = 7,
    SKEW_X = 8,
    SKEW_Y = 9,
    BORDER = 10,
    TARGET = 11,
    ROTATE_SCALE = 12,
    SHAPE_CIRCLE = 1,
    SHAPE_SQUARE = 2,
    SHAPE_BORDER = 3,
}
declare class Control {
    protected tool: any;
    private type;
    protected x: number;
    protected y: number;
    private offsetX;
    private offsetY;
    hitTestTarget: boolean;
    protected size: number;
    protected shape: any;
    private u;
    private v;
    dynamicUV: boolean;
    protected drawCallback: any;
    private transformCallback;
    constructor(type?: any, u?: any, v?: any, offsetX?: number, offsetY?: number, size?: number);
    setDefaultShape(): void;
    /**
     * 更新操作框坐标
     */
    updatePosition(): void;
    /**
     * 画操作框形状
     */
    draw(ctx: any): void;
    contains(x: number, y: number): any;
}
declare enum UUType {
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
}
interface IUUBase {
    /**
     * 组件名称
     */
    name?: string;
    /**
     * 组件数据
     */
    data?: any;
    /**
     * 图层名称
     */
    layerName?: string;
    getProps?(): any;
    /**
     * 资源类组件
     */
    texture?: any;
}
interface ILabel {
    text: string;
    textColor?: number;
    size?: number;
    fontFamily?: string;
    textAlign?: string;
    lineSpacing?: number;
}
interface ITrigger {
    delay: number;
    eventType: number;
    /**
     * 触发对象ID
     */
    sourceId: string;
    sourceType?: string;
    /**
     * 目标对象ID
     */
    targetId: string;
    targetState?: number;
    targetType?: string;
}
/**
 * 资源对象
 */
interface IResource {
    id?: string;
    name?: string;
    url: string;
}
interface IProperty {
    /**
     * 事件对象
     */
    triggerGroup: Array<ITrigger>;
    /**
     * 页面背景音
     */
    music: IResource;
}
interface UUData<T> {
    id: string;
    name: string;
    /**
     * 页面ID
     */
    pageId: number;
    /**
     * 图层类型
     */
    type: number;
    /**
     * 矩阵
     */
    matrix: Matrix;
    /**
     * 图片url
     */
    src?: string;
    /**
     * 显示属性
     */
    props: T;
    /**
     * 事件等操作
     */
    properties?: IProperty;
    /**
     * 组件音效
     */
    sound?: IResource;
}
declare class LayerSet {
    static layerClass: any;
    constructor();
    static createInstance(layerClass: any, prop: any): any;
    static getLayer(list: any, type: number): any;
    static identity<T>(arg: T): T;
}
interface uiData {
    id: string;
    name: string;
    url?: string;
}
/**
 * 声音组件
 */
declare class SoundButton extends eui.Button implements IUUBase {
    data: uiData;
    layerName: string;
    static uuType: UUType;
    constructor();
    private onAddToStage(event);
    private init();
}
/**
 * 自定义操作框
 */
declare class ControlSet {
    static controlClass: any;
    constructor();
    static getStandard(): any[];
    static getScaler(): any[];
    static getUniformScaler(): any[];
    static getScalerWithRotate(): any[];
    static getDynamic(): any[];
}
declare class EgretControl extends Control {
    private controlShape;
    constructor(type: any, u?: any, v?: any, offsetX?: number, offsetY?: number, size?: number);
    undraw(): void;
    draw(container: any): void;
}
interface IUUContainer {
    /**
     * 父容器
     */
    container: any;
    /**
     * 释放
     */
    dispose(): void;
    /**
     * 呈现
     */
    draw(container: any): void;
}
interface MatrixType {
    a: number;
    b: number;
    c: number;
    d: number;
    x: number;
    y: number;
}
/**
 * 矩阵对象
 */
declare class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    x: number;
    y: number;
    static temp: Matrix;
    constructor(a?: number, b?: number, c?: number, d?: number, x?: number, y?: number);
    toString(): string;
    equals(m: MatrixType): boolean;
    identity(): void;
    clone(): Matrix;
    clone1(): egret.Matrix;
    copyFrom(m: MatrixType): void;
    /**
     * 旋转
     * angle 弧度
     */
    rotate(angle: number): void;
    /**
     * 位移
     */
    translate(x: number, y: number): void;
    concat(m: MatrixType): void;
    invert(): void;
    getRotationX(): number;
    getRotationY(): number;
    getTransformedX(x: number, y: number): number;
    getTransformedY(x: number, y: number): number;
    /**
     * 缩放
     */
    scale(x: number, y: number): void;
    containsPoint(x: number, y: number, w: number, h: number): boolean;
}
declare class Mouse {
    static x: number;
    static y: number;
    static START: string;
    static MOVE: string;
    static END: string;
    constructor();
    /**
     * 鼠标点击的坐标
     */
    static get(event: egret.TouchEvent, elem: eui.Group): typeof Mouse;
}
/**
 * 可操作对象容器
 */
declare class Picture {
    image: any;
    transform: any;
    b: boolean;
    constructor(image: any, m: any, b?: boolean);
    draw(container: any): void;
    undraw(container: any): void;
}
/**
 * 预览
 */
declare class Preview extends eui.Group {
    private displayList;
    tool: any;
    pages: any[];
    private pageIndex;
    constructor();
    private onAddToStageInit(event);
    private bindHandlers();
    private initEui();
    private displayGroup;
    private getPages();
    private pre(event);
    private next(event);
    private init();
    setupTool(): void;
    private getFrame();
    down(event: egret.TouchEvent): boolean;
    move(event: egret.TouchEvent): void;
    up(event: egret.TouchEvent): void;
    findControlByType(type: any): any;
    applyDynamicControls(event: any): void;
    getDynamicControl(): any;
    containsPoint(x: number, y: number): boolean;
    private getDisplayByName(name);
    inter(): egret.Rectangle;
    selectImage(x: number, y: number): boolean;
    renderResources(index: number): Promise<void>;
    render(): void;
    clear(): void;
    reset(): void;
    drawDisplayList(): void;
}
/**
 * 轮播图组件
 */
declare class Slideshow extends eui.Group implements IUUBase, IUUContainer {
    data: any;
    layerName: string;
    container: any;
    width: number;
    height: number;
    static uuType: UUType;
    private activeIndex;
    private duration;
    private delayed;
    draw(): void;
    dispose(): void;
    awards: {
        url: string;
    }[];
    private imgBox;
    constructor();
    getProps(): {
        awards: {
            url: string;
        }[];
    };
    setProps(d: any): void;
    private onAddToStage(event);
    private onRemoveFromStage(event);
    private init();
    private onclickLeft();
    private onclickRight();
    private resetLeft();
    private resetRight();
    private resetImgBox();
}
/**
 * 转盘组件
 */
declare class CircleSector extends eui.Group implements IUUBase, IUUContainer {
    data: any;
    layerName: string;
    container: any;
    width: number;
    height: number;
    static uuType: UUType;
    draw(): void;
    awards: {
        text: string;
        url: string;
    }[];
    private main;
    constructor();
    getProps(): {
        awards: {
            text: string;
            url: string;
        }[];
    };
    setProps(d: any): void;
    private onAddToStage(event);
    private onRemoveFromStage(event);
    private init();
    redraw(): void;
    drawSector(): Promise<void>;
    private down(event);
    private rnd(n, m);
    rotateFn(item: number, txt: string): void;
    dispose(): void;
    private onComplete(param1);
    /**
     * 画弧形方法
     */
    drawArc(mc: egret.Shape, x?: number, y?: number, r?: number, angle?: number, startFrom?: number, color?: number): void;
}
declare class Transformable {
    width: number;
    height: number;
    matrix: any;
    owner: any;
    changed: any;
    constructor(width: number, height: number, matrix: any, owner: any);
}
/**
 * 操作基类
 */
declare class TransformTool {
    protected container: any;
    target: any;
    preTarget: any;
    targetMask: egret.Shape;
    startMatrix: Matrix;
    regStartU: number;
    regStartV: number;
    private startX;
    private startY;
    preMatrix: Matrix;
    postMatrix: Matrix;
    endMatrix: Matrix;
    regEndU: number;
    regEndV: number;
    private endX;
    private endY;
    private dU;
    private dV;
    regX: number;
    regY: number;
    private inv;
    private control;
    protected controls: any;
    private fillStyle;
    private strokeStyle;
    private lineWidth;
    constructor(container: any);
    addMask(): void;
    removeMask(): void;
    setPreTarget(preTarget: any): void;
    setTarget(target: any): void;
    updateFromTarget(): void;
    setControls(controls: any): void;
    updateControls(): void;
    getControlAt(x: number, y: number): any;
    draw(): void;
    undraw(): void;
    shouldDraw(): boolean;
    start(x: number, y: number, control?: any): boolean;
    move(x: number, y: number): void;
    scale(s: number): void;
    translate(x: number, y: number): void;
    rotate(r: number): void;
    end(): void;
    updateMoveValues(x: number, y: number): void;
    applyControl(): void;
    updateRegistration(): void;
    updateTransform(): void;
    applyRegistrationOffset(): void;
    updateTarget(): void;
    commit(): void;
    sanitizeStartMatrix(): void;
}
/**
 * 组件基类
 */
declare class BaseUI {
    /**
     * 绑定数据
     */
    data: any;
}
declare class Utils {
    constructor();
    static getComs(): (typeof SoundButton | typeof UULabel | typeof UUImage | typeof UUContainer | typeof CircleSector | typeof Slideshow)[];
    static getTexture(url: string): Promise<{}>;
    static getSound(url: string): Promise<{}>;
    static trans(arr: Array<any>, templateId: number): {
        "groups": {
            "keys": string;
            "name": string;
        }[];
        "resources": {
            "url": string;
            "type": string;
            "name": string;
        }[];
    };
}
/**
 * 背景
 */
declare class UUBackground extends eui.Image implements IUUBase {
    data: any;
    layerName: string;
    static uuType: UUType;
}
/**
 * 图形基类
 */
declare class UUBitmap extends egret.Bitmap implements IUUBase {
    data: any;
    layerName: string;
}
declare class UUContainer extends eui.Group implements IUUBase {
    data: any;
    items: any[];
    width: number;
    height: number;
    static uuType: UUType;
    constructor();
    private onAddToStage(event);
    private init();
    getProps(): {
        width: number;
        height: number;
    };
}
/**
 * 图片组件
 */
declare class UUImage extends eui.Image implements IUUBase {
    data: any;
    layerName: string;
    static uuType: UUType;
}
/**
 * 文字组件
 */
declare class UULabel extends eui.Label implements IUUBase {
    data: UUData<ILabel>;
    layerName: string;
    text: string;
    textColor: number;
    size: number;
    fontFamily: string;
    lineSpacing: 12;
    textAlign: string;
    name: string;
    static uuType: UUType;
    constructor();
    getProps(): ILabel;
    setProps(data: UUData<ILabel>): void;
}
declare class UURequest {
    constructor();
}
