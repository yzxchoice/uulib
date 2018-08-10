class ControlSet {
    static controlClass: any;
    constructor () {
        throw new Error('can not create a instance')
    }
    static getStandard () {
        var translater = new this.controlClass(ControlType.TRANSLATE);
        translater.hitTestTarget = true;
        
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.ROTATE, 0,0, 0,0, 10),
            new this.controlClass(ControlType.ROTATE, 0,1, 0,0, 10),
            new this.controlClass(ControlType.ROTATE, 1,0, 0,0, 10),
            new this.controlClass(ControlType.ROTATE, 1,1, 0,0, 10),
            new this.controlClass(ControlType.SCALE_X, 0,.5, 0,0, 10),
            new this.controlClass(ControlType.SCALE_X, 1,.5, 0,0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5,0, 0,0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5,1, 0,0, 10)
        ];	
    }

    static getScaler () {
        var translater = new this.controlClass(ControlType.TRANSLATE);
        translater.hitTestTarget = true;
        
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.SCALE, 0,0, 0,0, 10),
            new this.controlClass(ControlType.SCALE, 0,1, 0,0, 10),
            new this.controlClass(ControlType.SCALE, 1,0, 0,0, 10),
            new this.controlClass(ControlType.SCALE, 1,1, 0,0, 10),
            new this.controlClass(ControlType.SCALE_X, 0,.5, 0,0, 10),
            new this.controlClass(ControlType.SCALE_X, 1,.5, 0,0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5,0, 0,0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5,1, 0,0, 10)
        ];	
    }

    static getUniformScaler () {
        var translater = new this.controlClass(ControlType.TRANSLATE);
        translater.hitTestTarget = true;
        
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.ROTATE, .5,0, 0,-20, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 0,0, 0,0, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 0,1, 0,0, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 1,0, 0,0, 20),
            new this.controlClass(ControlType.SCALE_UNIFORM, 1,1, 0,0, 20)
        ];	
    }

    static getScalerWithRotate () {
        var translater = new this.controlClass(ControlType.TRANSLATE, 0, 0, 0, 0, -1);
        // translate control is "selected" by clicking
        // on the target's shape, not the control point
        translater.hitTestTarget = true;
        
        return [
            new this.controlClass(ControlType.BORDER),
            translater,
            new this.controlClass(ControlType.ROTATE, .5,0, 0,-20, 10),
            new this.controlClass(ControlType.SCALE, 0,0, 0,0, 10),
            new this.controlClass(ControlType.SCALE, 0,1, 0,0, 10),
            new this.controlClass(ControlType.SCALE, 1,0, 0,0, 10),
            new this.controlClass(ControlType.SCALE, 1,1, 0,0, 10),
            new this.controlClass(ControlType.SCALE_X, 0,.5, 0,0, 10),
            new this.controlClass(ControlType.SCALE_X, 1,.5, 0,0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5,0, 0,0, 10),
            new this.controlClass(ControlType.SCALE_Y, .5,1, 0,0, 10)
        ];	
    }

    static getDynamic () {
        var dyn = new this.controlClass(ControlType.TRANSLATE);
        dyn.dynamicUV = true;
        dyn.hitTestTarget = true;
        
        return [
            new this.controlClass(ControlType.BORDER),
            dyn
        ];	
    }
}