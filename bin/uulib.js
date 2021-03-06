var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * transform 枚举
 */
var ControlType;
(function (ControlType) {
    ControlType[ControlType["SCALE"] = 1] = "SCALE";
    ControlType[ControlType["SCALE_X"] = 2] = "SCALE_X";
    ControlType[ControlType["SCALE_Y"] = 3] = "SCALE_Y";
    ControlType[ControlType["SCALE_UNIFORM"] = 4] = "SCALE_UNIFORM";
    ControlType[ControlType["ROTATE"] = 5] = "ROTATE";
    ControlType[ControlType["TRANSLATE"] = 6] = "TRANSLATE";
    ControlType[ControlType["REGISTRATION"] = 7] = "REGISTRATION";
    ControlType[ControlType["SKEW_X"] = 8] = "SKEW_X";
    ControlType[ControlType["SKEW_Y"] = 9] = "SKEW_Y";
    ControlType[ControlType["BORDER"] = 10] = "BORDER";
    ControlType[ControlType["TARGET"] = 11] = "TARGET";
    ControlType[ControlType["ROTATE_SCALE"] = 12] = "ROTATE_SCALE";
    ControlType[ControlType["SHAPE_CIRCLE"] = 1] = "SHAPE_CIRCLE";
    ControlType[ControlType["SHAPE_SQUARE"] = 2] = "SHAPE_SQUARE";
    ControlType[ControlType["SHAPE_BORDER"] = 3] = "SHAPE_BORDER";
})(ControlType || (ControlType = {}));
var Control = (function () {
    function Control(type, u, v, offsetX, offsetY, size) {
        this.hitTestTarget = false;
        this.shape = null;
        this.dynamicUV = false;
        this.transformCallback = null;
        this.tool = null;
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;
        // this.hitTestTarget = false;
        this.size = size || 15;
        this.shape = null;
        this.setDefaultShape();
        this.u = u;
        this.v = v;
        this.dynamicUV = false;
        this.drawCallback = null;
        this.transformCallback = null;
    }
    Control.prototype.setDefaultShape = function () {
        switch (this.type) {
            case ControlType.ROTATE:
            case ControlType.ROTATE_SCALE:
            case ControlType.REGISTRATION: {
                this.shape = ControlType.SHAPE_CIRCLE;
                break;
            }
            case ControlType.SCALE:
            case ControlType.SCALE_UNIFORM:
            case ControlType.SCALE_X:
            case ControlType.SCALE_Y:
            case ControlType.SKEW_X:
            case ControlType.SKEW_Y: {
                this.shape = ControlType.SHAPE_SQUARE;
                break;
            }
            case ControlType.BORDER: {
                this.shape = ControlType.SHAPE_BORDER;
                break;
            }
        }
    };
    /**
     * 更新操作框坐标
     */
    Control.prototype.updatePosition = function () {
        if (!this.tool || !this.tool.target) {
            return;
        }
        if (this.type === ControlType.REGISTRATION) {
            this.x = this.tool.regX;
            this.y = this.tool.regY;
            return;
        }
        var m = this.tool.endMatrix;
        // matrix transform for UV
        var w = this.tool.target.width * this.u;
        var h = this.tool.target.height * this.v;
        this.x = m.x + m.a * w + m.c * h;
        this.y = m.y + m.d * h + m.b * w;
        // offset
        var angle = 0;
        if (this.offsetX) {
            angle = m.getRotationX();
            this.x += this.offsetX * Math.cos(angle);
            this.y += this.offsetX * Math.sin(angle);
        }
        if (this.offsetY) {
            angle = m.getRotationY();
            this.x += this.offsetY * Math.sin(angle);
            this.y += this.offsetY * Math.cos(angle);
        }
    };
    /**
     * 画操作框形状
     */
    Control.prototype.draw = function (ctx) {
        // for custom drawing methods, call
        // that method and skip standard drawing
        // if it returns false
        if (this.drawCallback !== null) {
            if (!this.drawCallback(this, ctx)) {
                return;
            }
        }
        // do not draw for non-positive sizes
        if (this.size <= 0) {
            return;
        }
        var x = 0;
        var y = 0;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.tool.fillStyle;
        ctx.strokeStyle = this.tool.strokeStyle;
        ctx.lineWidth = this.tool.lineWidth;
        switch (this.shape) {
            case ControlType.SHAPE_CIRCLE: {
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
            }
            case ControlType.SHAPE_SQUARE: {
                x = (this.x - this.size / 2) | 0;
                y = (this.y - this.size / 2) | 0;
                ctx.fillRect(x, y, this.size, this.size);
                ctx.strokeRect(x, y, this.size, this.size);
                break;
            }
            case ControlType.SHAPE_BORDER: {
                // render to half pixel for hard lines
                ctx.fillStyle = "";
                var t = this.tool.target;
                var m = this.tool.endMatrix;
                ctx.moveTo(m.x, m.y);
                x = m.x + m.a * t.width;
                y = m.y + m.b * t.width;
                ctx.lineTo(x, y);
                x = m.x + m.a * t.width + m.c * t.height;
                y = m.y + m.d * t.height + m.b * t.width;
                ctx.lineTo(x, y);
                x = m.x + m.c * t.height;
                y = m.y + m.d * t.height;
                ctx.lineTo(x, y);
                ctx.lineTo(m.x, m.y);
                ctx.stroke();
                break;
            }
            default: {
                // no draw
                break;
            }
        }
        ctx.restore();
    };
    Control.prototype.contains = function (x, y) {
        if (this.hitTestTarget) {
            var t = this.tool.target;
            return t.matrix.containsPoint(x, y, t.width, t.height);
        }
        else {
            var cx = Math.abs(this.x - x);
            var cy = Math.abs(this.y - y);
            var sr = this.size / 2;
            if (cx < sr && cy < sr) {
                return true;
            }
        }
        return false;
    };
    return Control;
}());
__reflect(Control.prototype, "Control");
var UUType;
(function (UUType) {
    /**
     * 文本
     */
    UUType[UUType["TEXT"] = 1] = "TEXT";
    /**
     * 图片
     */
    UUType[UUType["IMAGE"] = 2] = "IMAGE";
    /**
     * 音频
     */
    UUType[UUType["SOUND"] = 18] = "SOUND";
    /**
     * 背景
     */
    UUType[UUType["BACKGROUND"] = 99] = "BACKGROUND";
    /**
     * 转盘
     */
    UUType[UUType["CIRCLE_SECTOR"] = 101] = "CIRCLE_SECTOR";
    /**
     * 容器框
     */
    UUType[UUType["FRAME"] = 102] = "FRAME";
    /**
     * Group
     */
    UUType[UUType["GROUP"] = 1021] = "GROUP";
    /**
     * 轮播图组件
     */
    UUType[UUType["SLIDESHOW"] = 103] = "SLIDESHOW";
    /**
     * 老虎机组件
     */
    UUType[UUType["SLOT_MACHINE"] = 104] = "SLOT_MACHINE";
    UUType[UUType["CARD"] = 112] = "CARD";
    /**
     * 弹出框卡片组件
     */
    UUType[UUType["CARDALERT"] = 1001] = "CARDALERT";
    /**
     * 图片单选
     */
    UUType[UUType["SELECT_IMAGE"] = 1002] = "SELECT_IMAGE";
    /**
     * 图片拖拽1
     */
    UUType[UUType["DRAW_ONE"] = 2001] = "DRAW_ONE";
    /**
     * 拖拽组件 border盒组件
     */
    UUType[UUType["DRAG_BORDER_BOX"] = 3001] = "DRAG_BORDER_BOX";
    /**
     * 拖拽组件 image盒组件
     */
    UUType[UUType["DRAG_IMAGE_BOX"] = 3002] = "DRAG_IMAGE_BOX";
    /**
     * 点击组件 image盒组件
     */
    UUType[UUType["CLICK_IMAGE_BOX"] = 3003] = "CLICK_IMAGE_BOX";
    /**
    * 功能按钮
    */
    UUType[UUType["FUNCTION_BUTTON"] = 9001] = "FUNCTION_BUTTON";
})(UUType || (UUType = {}));
/**
 * 动画类型
 */
