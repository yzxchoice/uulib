// TypeScript file
/**
 * 可操作对象容器
 */
class Picture {
    image: any;
    transform: any;
    b: boolean;
    constructor (image, m, b:boolean = true) {
        this.image = image;
        this.b = b;
        var matrix = new Matrix(m.a, m.b, m.c, m.d, m.x, m.y);
        this.transform = new Transformable(image.width, image.height, matrix, this);
        // if(this.image.data.pro)
    }


    draw (container) {
        console.log('Picture draw...');
        let data = this.image.data;
        // if(data.type == 1){
        //     let property = data.property || {};
        //     let { size, textColor } = property;              
        //     this.image.text = data.content;
        //     this.image.textColor = textColor || 0xff0000;
        //     this.image.size = size || 16;
        // }
        var m = this.transform.matrix;
        this.image.matrix = new egret.Matrix(m.a,m.b,m.c,m.d,m.x,m.y);
        
        container.addChild(this.image);
    }

    undraw (container) {
        container.removeChild(this.image);
    }
}