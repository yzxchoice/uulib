class Transformable {
    width: number = 0;
    height: number = 0;
    matrix: any;
    owner: any;
    changed: any;
    constructor (width: number, height:number, matrix: any, owner: any) {
        this.width = width;
        this.height = height;
        this.matrix = matrix;
        this.owner = owner;
        this.changed = null;
    }
}