var animType;
(function (animType) {
    /**
     * 直线
     */
    animType[animType["line"] = 1] = "line";
    /**
     * 圆
     */
    animType[animType["circle"] = 2] = "circle";
    /**
     * 三次贝塞尔曲线
     */
    animType[animType["curve"] = 3] = "curve";
})(animType || (animType = {}));
var LayerSet = (function () {
    function LayerSet() {
        throw new Error('can not create a instance');
    }
    LayerSet.createInstance = function (layerClass, prop) {
        var translater = new layerClass(prop);
        var obj = prop;
        for (var key in obj) {
            translater[key] = obj[key];
        }
        return translater;
    };
    LayerSet.getLayer = function (list, type) {
        return list.filter(function (item) {
            return item.uuType == type;
        });
    };
    LayerSet.identity = function (arg) {
        return arg;
    };
    return LayerSet;
}());
__reflect(LayerSet.prototype, "LayerSet");
var Transformable = (function () {
    function Transformable(width, height, matrix, owner) {
        this.width = 0;
        this.height = 0;
        this.width = width;
        this.height = height;
        this.matrix = matrix;
        this.owner = owner;
        this.changed = null;
    }
    return Transformable;
}());
__reflect(Transformable.prototype, "Transformable");
/**
 * 自定义操作框
 */
var ControlSet = (function () {
    function ControlSet() {
        throw new Error('can not create a instance');
    }
    ControlSet.getStandard = function () {
        var translater = new this.controlClass(ControlType.TRANSLATE);
        translater.hitTestTarget = true;
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.ROTATE, 0, 0, 0, 0, 10),
            new this.controlClass(ControlType.ROTATE, 0, 1, 0, 0, 10),
            new this.controlClass(ControlType.ROTATE, 1, 0, 0, 0, 10),
            new this.controlClass(ControlType.ROTATE, 1, 1, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_X, 0, .5, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_X, 1, .5, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5, 0, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5, 1, 0, 0, 10)
        ];
    };
    ControlSet.getScaler = function () {
        var translater = new this.controlClass(ControlType.TRANSLATE);
        translater.hitTestTarget = true;
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.SCALE, 0, 0, 0, 0, 10),
            new this.controlClass(ControlType.SCALE, 0, 1, 0, 0, 10),
            new this.controlClass(ControlType.SCALE, 1, 0, 0, 0, 10),
            new this.controlClass(ControlType.SCALE, 1, 1, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_X, 0, .5, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_X, 1, .5, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5, 0, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5, 1, 0, 0, 10)
        ];
    };
    ControlSet.getUniformScaler = function () {
        var translater = new this.controlClass(ControlType.TRANSLATE);
        translater.hitTestTarget = true;
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.ROTATE, .5, 0, 0, -20, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 0, 0, 0, 0, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 0, 1, 0, 0, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 1, 0, 0, 0, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 1, 1, 0, 0, 20)
        ];
    };
    ControlSet.getScalerWithRotate = function () {
        var translater = new this.controlClass(ControlType.TRANSLATE, 0, 0, 0, 0, -1);
        // translate control is "selected" by clicking
        // on the target's shape, not the control point
        translater.hitTestTarget = true;
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.ROTATE, .5, 0, 0, -20, 10),
            new this.controlClass(ControlType.SCALE, 0, 0, 0, 0, 10),
            new this.controlClass(ControlType.SCALE, 0, 1, 0, 0, 10),
            new this.controlClass(ControlType.SCALE, 1, 0, 0, 0, 10),
            new this.controlClass(ControlType.SCALE, 1, 1, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_X, 0, .5, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_X, 1, .5, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5, 0, 0, 0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5, 1, 0, 0, 10)
        ];
    };
    ControlSet.getDynamic = function () {
        var dyn = new this.controlClass(ControlType.TRANSLATE);
        dyn.dynamicUV = true;
        dyn.hitTestTarget = true;
        return [
            new this.controlClass(ControlType.BORDER),
            dyn
        ];
    };
    return ControlSet;
}());
__reflect(ControlSet.prototype, "ControlSet");
// TypeScript file
var EgretControl = (function (_super) {
    __extends(EgretControl, _super);
    function EgretControl(type, u, v, offsetX, offsetY, size) {
        var _this = _super.call(this, type, u, v, offsetX, offsetY, size) || this;
        _this.controlShape = new egret.Shape();
        return _this;
    }
    EgretControl.prototype.undraw = function () {
        var controlShape = this.controlShape;
        controlShape.graphics.clear();
    };
    EgretControl.prototype.draw = function (container) {
        // for custom drawing methods, call
        // that method and skip standard drawing
        // if it returns false
        if (this.drawCallback !== null) {
            if (!this.drawCallback(this, container)) {
                return;
            }
        }
        // do not draw for non-positive sizes
        if (this.size <= 0) {
            return;
        }
        var x = 0;
        var y = 0;
        var controlShape = this.controlShape;
        container.addChild(controlShape);
        // ctx.save();
        // ctx.beginPath();
        var fillStyle = this.tool.fillStyle;
        var strokeStyle = this.tool.strokeStyle;
        var lineWidth = this.tool.lineWidth;
        controlShape.graphics.clear();
        // controlShape.graphics.beginFill(this.tool.fillStyle, 1);
        // controlShape.graphics.lineStyle(2, this.tool.strokeStyle);
        switch (this.shape) {
            case ControlType.SHAPE_CIRCLE: {
                // ctx.arc(this.x,this.y,this.size/2,0,Math.PI*2);
                // ctx.fill();
                // ctx.stroke();
                controlShape.graphics.beginFill(fillStyle, 1);
                controlShape.graphics.lineStyle(lineWidth, strokeStyle);
                controlShape.graphics.drawCircle(this.x, this.y, this.size / 2);
                controlShape.graphics.endFill();
                break;
            }
            case ControlType.SHAPE_SQUARE: {
                x = (this.x - this.size / 2) | 0;
                y = (this.y - this.size / 2) | 0;
                // ctx.fillRect(x, y, this.size, this.size);
                // ctx.strokeRect(x, y, this.size, this.size);
                controlShape.graphics.beginFill(fillStyle, 1);
                controlShape.graphics.lineStyle(lineWidth, strokeStyle);
                controlShape.graphics.drawRect(x, y, this.size, this.size);
                controlShape.graphics.endFill();
                break;
            }
            case ControlType.SHAPE_BORDER: {
                // render to half pixel for hard lines
                // ctx.fillStyle = "";
                controlShape.graphics.lineStyle(lineWidth, strokeStyle);
                var t = this.tool.target;
                var m = this.tool.endMatrix;
                controlShape.graphics.moveTo(m.x, m.y);
                x = m.x + m.a * t.width;
                y = m.y + m.b * t.width;
                controlShape.graphics.lineTo(x, y);
                x = m.x + m.a * t.width + m.c * t.height;
                y = m.y + m.d * t.height + m.b * t.width;
                controlShape.graphics.lineTo(x, y);
                x = m.x + m.c * t.height;
                y = m.y + m.d * t.height;
                controlShape.graphics.lineTo(x, y);
                controlShape.graphics.lineTo(m.x, m.y);
                // controlShape.graphics.stroke();
                break;
            }
            default: {
                // no draw
                break;
            }
        }
        // ctx.restore();
    };
    return EgretControl;
}(Control));
__reflect(EgretControl.prototype, "EgretControl");
/**
 * 矩阵对象
 */
