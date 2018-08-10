// TypeScript file
class Picture {
    image: any;
    transform: any;
    constructor (image, m) {
        this.image = image;
        var matrix = new Matrix(m.a, m.b, m.c, m.d, m.x, m.y);
        this.transform = new Transformable(image.width, image.height, matrix, this);
    }

    draw (container) {
        var m = this.transform.matrix;
        this.image.matrix = new egret.Matrix(m.a,m.b,m.c,m.d,m.x,m.y);
        container.addChild(this.image);
    }

    undraw (container) {
        container.removeChild(this.image);
    }
}