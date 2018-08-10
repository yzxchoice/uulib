// TypeScript file
class EgretControl extends Control {

    private controlShape:egret.Shape = new egret.Shape();

    constructor (type: any, u?: any, v?: any, offsetX?: number, offsetY?: number, size?: number) {
        super(type, u, v, offsetX, offsetY, size);
    }

    undraw () {
        var controlShape:egret.Shape = this.controlShape;
        controlShape.graphics.clear();
    }

    draw (container: any) {
        // for custom drawing methods, call
        // that method and skip standard drawing
        // if it returns false
        if (this.drawCallback !== null){
            if (!this.drawCallback(this, container)){
                return;
            }
        }
        
        // do not draw for non-positive sizes
        if (this.size <= 0){
            return;
        }
        
        var x = 0;
        var y = 0;
        

        var controlShape:egret.Shape = this.controlShape;
        container.addChild(controlShape);
        // ctx.save();
        // ctx.beginPath();
        
        var fillStyle = this.tool.fillStyle;
        var strokeStyle = this.tool.strokeStyle;
        var lineWidth = this.tool.lineWidth;

        controlShape.graphics.clear();

        // controlShape.graphics.beginFill(this.tool.fillStyle, 1);
        // controlShape.graphics.lineStyle(2, this.tool.strokeStyle);
        
        switch(this.shape){
            
            case ControlType.SHAPE_CIRCLE:{
                // ctx.arc(this.x,this.y,this.size/2,0,Math.PI*2);
                // ctx.fill();
                // ctx.stroke();
                controlShape.graphics.beginFill(fillStyle, 1);
                controlShape.graphics.lineStyle(lineWidth, strokeStyle);
                controlShape.graphics.drawCircle(this.x, this.y, this.size/2);
                controlShape.graphics.endFill();
                break;
            }
            
            case ControlType.SHAPE_SQUARE:{
                x = (this.x - this.size/2)|0;
                y = (this.y - this.size/2)|0;
                // ctx.fillRect(x, y, this.size, this.size);
                // ctx.strokeRect(x, y, this.size, this.size);
                controlShape.graphics.beginFill(fillStyle, 1);
                controlShape.graphics.lineStyle(lineWidth, strokeStyle);
                controlShape.graphics.drawRect(x, y, this.size, this.size);
                controlShape.graphics.endFill();
                break;
            }
            
            case ControlType.SHAPE_BORDER:{
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
            
            default:{
                // no draw
                break;
            }
        }
        
        // ctx.restore();
    }
}