var Matrix = (function () {
    function Matrix(a, b, c, d, x, y) {
        this.a = (a != null) ? a : 1;
        this.b = b || 0;
        this.c = c || 0;
        this.d = (d != null) ? d : 1;
        this.x = x || 0;
        this.y = y || 0;
    }
    Matrix.prototype.toString = function () {
        return "matrix(" + this.a + "," + this.b + "," + this.c + "," + this.d + ","
            + this.x + "," + this.y + ")";
    };
    Matrix.prototype.equals = function (m) {
        if (this.a === m.a
            && this.b === m.b
            && this.c === m.c
            && this.d === m.d
            && this.x === m.x
            && this.y === m.y) {
            return true;
        }
        return false;
    };
    Matrix.prototype.identity = function () {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.x = 0;
        this.y = 0;
    };
    Matrix.prototype.clone = function () {
        return new Matrix(this.a, this.b, this.c, this.d, this.x, this.y);
    };
    Matrix.prototype.clone1 = function () {
        return new egret.Matrix(this.a, this.b, this.c, this.d, this.x, this.y);
    };
    Matrix.prototype.copyFrom = function (m) {
        this.a = m.a;
        this.b = m.b;
        this.c = m.c;
        this.d = m.d;
        this.x = m.x;
        this.y = m.y;
    };
    /**
     * 旋转
     * angle 弧度
     */
    Matrix.prototype.rotate = function (angle) {
        var u = Math.cos(angle);
        var v = Math.sin(angle);
        var temp = this.a;
        this.a = u * this.a - v * this.b;
        this.b = v * temp + u * this.b;
        temp = this.c;
        this.c = u * this.c - v * this.d;
        this.d = v * temp + u * this.d;
        temp = this.x;
        this.x = u * this.x - v * this.y;
        this.y = v * temp + u * this.y;
    };
    /**
     * 位移
     */
    Matrix.prototype.translate = function (x, y) {
        this.x += x;
        this.y += y;
    };
    Matrix.prototype.concat = function (m) {
        var a = this.a * m.a;
        var b = 0;
        var c = 0;
        var d = this.d * m.d;
        var x = this.x * m.a + m.x;
        var y = this.y * m.d + m.y;
        if (this.b !== 0 || this.c !== 0 || m.b !== 0 || m.c !== 0) {
            a += this.b * m.c;
            d += this.c * m.b;
            b += this.a * m.b + this.b * m.d;
            c += this.c * m.a + this.d * m.c;
            x += this.y * m.c;
            y += this.x * m.b;
        }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.x = x;
        this.y = y;
    };
    Matrix.prototype.invert = function () {
        if (this.b === 0 && this.c === 0 && this.a !== 0 && this.d !== 0) {
            this.a = 1 / this.a;
            this.d = 1 / this.d;
            this.b = 0;
            this.c = 0;
            this.x = -this.a * this.x;
            this.y = -this.d * this.y;
        }
        else {
            var det = this.a * this.d - this.b * this.c;
            if (det === 0) {
                this.identity();
                return;
            }
            det = 1 / det;
            var temp = this.a;
            this.a = this.d * det;
            this.b = -this.b * det;
            this.c = -this.c * det;
            this.d = temp * det;
            temp = this.y;
            this.y = -(this.b * this.x + this.d * this.y);
            this.x = -(this.a * this.x + this.c * temp);
        }
    };
    Matrix.prototype.getRotationX = function () {
        return Math.atan2(this.b, this.a);
    };
    Matrix.prototype.getRotationY = function () {
        return Math.atan2(this.c, this.d);
    };
    Matrix.prototype.getTransformedX = function (x, y) {
        return this.x + this.a * x + this.c * y;
    };
    Matrix.prototype.getTransformedY = function (x, y) {
        return this.y + this.d * y + this.b * x;
    };
    /**
     * 缩放
     */
    Matrix.prototype.scale = function (x, y) {
        this.a *= x;
        this.b *= y;
        this.c *= x;
        this.d *= y;
        this.x *= x;
        this.y *= y;
    };
    Matrix.prototype.containsPoint = function (x, y, w, h) {
        // find mouse in local target space
        // and check within bounds of that area
        var inv = Matrix.temp; // use pooled Matrix to reduce allocations
        inv.copyFrom(this);
        inv.invert();
        var tx = inv.x + inv.a * x + inv.c * y;
        var ty = inv.y + inv.d * y + inv.b * x;
        // compare locations in non-transformed space (inverted)
        if (tx >= 0 && tx <= w && ty >= 0 && ty <= h) {
            return true;
        }
        return false;
    };
    Matrix.temp = new Matrix();
    return Matrix;
}());
__reflect(Matrix.prototype, "Matrix");
var Mouse = (function () {
    function Mouse() {
        throw new Error('can not create a instance');
    }
    /**
     * 鼠标点击的坐标
     */
    Mouse.get = function (event, elem) {
        if (!elem) {
            elem = event.currentTarget;
        }
        // if (event.touches){
        //     if (event.touches.length){
        //         Mouse.x = parseInt(event.touches[0].pageX);
        //         Mouse.y = parseInt(event.touches[0].pageY);
        //     }
        // }else{
        //     // mouse events
        //     Mouse.x = parseInt(event.clientX);
        //     Mouse.y = parseInt(event.clientY);
        // }
        // console.log(event.stageX,event.stageY);
        // console.log(event.localX,event.localY);
        var targetPoint = elem.globalToLocal(event.stageX, event.stageY);
        Mouse.x = targetPoint.x;
        Mouse.y = targetPoint.y;
        // console.log(Mouse.x,Mouse.y);
        // var rect = elem.getBoundingClientRect();
        // Mouse.x += elem.scrollLeft - elem.clientLeft - rect.left;
        // Mouse.y += elem.scrollTop - elem.clientTop - rect.top;
        return Mouse;
    };
    Mouse.x = 0;
    Mouse.y = 0;
    Mouse.START = "touchBegin";
    Mouse.MOVE = "touchMove";
    Mouse.END = "touchEnd";
    return Mouse;
}());
__reflect(Mouse.prototype, "Mouse");
// TypeScript file
/**
 * 可操作对象容器
 */
var Picture = (function () {
    function Picture(image, m, b) {
        if (b === void 0) { b = true; }
        this.image = image;
        this.b = b;
        var matrix = new Matrix(m.a, m.b, m.c, m.d, m.x, m.y);
        this.transform = new Transformable(image.width, image.height, matrix, this);
        // if(this.image.data.pro)
    }
    Picture.prototype.draw = function (container) {
        var m = this.transform.matrix;
        this.image.matrix = new egret.Matrix(m.a, m.b, m.c, m.d, m.x, m.y);
        container.addChild(this.image);
    };
    Picture.prototype.undraw = function (container) {
        container.removeChild(this.image);
    };
    return Picture;
}());
__reflect(Picture.prototype, "Picture");
// TypeScript file
/**
 * 预览
 */
