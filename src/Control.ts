
/**
 * transform 枚举
 */
enum ControlType {
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
    SHAPE_BORDER = 3
}

class Control {
    protected tool: any;
    private type: any;

    protected x: number;
    protected y: number;

    private offsetX: number;
    private offsetY: number;

    public hitTestTarget: boolean = false;
    protected size: number;
    protected shape: any = null;

    private u: any;
    private v: any;

    public dynamicUV: boolean = false;
    protected drawCallback: any;
    private transformCallback: any = null;

    constructor (type?: any, u?: any, v?: any, offsetX?: number, offsetY?: number, size?: number) {
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

    setDefaultShape () {
        switch(this.type){
		
            case ControlType.ROTATE:
            case ControlType.ROTATE_SCALE:
            case ControlType.REGISTRATION:{
                this.shape = ControlType.SHAPE_CIRCLE;
                break;
            }
            
            case ControlType.SCALE:
            case ControlType.SCALE_UNIFORM:
            case ControlType.SCALE_X:
            case ControlType.SCALE_Y:
            case ControlType.SKEW_X:
            case ControlType.SKEW_Y:{
                this.shape = ControlType.SHAPE_SQUARE;
                break;
            }
            case ControlType.BORDER:{
                this.shape = ControlType.SHAPE_BORDER;
                break;
            }
        }
    }

    /**
     * 更新操作框坐标
     */
    updatePosition () {
        if (!this.tool || !this.tool.target){
            return;
        }
        
        if (this.type === ControlType.REGISTRATION){
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
        if (this.offsetX){
            angle = m.getRotationX();
            this.x += this.offsetX * Math.cos(angle);
            this.y += this.offsetX * Math.sin(angle);
        }
        if (this.offsetY){
            angle = m.getRotationY();
            this.x += this.offsetY * Math.sin(angle);
            this.y += this.offsetY * Math.cos(angle);
        }
    }

    /**
     * 画操作框形状
     */
    draw (ctx: any) {
        // for custom drawing methods, call
        // that method and skip standard drawing
        // if it returns false
        if (this.drawCallback !== null){
            if (!this.drawCallback(this, ctx)){
                return;
            }
        }
        
        // do not draw for non-positive sizes
        if (this.size <= 0){
            return;
        }
        
        var x = 0;
        var y = 0;
        
        ctx.save();
        ctx.beginPath();
        
        ctx.fillStyle = this.tool.fillStyle;
        ctx.strokeStyle = this.tool.strokeStyle;
        ctx.lineWidth = this.tool.lineWidth;
        
        switch(this.shape){
            
            case ControlType.SHAPE_CIRCLE:{
                ctx.arc(this.x,this.y,this.size/2,0,Math.PI*2);
                ctx.fill();
                ctx.stroke();
                break;
            }
            
            case ControlType.SHAPE_SQUARE:{
                x = (this.x - this.size/2)|0;
                y = (this.y - this.size/2)|0;
                ctx.fillRect(x, y, this.size, this.size);
                ctx.strokeRect(x, y, this.size, this.size);
                break;
            }
            
            case ControlType.SHAPE_BORDER:{
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
            
            default:{
                // no draw
                break;
            }
        }
        
        ctx.restore();
    }

    contains (x: number, y: number) {
        if (this.hitTestTarget){
            var t = this.tool.target;
            return t.matrix.containsPoint(x, y, t.width, t.height);
            
        }else{
            
            var cx = Math.abs(this.x - x);
            var cy = Math.abs(this.y - y);
            var sr = this.size/2;
            if (cx < sr && cy < sr){
                return true;
            }
        }
        
        return false;
    }
}
