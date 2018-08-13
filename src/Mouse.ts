class Mouse {
    static x: number = 0;
    static y: number = 0;
    static START = "touchBegin";
    static MOVE = "touchMove";
    static END = "touchEnd";

    constructor () {
        throw new Error('can not create a instance');
    }

    /**
     * 鼠标点击的坐标
     */
    static get (event: egret.TouchEvent, elem: eui.Group) {
        if (!elem){
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
        var targetPoint: egret.Point = elem.globalToLocal(event.stageX, event.stageY);

        Mouse.x = targetPoint.x;
        Mouse.y = targetPoint.y;
        // console.log(Mouse.x,Mouse.y);
    
        // var rect = elem.getBoundingClientRect();
        // Mouse.x += elem.scrollLeft - elem.clientLeft - rect.left;
        // Mouse.y += elem.scrollTop - elem.clientTop - rect.top;
        return Mouse;
    }
}