var Preview = (function (_super) {
    __extends(Preview, _super);
    function Preview() {
        var _this = _super.call(this) || this;
        _this.displayList = [];
        _this.pages = [];
        _this.pageIndex = 0;
        // w: number = 1200;
        // h: number = 900;
        _this.tweenControl = new TweenControl();
        _this.displayGroup = new eui.Group();
        // this.tool = new TransformTool(this);
        _this.getPages();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStageInit, _this);
        return _this;
    }
    Preview.prototype.onAddToStageInit = function (event) {
        this.tool = new TransformTool(this);
        this.bindHandlers();
        this.initEui();
        this.init();
        // initEvent();
    };
    Preview.prototype.bindHandlers = function () {
        this.render = this.render.bind(this);
        // this.addSinglePicture = this.addSinglePicture.bind(this);
    };
    Preview.prototype.initEui = function () {
        var bg = new egret.Shape;
        bg.graphics.beginFill(0xffffff, 1);
        bg.graphics.lineStyle(1, 0xcccccc);
        bg.graphics.drawRect(0, 0, this.width - 2, this.height - 2);
        bg.graphics.endFill();
        this.addChild(bg);
        // this.horizontalCenter = 0;
        // this.displayGroup.horizontalCenter = 0;
        this.displayGroup.width = this.width;
        this.displayGroup.height = this.height;
        this.displayGroup.scrollEnabled = true;
        this.addChild(this.displayGroup);
        var button = new eui.Button();
        button.width = 100;
        button.height = 40;
        button.label = "上一页";
        button.right = 0;
        button.addEventListener(Mouse.START, this.pre, this);
        this.addChild(button);
        var button2 = new eui.Button();
        button2.y = 50;
        button2.right = 0;
        button2.width = 100;
        button2.height = 40;
        button2.label = "下一页";
        button2.addEventListener(Mouse.START, this.next, this);
        this.addChild(button2);
    };
    Preview.prototype.getPages = function () {
        console.log(RES.getRes("data_json"));
        this.pages = RES.getRes("data_json").list;
    };
    Preview.prototype.pre = function (event) {
        if (this.pageIndex > 0) {
            this.reset();
            this.pageIndex--;
            this.renderResources(this.pageIndex);
            this.render();
        }
    };
    Preview.prototype.next = function (event) {
        if (this.pageIndex < this.pages.length - 1) {
            this.reset();
            this.pageIndex++;
            this.renderResources(this.pageIndex);
            this.render();
        }
    };
    Preview.prototype.init = function () {
        this.renderResources(this.pageIndex);
        this.setupTool();
        // selects pictures on mouse down
        // this.addEventListener(Mouse.START, this.down, this);
        // this.addEventListener(Mouse.START, this.down2, this);
        this.render();
    };
    Preview.prototype.setupTool = function () {
        ControlSet.controlClass = EgretControl;
        // var controls = this.getCustomControls();
        this.tool.setControls(ControlSet.getUniformScaler());
    };
    Preview.prototype.getFrame = function () {
        var temp = [];
        var eles = this.pages[this.pageIndex].elements;
        for (var i = 0; i < eles.length; i++) {
            if (eles[i].type == 102) {
                temp.push(this.displayList[i]);
            }
        }
        return temp;
    };
    Preview.prototype.down = function (event) {
        console.log(event.target);
        var d = event.target.data;
        // if(d && d.sound) {
        //     Utils.getSound(d.sound.url).then( (res) => {
        //         var sound: egret.Sound = <egret.Sound>res;
        //         sound.play(0, 1);
        //     });
        // }
        // if(event.target.data.hasOwnProperty("properties") && event.target.data.properties.hasOwnProperty('anims')){
        //     this.tweenControl.setTarget(event.target);
        //     let tweener: ITween = event.target.data.properties.anims[0];
        //     this.tweenControl.setValue(tweener.start, tweener.control, tweener.end);
        //     this.tweenControl.start();
        // }
        // if(this.pages[this.pageIndex].hasOwnProperty("properties") && this.pages[this.pageIndex].properties.hasOwnProperty("triggerGroup")){
        //     var triggerGroup = this.pages[this.pageIndex].properties.triggerGroup;
        //     console.log('triggerGroup...');
        //     console.log(JSON.stringify(triggerGroup));
        //     triggerGroup.forEach( (item) => {
        //         if(item.sourceId == event.target.name){
        //             if(event.target.data.hasOwnProperty("sound")){
        //                 var sound:egret.Sound = RES.getRes(event.target.data.name);
        //                 sound.play(0, 1);
        //             }else {
        //                 console.log('item.targetId = ' + item.targetId);
        //                 egret.Tween.get( this.getDisplayByName(item.targetId)[0].image ).to( {alpha: 0}, 300, egret.Ease.sineIn );
        //             }
        //         }
        //     })
        // }
        Mouse.get(event, this);
        var controlled = this.tool.start(Mouse.x, Mouse.y);
        if (!this.containsPoint(Mouse.x, Mouse.y)) {
            return false;
        }
        if (!controlled && this.selectImage(Mouse.x, Mouse.y)) {
            controlled = this.tool.start(Mouse.x, Mouse.y, this.findControlByType(ControlType.TRANSLATE));
        }
        if (controlled) {
            this.addEventListener(Mouse.MOVE, this.move, this);
            this.addEventListener(Mouse.END, this.up, this);
        }
        event.preventDefault();
    };
    Preview.prototype.move = function (event) {
        Mouse.get(event, this);
        this.applyDynamicControls(event);
        this.tool.move(Mouse.x, Mouse.y);
        requestAnimationFrame(this.render);
        event.preventDefault();
    };
    Preview.prototype.up = function (event) {
        this.tool.end();
        if (this.inter()) {
            console.log('in');
            var m = this.tool.target.matrix;
            this.tool.target.matrix = new Matrix(m.a, m.b, m.c, m.d, this.inter().x, this.inter().y);
        }
        this.removeEventListener(Mouse.MOVE, this.move, this);
        this.removeEventListener(Mouse.END, this.up, this);
        requestAnimationFrame(this.render);
        event.preventDefault();
    };
    Preview.prototype.down2 = function (evt) {
        var target = evt.target;
        var isDraw = target.isDraw;
        if (isDraw) {
            this.drawTarget = target;
            this.addEventListener(Mouse.MOVE, this.move2, this);
            this.addEventListener(Mouse.END, this.up2, this);
            var targetPoint = target.localToGlobal(0, 0);
            this.distanceX = evt.stageX - targetPoint.x;
            this.distanceY = evt.stageY - targetPoint.y;
        }
        evt.preventDefault();
    };
    Preview.prototype.move2 = function (evt) {
        var _this = this;
        var targetPoint = this.drawTarget.parent.globalToLocal(evt.stageX - this.distanceX, evt.stageY - this.distanceY);
        requestAnimationFrame(function () {
            _this.drawTarget.x = targetPoint.x;
            _this.drawTarget.y = targetPoint.y;
        });
        evt.preventDefault();
    };
    Preview.prototype.up2 = function (evt) {
        this.removeEventListener(Mouse.MOVE, this.move2, this);
        this.removeEventListener(Mouse.END, this.up2, this);
        evt.preventDefault();
    };
    Preview.prototype.findControlByType = function (type) {
        var i = 0;
        var n = this.tool.controls.length;
        for (i = 0; i < n; i++) {
            if (this.tool.controls[i].type == type) {
                return this.tool.controls[i];
            }
        }
        return null;
    };
    Preview.prototype.applyDynamicControls = function (event) {
        // if dynamic, set controls based on 
        // keyboard keys
        var dyn = this.getDynamicControl();
        console.log('dyn:' + dyn);
        if (dyn) {
            if (event.ctrlKey) {
                if (event.shiftKey) {
                    dyn.type = ControlType.ROTATE_SCALE;
                }
                else {
                    dyn.type = ControlType.ROTATE;
                }
            }
            else if (event.shiftKey) {
                dyn.type = ControlType.SCALE;
            }
            else {
                dyn.type = ControlType.TRANSLATE;
            }
        }
    };
    Preview.prototype.getDynamicControl = function () {
        var i = 0;
        var n = this.tool.controls.length;
        for (i = 0; i < n; i++) {
            if (this.tool.controls[i].dynamicUV) {
                return this.tool.controls[i];
            }
        }
        return null;
    };
    Preview.prototype.containsPoint = function (x, y) {
        var globalEdit = this.parent.localToGlobal(this.matrix.tx, this.matrix.ty);
        var globalMouse = this.localToGlobal(Mouse.x, Mouse.y);
        var m = new Matrix(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, globalEdit.x, globalEdit.y);
        // console.log(globalMouse.x, globalMouse.y)
        // console.log(m.containsPoint(globalMouse.x, globalMouse.y, this.width, this.height));
        return m.containsPoint(globalMouse.x, globalMouse.y, this.width, this.height);
    };
    Preview.prototype.getDisplayByName = function (name) {
        return this.displayList.filter(function (item) {
            return item.image.name == name;
        });
    };
    Preview.prototype.inter = function () {
        var temp = this.getFrame();
        var pic = null;
        var t = null;
        var r = null;
        var i = temp.length;
        var target = this.tool.target.owner.image;
        var rect = new egret.Rectangle(target.x, target.y, target.width * this.tool.target.matrix.a, target.height * this.tool.target.matrix.d);
        egret.log('source rect:' + rect);
        while (i--) {
            pic = temp[i];
            t = pic.transform;
            r = new egret.Rectangle(pic.image.x, pic.image.y, pic.image.width, pic.image.height);
            egret.log('target rect:' + r);
            if (r.intersects(rect)) {
                return r;
            }
        }
        return null;
    };
    Preview.prototype.selectImage = function (x, y) {
        var pic = null;
        var t = null;
        // walk backwards selecting top-most first
        var i = this.displayList.length;
        while (i--) {
            pic = this.displayList[i];
            if (!pic.b)
                return false;
            t = pic.transform;
            if (t.matrix.containsPoint(x, y, t.width, t.height)) {
                if (this.tool.target !== t) {
                    // select
                    this.tool.setTarget(t);
                    // reorder for layer rendering
                    // this.displayList.splice(i,1);
                    // this.displayList.push(pic);
                    return true;
                }
                // already selected
                return false;
            }
        }
        // deselect
        var point = new egret.Point(x, y);
        var rect = new egret.Rectangle(0, 0, this.width, this.height);
        if (rect.containsPoint(point)) {
            this.tool.setTarget(null);
            return false;
        }
        ;
    };
    Preview.prototype.renderResources = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var elements, n, i, texture, t, com, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        elements = this.pages[index].elements;
                        n = elements.length;
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < n)) return [3 /*break*/, 6];
                        texture = RES.getRes(elements[i].name);
                        t = LayerSet.getLayer(Utils.getComs(), elements[i].type)[0];
                        com = LayerSet.createInstance(t, elements[i].props);
                        com.name = elements[i].id;
                        com.data = elements[i];
                        if (!(!texture && (elements[i].type === UUType.IMAGE || elements[i].type === UUType.BACKGROUND))) return [3 /*break*/, 3];
                        _a = com;
                        return [4 /*yield*/, Utils.getTexture("resource/" + elements[i].src)];
                    case 2:
                        _a.texture = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        com.texture = texture;
                        _b.label = 4;
                    case 4:
                        this.displayList.push(new Picture(com, elements[i].matrix, elements[i].type == UUType.BACKGROUND ? false : true));
                        requestAnimationFrame(this.render);
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Preview.prototype.render = function () {
        this.clear();
        this.drawDisplayList();
        // this.tool.draw();
        this.displayGroup.addChild(this.tweenControl);
    };
    Preview.prototype.clear = function () {
        // this.tool.undraw();
    };
    Preview.prototype.reset = function () {
        this.clear();
        var i = 0;
        var n = this.displayList.length;
        for (i = 0; i < n; i++) {
            this.displayList[i].undraw(this.displayGroup);
        }
        this.displayList = [];
    };
    Preview.prototype.drawDisplayList = function () {
        var i = 0;
        var n = this.displayList.length;
        for (i = 0; i < n; i++) {
            // if (!targetControl || this.tool.target !== this.displayList[i].transform){
            this.displayList[i].draw(this.displayGroup);
            // 背景图
            var item = this.displayList[i].image;
            if (item.data.type == 99) {
                this.displayGroup.setChildIndex(item, 0);
            }
            // }
        }
    };
    return Preview;
}(eui.Group));
__reflect(Preview.prototype, "Preview");
/**
 * 声音组件
 */
