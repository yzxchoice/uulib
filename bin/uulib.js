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
// TypeScript file
/**
 * 可操作对象容器
 */
var Picture = (function () {
    function Picture(image, m) {
        this.image = image;
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
 * 组件基类
 */
var BaseUI = (function () {
    function BaseUI() {
    }
    return BaseUI;
}());
__reflect(BaseUI.prototype, "BaseUI");
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
 * 转盘组件
 */
var CircleSector = (function (_super) {
    __extends(CircleSector, _super);
    function CircleSector() {
        var _this = _super.call(this) || this;
        _this.awards = [
            '大保健', '话费10元', '话费20元', '话费30元', '保时捷911', '土豪金项链'
        ];
        _this.main = new eui.Group();
        _this.touchEnabled = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
        return _this;
    }
    CircleSector.prototype.draw = function () {
    };
    CircleSector.prototype.onAddToStage = function (event) {
        this.init();
        this.drawSector();
    };
    CircleSector.prototype.onRemoveFromStage = function (event) {
        this.dispose();
    };
    CircleSector.prototype.init = function () {
        this.main.anchorOffsetX = 200;
        this.main.anchorOffsetY = 200;
        this.main.x = 200;
        this.main.y = 200;
        var s = new egret.Shape();
        // s.graphics.beginFill(0x000000, 0.5);
        // s.graphics.lineStyle(1, 0xf2f2f2);
        // s.graphics.drawRect(0, 0, 456, 444);
        // s.graphics.endFill();
        this.main.touchEnabled = false;
        this.main.addChild(s);
        this.addChild(this.main);
    };
    CircleSector.prototype.drawSector = function () {
        var shape = new egret.Shape();
        shape.touchEnabled = true;
        this.main.addChild(shape);
        var arc = 360 / this.awards.length;
        var lastAngle = 0;
        var r = 200;
        var fillStyle = 0xffffff;
        var strokeStyle = 0x007eff;
        var lineWidth = 2;
        for (var i = 0; i < this.awards.length; i++) {
            if (i % 2 === 0)
                fillStyle = 0xFFFFFF;
            else
                fillStyle = 0xFD5757;
            lastAngle = i * arc;
            this.drawArc(shape, r, r, r, arc, lastAngle, fillStyle);
            var g = new eui.Group();
            g.width = 2 * r * Math.sin(arc * 2 * Math.PI / 360 / 2);
            g.height = r;
            g.x = 200 + Math.cos(lastAngle * Math.PI / 180 + arc * Math.PI / 180 / 2) * 200;
            g.y = 200 + Math.sin(lastAngle * Math.PI / 180 + arc * Math.PI / 180 / 2) * 200;
            g.touchEnabled = false;
            g.rotation = (lastAngle * Math.PI / 180 + arc * Math.PI / 180 / 2 + Math.PI / 2) * 180 / Math.PI;
            // var s: egret.Shape = new egret.Shape();
            // s.graphics.beginFill(0x000000, 0);
            // s.graphics.lineStyle(1, 0xf2f2f2);
            // s.graphics.drawRect(0, 0, g.width, g.height);
            // s.graphics.endFill();
            // g.addChild(s);
            var label = new eui.Label(this.awards[i]);
            label.textColor = 0xE5302F;
            label.size = 18;
            // label.horizontalCenter = 50;
            label.x = -label.width / 2;
            label.y = 10;
            g.addChild(label);
            var img = new egret.Bitmap();
            var texture = RES.getRes((i % 5 + 1) + "_png");
            img.texture = texture;
            img.x = -img.width / 2;
            img.y = label.height + 20;
            g.addChild(img);
            this.main.addChild(g);
        }
        var jt = new eui.Image();
        var texture = RES.getRes("jt2_png");
        jt.texture = texture;
        jt.horizontalCenter = 0;
        jt.verticalCenter = 0;
        jt.addEventListener(Mouse.START, this.down, this);
        this.addChild(jt);
    };
    CircleSector.prototype.down = function (event) {
        var item = this.rnd(1, this.awards.length);
        this.rotateFn(item, this.awards[item - 1]);
    };
    CircleSector.prototype.rnd = function (n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);
        return random;
    };
    CircleSector.prototype.rotateFn = function (item, txt) {
        var angles = item * (360 / this.awards.length) - (360 / (this.awards.length * 2));
        if (angles < 270) {
            angles = 270 - angles;
        }
        else {
            angles = 360 - angles + 270;
        }
        egret.Tween.pauseTweens(this.main);
        egret.Tween.get(this.main).to({ rotation: angles + 1800 }, 8000, egret.Ease.sineOut)
            .call(this.onComplete, this, [txt]); //设置回调函数及作用域，可用于侦听动画完成;
    };
    CircleSector.prototype.dispose = function () {
        egret.Tween.pauseTweens(this.main);
        // egret.Tween.removeTweens(this.main);
    };
    CircleSector.prototype.onComplete = function (param1) {
        alert(param1);
    };
    /**
     * 画弧形方法
     */
    CircleSector.prototype.drawArc = function (mc, x, y, r, angle, startFrom, color) {
        if (x === void 0) { x = 200; }
        if (y === void 0) { y = 200; }
        if (r === void 0) { r = 100; }
        if (angle === void 0) { angle = 27; }
        if (startFrom === void 0) { startFrom = 270; }
        if (color === void 0) { color = 0xff0000; }
        mc.graphics.beginFill(color, 50);
        mc.graphics.lineStyle(0, color);
        mc.graphics.moveTo(x, y);
        angle = (Math.abs(angle) > 360) ? 360 : angle;
        var n = Math.ceil(Math.abs(angle) / 45);
        var angleA = angle / n;
        angleA = angleA * Math.PI / 180;
        startFrom = startFrom * Math.PI / 180;
        mc.graphics.lineTo(x + r * Math.cos(startFrom), y + r * Math.sin(startFrom));
        for (var i = 1; i <= n; i++) {
            startFrom += angleA;
            var angleMid = startFrom - angleA / 2;
            var bx = x + r / Math.cos(angleA / 2) * Math.cos(angleMid);
            var by = y + r / Math.cos(angleA / 2) * Math.sin(angleMid);
            var cx = x + r * Math.cos(startFrom);
            var cy = y + r * Math.sin(startFrom);
            mc.graphics.curveTo(bx, by, cx, cy);
        }
        if (angle != 360) {
            mc.graphics.lineTo(x, y);
        }
        mc.graphics.endFill();
    };
    return CircleSector;
}(eui.Group));
__reflect(CircleSector.prototype, "CircleSector", ["IUUContainer"]);
// TypeScript file
/**
 * 预览
 */
var Preview = (function (_super) {
    __extends(Preview, _super);
    // w: number = 1200;
    // h: number = 900;
    function Preview() {
        var _this = _super.call(this) || this;
        _this.displayList = [];
        _this.pages = [];
        _this.pageIndex = 0;
        _this.displayGroup = new eui.Group();
        // this.tool = new TransformTool(this);
        _this.getPages();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStageInit, _this);
        return _this;
    }
    Preview.prototype.onAddToStageInit = function (event) {
        this.initEui();
        this.init();
        // initEvent();
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
            this.addResources(this.pageIndex);
            this.render();
        }
    };
    Preview.prototype.next = function (event) {
        if (this.pageIndex < this.pages.length - 1) {
            this.reset();
            this.pageIndex++;
            this.addResources(this.pageIndex);
            this.render();
        }
    };
    Preview.prototype.init = function () {
        this.addResources(this.pageIndex);
        // this.setupTool();
        // selects pictures on mouse down
        this.addEventListener(Mouse.START, this.down, this);
        this.render();
    };
    Preview.prototype.down = function (event) {
        var _this = this;
        console.log(event.target);
        if (this.pages[this.pageIndex].hasOwnProperty("properties") && this.pages[this.pageIndex].properties.hasOwnProperty("triggerGroup")) {
            var triggerGroup = this.pages[this.pageIndex].properties.triggerGroup;
            console.log('triggerGroup...');
            console.log(JSON.stringify(triggerGroup));
            triggerGroup.forEach(function (item) {
                if (item.sourceId == event.target.name) {
                    if (event.target.data.hasOwnProperty("sound")) {
                        var sound = RES.getRes(event.target.data.name);
                        sound.play(0, 1);
                    }
                    else {
                        console.log('item.targetId = ' + item.targetId);
                        egret.Tween.get(_this.getDisplayByName(item.targetId)[0].image).to({ alpha: 0 }, 300, egret.Ease.sineIn);
                    }
                }
            });
            // 可拖拽
            var elements = this.pages[this.pageIndex].elements;
            if (elements.some(function (item) { return item.id == event.target.name; })) {
                if (event.target.data.property.drag) {
                }
            }
        }
        event.preventDefault();
    };
    Preview.prototype.getDisplayByName = function (name) {
        return this.displayList.filter(function (item) {
            return item.image.name == name;
        });
    };
    Preview.prototype.addResources = function (index) {
        var i = 0;
        var elements = this.pages[index].elements;
        console.log('elements...');
        console.log(JSON.stringify(elements));
        // var triggerGroup = this.pages[index].properties.triggerGroup;
        var n = elements.length;
        for (i = 0; i < n; i++) {
            switch (elements[i].type) {
                case 1:
                    var label = new UULabel();
                    label.text = elements[i].content;
                    label.textColor = 0xff0000;
                    label.size = 16;
                    label.lineSpacing = 12;
                    label.textAlign = egret.HorizontalAlign.JUSTIFY;
                    label.name = elements[i].id;
                    label.data = elements[i];
                    this.displayList.push(new Picture(label, elements[i].matrix));
                    break;
                case 2:
                    var result = new UUImage();
                    var texture = RES.getRes(elements[i].name);
                    // result.texture = texture;
                    result.source = texture;
                    result.name = elements[i].id;
                    result.data = elements[i];
                    this.displayList.push(new Picture(result, elements[i].matrix));
                    break;
                case 18:
                    var soundBtn = new SoundButton();
                    soundBtn.label = elements[i].name;
                    // var texture:egret.Texture = RES.getRes(elements[i].name);
                    // result.source = texture;
                    soundBtn.name = elements[i].id;
                    soundBtn.data = elements[i];
                    this.displayList.push(new Picture(soundBtn, elements[i].matrix));
                    break;
                case 101:
                    var circle = new CircleSector();
                    circle.data = elements[i];
                    circle.width = 400;
                    circle.height = 400;
                    circle.name = elements[i].id;
                    circle.data = elements[i];
                    this.displayList.push(new Picture(circle, elements[i].matrix));
                    break;
                case 8:
                    // this.createGameScene();
                    this.displayList.push(new Picture(this, elements[i].matrix));
                    break;
            }
        }
    };
    Preview.prototype.render = function () {
        this.clear();
        this.drawDisplayList();
        // this.tool.draw();
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
            // }
        }
    };
    return Preview;
}(eui.Component));
__reflect(Preview.prototype, "Preview");
/**
 * 声音组件
 */
var SoundButton = (function (_super) {
    __extends(SoundButton, _super);
    function SoundButton() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    SoundButton.prototype.onAddToStage = function (event) {
        this.init();
        // this.bindHandler();
    };
    SoundButton.prototype.init = function () {
    };
    return SoundButton;
}(eui.Button));
__reflect(SoundButton.prototype, "SoundButton");
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
        console.log(this.regX, this.regY);
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
// TypeScript file
/**
 * 图形基类
 */
var UUBitmap = (function (_super) {
    __extends(UUBitmap, _super);
    function UUBitmap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UUBitmap;
}(egret.Bitmap));
__reflect(UUBitmap.prototype, "UUBitmap");
// TypeScript file
/**
 * 图片组件
 */
var UUImage = (function (_super) {
    __extends(UUImage, _super);
    function UUImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UUImage;
}(eui.Image));
__reflect(UUImage.prototype, "UUImage");
// TypeScript file
/**
 * 文字组件
 */
var UULabel = (function (_super) {
    __extends(UULabel, _super);
    function UULabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UULabel;
}(eui.Label));
__reflect(UULabel.prototype, "UULabel");