var SoundButton = (function (_super) {
    __extends(SoundButton, _super);
    function SoundButton() {
        var _this = _super.call(this) || this;
        _this.layerName = '声音';
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    SoundButton.prototype.onAddToStage = function (event) {
        this.init();
        // this.bindHandler();
    };
    SoundButton.prototype.init = function () {
    };
    SoundButton.uuType = UUType.SOUND;
    return SoundButton;
}(eui.Button));
__reflect(SoundButton.prototype, "SoundButton", ["IUUBase"]);
var Card = (function (_super) {
    __extends(Card, _super);
    function Card() {
        var _this = _super.call(this) || this;
        _this.width = 800;
        _this.height = 600;
        _this.ques = {
            items: [
                {
                    select: "toitem1",
                    resource: {
                        id: "item1",
                        url: "assets/pic/post_item_18.png"
                    }
                },
                {
                    select: "toitem1",
                    resource: {
                        id: "item2",
                        url: "assets/pic/post_item_19.png"
                    }
                }
            ],
            toItems: [
                {
                    select: "item1",
                    resource: {
                        id: "toitem1",
                        url: "assets/pic/post_item_22.png"
                    }
                }
            ]
        };
        _this.itemContainer = new eui.Group();
        _this.toitemContainer = new eui.Group();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Card.prototype.getProps = function () {
        return {
            ques: this.ques
        };
    };
    Card.prototype.setProps = function (d) {
        this.ques = d;
    };
    Card.prototype.onAddToStage = function () {
        var vLayout = new eui.VerticalLayout();
        this.layout = vLayout;
        var hLayout = new eui.HorizontalLayout();
        hLayout.gap = 30;
        hLayout.horizontalAlign = egret.HorizontalAlign.LEFT;
        hLayout.verticalAlign = egret.VerticalAlign.MIDDLE;
        hLayout.paddingRight = 30;
        this.itemContainer.height = 300;
        this.toitemContainer.height = 300;
        this.itemContainer.layout = hLayout;
        this.toitemContainer.layout = hLayout;
        var bg = new egret.Shape;
        bg.graphics.lineStyle(1, 0x999999);
        bg.graphics.beginFill(0xffffff, 1);
        bg.graphics.drawRect(0, 0, this.width, this.height);
        bg.graphics.endFill();
        this.addChild(bg);
        this.addChild(this.itemContainer);
        this.addChild(this.toitemContainer);
        this.draw();
    };
    Card.prototype.draw = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, img, t, i, img, t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.ques.items.length)) return [3 /*break*/, 4];
                        img = new UUImage();
                        return [4 /*yield*/, Utils.getTexture("resource/" + this.ques.items[i].resource.url)];
                    case 2:
                        t = _a.sent();
                        img.texture = t;
                        img.width = 300;
                        img.height = 300;
                        this.itemContainer.addChild(img);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        i = 0;
                        _a.label = 5;
                    case 5:
                        if (!(i < this.ques.toItems.length)) return [3 /*break*/, 8];
                        img = new UUImage();
                        return [4 /*yield*/, Utils.getTexture("resource/" + this.ques.toItems[i].resource.url)];
                    case 6:
                        t = _a.sent();
                        img.texture = t;
                        img.width = 300;
                        img.height = 300;
                        this.toitemContainer.addChild(img);
                        _a.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Card.prototype.reset = function () {
        this.itemContainer.removeChildren();
        this.toitemContainer.removeChildren();
    };
    Card.prototype.dispose = function () {
    };
    Card.uuType = UUType.CARD;
    return Card;
}(eui.Group));
__reflect(Card.prototype, "Card", ["IUUBase", "IUUContainer"]);
/**
 * 操作基类
 */
var TransformTool = (function () {
    function TransformTool(container) {
        // transform interaction
        // where interaction starts
        this.startMatrix = new Matrix();
        this.regStartU = 0.5;
        this.regStartV = 0.5;
        this.startX = 0;
        this.startY = 0;
        // trnasforms to apply
        this.preMatrix = new Matrix();
        this.postMatrix = new Matrix();
        // where interaction ends
        this.endMatrix = new Matrix();
        this.regEndU = 0.5;
        this.regEndV = 0.5;
        this.endX = 0;
        this.endY = 0;
        // transform UV delta
        this.dU = 0;
        this.dV = 0;
        // registration point in px
        this.regX = 0;
        this.regY = 0;
        // inverted matrices
        this.inv = new Matrix();
        this.controls = [];
        // style guide for controls
        this.fillStyle = 0xffffff;
        this.strokeStyle = 0x007eff;
        this.lineWidth = 2;
        this.container = container;
    }
    TransformTool.prototype.addMask = function () {
        this.removeMask();
        var _a = this.preTarget, height = _a.height, width = _a.width, matrix = _a.matrix;
        var a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, x = matrix.x, y = matrix.y;
        var newMatrix = new egret.Matrix(a, b, c, d, x, y);
        this.targetMask = new egret.Shape();
        this.targetMask.graphics.lineStyle(2, 0x1593ff);
        this.targetMask.graphics.beginFill(0x000000, .3);
        this.targetMask.graphics.drawRect(0, 0, width, height);
        this.targetMask.graphics.endFill();
        this.targetMask.matrix = newMatrix;
        this.container.addChild(this.targetMask);
    };
    TransformTool.prototype.removeMask = function () {
        if (!this.targetMask)
            return;
        this.container.removeChild(this.targetMask);
        this.targetMask = null;
    };
    TransformTool.prototype.setPreTarget = function (preTarget) {
        this.preTarget = preTarget;
    };
    TransformTool.prototype.setTarget = function (target) {
        if (this.target === target) {
            return;
        }
        this.target = target;
        this.updateFromTarget();
    };
    TransformTool.prototype.updateFromTarget = function () {
        if (this.target && this.target.matrix) {
            console.log('updateFromTarget...');
            console.log(this.target.matrix);
            this.endMatrix.copyFrom(this.target.matrix);
            this.commit();
            this.updateRegistration();
            this.updateControls();
        }
    };
    TransformTool.prototype.setControls = function (controls) {
        this.controls.length = 0;
        if (!controls || !controls.length) {
            return;
        }
        var i = 0;
        var n = controls.length;
        for (i = 0; i < n; i++) {
            controls[i].tool = this;
            this.controls[i] = controls[i];
            this.controls[i].updatePosition();
        }
    };
    TransformTool.prototype.updateControls = function () {
        var i = 0;
        var n = this.controls.length;
        for (i = 0; i < n; i++) {
            this.controls[i].updatePosition();
        }
    };
    TransformTool.prototype.getControlAt = function (x, y) {
        // walking in reverse order to find those 
        // drawn on top (later in list) first
        var i = this.controls.length;
        while (i--) {
            if (this.controls[i].contains(x, y)) {
                return this.controls[i];
            }
        }
        // control not found
        return null;
    };
    TransformTool.prototype.draw = function () {
        if (!this.shouldDraw()) {
            return;
        }
        var i = 0;
        var n = this.controls.length;
        for (i = 0; i < n; i++) {
            this.controls[i].draw(this.container);
        }
    };
    TransformTool.prototype.undraw = function () {
        var i = 0;
        var n = this.controls.length;
        for (i = 0; i < n; i++) {
            this.controls[i].undraw(this.container);
        }
    };
    TransformTool.prototype.shouldDraw = function () {
        return this.target != null;
    };
    TransformTool.prototype.start = function (x, y, control) {
        if (!this.target) {
            return false;
        }
        // commits and gives default state
        this.end();
        this.control = control || this.getControlAt(x, y);
        if (this.control) {
            this.startX = x;
            this.startY = y;
            this.dU = 0;
            this.dV = 0;
            if (this.control.dynamicUV) {
                // update the control point location
                // to match the mouse location at start
                var cx = x - this.startMatrix.x;
                var cy = y - this.startMatrix.y;
                this.control.u = (this.inv.a * cx + this.inv.c * cy) / this.target.width;
                this.control.v = (this.inv.d * cy + this.inv.b * cx) / this.target.height;
            }
            this.updateRegistration();
            return true;
        }
        return false;
    };
    TransformTool.prototype.move = function (x, y) {
        this.updateMoveValues(x, y);
        if (this.control) {
            this.applyControl();
            this.updateTransform();
            this.updateTarget();
            this.updateRegistration();
            this.updateControls();
        }
    };
    TransformTool.prototype.scale = function (s) {
        this.preMatrix.scale(s, s);
        // if (this.control){
        this.updateTransform();
        this.updateTarget();
        this.updateRegistration();
        this.updateControls();
        // }
    };
    TransformTool.prototype.translate = function (x, y) {
        this.postMatrix.translate(x, y);
        // if (this.control){
        this.updateTransform();
        this.updateTarget();
        this.updateRegistration();
        this.updateControls();
        // }
    };
    TransformTool.prototype.rotate = function (r) {
        this.postMatrix.rotate(r);
        // if (this.control){
        this.updateTransform();
        this.updateTarget();
        this.updateRegistration();
        this.updateControls();
        // }
    };
    TransformTool.prototype.end = function () {
        this.commit();
        this.control = null;
    };
    TransformTool.prototype.updateMoveValues = function (x, y) {
        this.endX = x;
        this.endY = y;
        var cx = this.endX - this.startX;
        var cy = this.endY - this.startY;
        // inline transformPoint to target local space
        this.dU = (this.inv.a * cx + this.inv.c * cy) / this.target.width;
        this.dV = (this.inv.d * cy + this.inv.b * cx) / this.target.height;
    };
    TransformTool.prototype.applyControl = function () {
        if (this.control) {
            // for custom drawing methods, call
            // that method and skip standard drawing
            // if it returns false
            if (this.control.transformCallback !== null) {
                if (!this.control.transformCallback(this.control)) {
                    return;
                }
            }
            // variables for working with position and size
            var x = 0;
            var y = 0;
            var w = this.target.width;
            var h = this.target.height;
            // difference between registration and control points
            var cu = this.control.u - this.regStartU;
            var cv = this.control.v - this.regStartV;
            // if the abs px difference is less than 0, normalize to
            // 1 (or -1) to prevent outrageous divisions by 0 or a
            // very small number resulting in oversized transforms
            if (cu > 0) {
                if (cu * w < 1) {
                    cu = 1 / w;
                }
            }
            else if (cu * w > -1) {
                cu = -1 / w;
            }
            if (cv > 0) {
                if (cv * h < 1) {
                    cv = 1 / h;
                }
            }
            else if (cv * h > -1) {
                cv = -1 / h;
            }
            // perform transform based on control type
            switch (this.control.type) {
                case ControlType.SCALE: {
                    x = (cu + this.dU) / cu;
                    y = (cv + this.dV) / cv;
                    this.preMatrix.scale(x, y);
                    break;
                }
                case ControlType.SCALE_X: {
                    x = (cu + this.dU) / cu;
                    this.preMatrix.scale(x, 1);
                    break;
                }
                case ControlType.SCALE_Y: {
                    y = (cv + this.dV) / cv;
                    this.preMatrix.scale(1, y);
                    break;
                }
                case ControlType.SCALE_UNIFORM: {
                    x = (cu + this.dU) / cu;
                    y = (cv + this.dV) / cv;
                    // find the ratio to make the scaling
                    // uniform in both the x (w) and y (h) axes
                    w = y ? Math.abs(x / y) : 0;
                    h = x ? Math.abs(y / x) : 0;
                    // for 0 scale, scale both axises to 0
                    if (w === 0 || h === 0) {
                        x = 0;
                        y = 0;
                        // scale mased on the smaller ratio
                    }
                    else if (w > h) {
                        x *= h;
                    }
                    else {
                        y *= w;
                    }
                    this.preMatrix.scale(x, y);
                    break;
                }
                case ControlType.SKEW_X: {
                    this.preMatrix.c = (w / h) * (this.dU / cv);
                    break;
                }
                case ControlType.SKEW_Y: {
                    this.preMatrix.b = (h / w) * (this.dV / cu);
                    break;
                }
                case ControlType.ROTATE_SCALE: {
                    // rotation in global space
                    x = this.startX - this.regX;
                    y = this.startY - this.regY;
                    var ex = this.endX - this.regX;
                    var ey = this.endY - this.regY;
                    var angle = Math.atan2(ey, ex) - Math.atan2(y, x);
                    this.postMatrix.rotate(angle);
                    // determine scale factor from change
                    // this is also done in global space
                    // in matching with the rotation
                    var s = Math.sqrt(x * x + y * y);
                    if (s === 0) {
                        this.preMatrix.scale(0, 0);
                    }
                    else {
                        s = Math.sqrt(ex * ex + ey * ey) / s;
                        this.preMatrix.scale(s, s);
                    }
                    break;
                }
                case ControlType.ROTATE: {
                    // rotation in global space
                    x = Math.atan2(this.startY - this.regY, this.startX - this.regX);
                    y = Math.atan2(this.endY - this.regY, this.endX - this.regX);
                    this.postMatrix.rotate(y - x);
                    break;
                }
                case ControlType.TRANSLATE: {
                    // translate in global space
                    this.postMatrix.translate(this.endX - this.startX, this.endY - this.startY);
                    break;
                }
                case ControlType.REGISTRATION: {
                    this.regEndU = this.regStartU + this.dU;
                    this.regEndV = this.regStartV + this.dV;
                    // reg UV isn't set until end()
                    break;
                }
            }
        }
    };
    TransformTool.prototype.updateRegistration = function () {
        var x = this.regEndU * this.target.width;
        var y = this.regEndV * this.target.height;
        var m = this.endMatrix;
        this.regX = m.x + m.a * x + m.c * y;
        this.regY = m.y + m.d * y + m.b * x;
        // console.log(this.regX, this.regY);
    };
    TransformTool.prototype.updateTransform = function () {
        // apply transforms (pre, post)
        this.endMatrix.identity();
        this.endMatrix.concat(this.preMatrix);
        this.endMatrix.concat(this.startMatrix);
        // next, the post transform is concatenated on top
        // of the previous result, but for the post transform,
        // translation (x,y) values are not transformed. They're
        // saved with the respective post transform offset, then 
        // reassigned after concatenating the post transformation
        var x = this.endMatrix.x + this.postMatrix.x;
        var y = this.endMatrix.y + this.postMatrix.y;
        // finally, concatenate post transform on to final
        this.endMatrix.concat(this.postMatrix);
        // reassign saved tx and ty values with the 
        // included registration offset
        this.endMatrix.x = x;
        this.endMatrix.y = y;
        // shift for registration not being in (0,0)
        this.applyRegistrationOffset();
        // reset transforms
        this.preMatrix.identity();
        this.postMatrix.identity();
    };
    TransformTool.prototype.applyRegistrationOffset = function () {
        if (this.regEndU !== 0 || this.regEndV !== 0) {
            // registration offset
            // local registration location
            var x = this.regEndU * this.target.width;
            var y = this.regEndV * this.target.height;
            // delta tansform by start matrix
            var rx = this.startMatrix.a * x + this.startMatrix.c * y;
            var ry = this.startMatrix.d * y + this.startMatrix.b * x;
            // subtract delta transform end matrix
            rx -= this.endMatrix.a * x + this.endMatrix.c * y;
            ry -= this.endMatrix.d * y + this.endMatrix.b * x;
            // shift by remaining
            this.endMatrix.translate(rx, ry);
        }
    };
    TransformTool.prototype.updateTarget = function () {
        if (this.target && this.target.matrix && !this.target.matrix.equals(this.endMatrix)) {
            this.target.matrix.copyFrom(this.endMatrix);
            if (this.target.changed !== null) {
                this.target.changed();
            }
        }
    };
    TransformTool.prototype.commit = function () {
        // registration
        this.regStartU = this.regEndU;
        this.regStartV = this.regEndV;
        // transform
        this.startMatrix.copyFrom(this.endMatrix);
        this.sanitizeStartMatrix(); // prevent by-0 errors
        // update inversion matrix
        this.inv.copyFrom(this.startMatrix);
        this.inv.invert();
    };
    TransformTool.prototype.sanitizeStartMatrix = function () {
        if (!this.target) {
            return;
        }
        if (this.startMatrix.a === 0 && this.startMatrix.b === 0) {
            this.startMatrix.a = 1 / this.target.width;
        }
        if (this.startMatrix.d === 0 && this.startMatrix.c === 0) {
            this.startMatrix.d = 1 / this.target.height;
        }
    };
    return TransformTool;
}());
__reflect(TransformTool.prototype, "TransformTool");
var TweenControl = (function (_super) {
    __extends(TweenControl, _super);
    function TweenControl() {
        var _this = _super.call(this) || this;
        // private ball:egret.Shape;
        _this.isMoving = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    TweenControl.prototype.onAddToStage = function () {
        var btn = new eui.Button();
        btn.label = "go";
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.start, this);
        this.addChild(btn);
    };
    TweenControl.prototype.start = function () {
        var _this = this;
        if (this.isMoving) {
            return;
        }
        this.isMoving = true;
        return new Promise(function (resolve) {
            egret.Tween.get(_this)
                .to({ factor: 1 }, 2000)
                .call(function () {
                resolve('finish');
            });
        });
        // egret.Tween.get(this).to({factor: 1}, 2000).call(this.moveOver, this);
    };
    TweenControl.prototype.moveOver = function () {
        this.isMoving = false;
    };
    Object.defineProperty(TweenControl.prototype, "factor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            switch (this.tweener.type) {
                case animType.circle:
                    var PI = Math.PI;
                    this.target.x = Math.cos(PI / 180 * (360 * value - 90)) * 100 + this._start.x;
                    this.target.y = Math.sin(PI / 180 * (360 * value - 90)) * 100 + this._start.y;
                    break;
                case animType.curve:
                    this.target.x = (1 - value) * (1 - value) * this._start.x + 2 * value * (1 - value) * this._control.x + value * value * this._anchor.x;
                    this.target.y = (1 - value) * (1 - value) * this._start.y + 2 * value * (1 - value) * this._control.y + value * value * this._anchor.y;
                    break;
                case animType.line:
                    this.target.x = this._start.x + (this._control.x - this._start.x) * value;
                    this.target.y = this._start.y + (this._control.y - this._start.y) * value;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    TweenControl.prototype.setTarget = function (target) {
        // this.tool = tool;
        if (!target)
            return;
        this.target = target;
        this.data = this.target.data;
        if (this.data.hasOwnProperty('properties') && this.data.properties.hasOwnProperty('anims')) {
            this.tweener = this.data.properties.anims[0];
        }
    };
    /**
     * 设置控制点值
     */
    TweenControl.prototype.setValue = function (start, control, anchor) {
        this._start = start;
        this._control = control;
        this._anchor = anchor;
    };
    return TweenControl;
}(eui.Group));
__reflect(TweenControl.prototype, "TweenControl");
var BaseComponent = (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent() {
        return _super.call(this) || this;
    }
    BaseComponent.prototype.getProps = function () {
        return {
            awards: this.awards
        };
    };
    BaseComponent.prototype.setProps = function (d) {
        this.awards = d.awards;
    };
    BaseComponent.prototype.redraw = function () {
    };
    /**
     * 切换页和删除图层的时候回收组件释放当前组件动画等
     */
    BaseComponent.prototype.dispose = function () {
        for (var _i = 0, _a = this.tweens; _i < _a.length; _i++) {
            var t = _a[_i];
            t.pause();
        }
        egret.Tween.removeAllTweens();
        this.tweens = [];
    };
    return BaseComponent;
}(eui.Group));
__reflect(BaseComponent.prototype, "BaseComponent", ["IUUComponent"]);
var Utils = (function () {
    function Utils() {
    }
    Utils.getComs = function () {
        return [UULabel, UUImage, UUContainer, SoundButton, CircleSector, UUBackground, Slideshow, SlotMachine, UUGroup, CardAlert, SelectImage, DrawOne, DragBorderBox, DragImageBox, ClickImageBox, FunctionButton];
    };
    Utils.getTexture = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            RES.getResByUrl(url, function (texture) {
                resolve(texture);
            }, _this, RES.ResourceItem.TYPE_IMAGE);
        });
    };
    Utils.getSound = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sound = new egret.Sound();
            sound.addEventListener(egret.Event.COMPLETE, function (event) {
                resolve(event.target);
            }, _this);
            sound.load(url);
        });
    };
    Utils.getScript = function (arr) {
        return new Promise(function (resolve, reject) {
            loadScript(arr, function () {
                resolve();
            });
        });
    };
    Utils.trans = function (arr, templateId) {
        var obj = {
            "groups": [
                {
                    "keys": "data_json",
                    "name": "preloadpic"
                }
            ],
            "resources": [
                {
                    "url": templateId + "/data.json",
                    "type": "json",
                    "name": "data_json"
                }
            ]
        };
        arr.forEach(function (item, index) {
            item.elements.forEach(function (elem) {
                if (elem.hasOwnProperty('src') && elem.src != '') {
                    var n = elem.src.substring(elem.src.lastIndexOf("/") + 1).replace('.', '_');
                    obj.resources.push({
                        url: elem.src,
                        type: 'image',
                        name: n
                    });
                    obj.groups[0].keys = obj.groups[0].keys == '' ? n : obj.groups[0].keys + ',' + n;
                }
            });
        });
        return obj;
    };
    return Utils;
}());
__reflect(Utils.prototype, "Utils");
// TypeScript file
/**
 * 背景
 */
var UUBackground = (function (_super) {
    __extends(UUBackground, _super);
    function UUBackground() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layerName = '背景';
        return _this;
    }
    UUBackground.uuType = UUType.BACKGROUND;
    return UUBackground;
}(eui.Image));
__reflect(UUBackground.prototype, "UUBackground", ["IUUBase"]);
// TypeScript file
/**
 * 图形基类
 */
var UUBitmap = (function (_super) {
    __extends(UUBitmap, _super);
    function UUBitmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layerName = '图片';
        return _this;
    }
    return UUBitmap;
}(egret.Bitmap));
__reflect(UUBitmap.prototype, "UUBitmap", ["IUUBase"]);
// TypeScript file
var UUContainer = (function (_super) {
    __extends(UUContainer, _super);
    function UUContainer() {
        var _this = _super.call(this) || this;
        _this.items = [];
        _this.width = 300;
        _this.height = 300;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    UUContainer.prototype.onAddToStage = function (event) {
        this.init();
    };
    UUContainer.prototype.init = function () {
        this.width = 300;
        this.height = 300;
        var bg = new egret.Shape;
        bg.graphics.lineStyle(1, 0x999999);
        bg.graphics.beginFill(0xffffff, 1);
        bg.graphics.drawRect(0, 0, this.width, this.height);
        bg.graphics.endFill();
        this.addChild(bg);
    };
    UUContainer.prototype.getProps = function () {
        return {
            width: this.width | 300,
            height: this.height | 300
        };
    };
    UUContainer.uuType = UUType.FRAME;
    return UUContainer;
}(eui.Group));
__reflect(UUContainer.prototype, "UUContainer", ["IUUBase"]);
var UUGroup = (function (_super) {
    __extends(UUGroup, _super);
    function UUGroup(props) {
        var _this = _super.call(this) || this;
        // base 
        _this.name = '';
        _this.layerName = '容器';
        _this.isDraw = false;
        // props默认值
        _this.width = 200;
        _this.height = 200;
        for (var key in props) {
            _this[key] = props[key];
        }
        return _this;
    }
    UUGroup.uuType = UUType.GROUP;
    return UUGroup;
}(eui.Group));
__reflect(UUGroup.prototype, "UUGroup", ["IUUBase", "IGroup", "ISize"]);
// TypeScript file
/**
 * 图片组件
 */
var UUImage = (function (_super) {
    __extends(UUImage, _super);
    function UUImage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layerName = '图片';
        _this.isDraw = false;
        return _this;
    }
    UUImage.uuType = UUType.IMAGE;
    return UUImage;
}(eui.Image));
__reflect(UUImage.prototype, "UUImage", ["IUUBase", "IImage", "IResource", "ISize"]);
// TypeScript file
/**
 * 文字组件
 */
var UULabel = (function (_super) {
    __extends(UULabel, _super);
    function UULabel(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this) || this;
        // base
        _this.name = '';
        _this.layerName = '文字';
        _this.isDraw = false;
        // props默认值
        _this.text = '请输入文本';
        _this.textColor = 0x000000;
        _this.size = 40;
        _this.fontFamily = 'Arial';
        _this.textAlign = egret.HorizontalAlign.JUSTIFY;
        for (var key in props) {
            _this[key] = props[key];
        }
        return _this;
    }
    UULabel.uuType = UUType.TEXT;
    return UULabel;
}(eui.Label));
__reflect(UULabel.prototype, "UULabel", ["IUUBase", "ILabel"]);
// TypeScript file
var UURequest = (function () {
    // private req: egret.HttpRequest = new egret.HttpRequest();
    function UURequest() {
    }
    return UURequest;
}());
__reflect(UURequest.prototype, "UURequest");
