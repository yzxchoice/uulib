// TypeScript file
/**
 * 预览
 */
class Preview extends eui.Group {
    private displayList = [];
    tool: any;
    pages = [];
    private pageIndex: number = 0;
    // w: number = 1200;
    // h: number = 900;
    public constructor () {
        super();
        
        // this.tool = new TransformTool(this);
        this.getPages();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageInit, this);
    }

    private onAddToStageInit(event:egret.Event) {
        this.tool = new TransformTool(this);
        this.bindHandlers();
        this.initEui();
        this.init(); 
        // initEvent();
        
    }

    private bindHandlers () {
        this.render = this.render.bind(this);
        // this.addSinglePicture = this.addSinglePicture.bind(this);
    }

    private initEui() {

        var bg:egret.Shape = new egret.Shape;
        bg.graphics.beginFill(0xffffff,1);
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
        
        
    }

    private displayGroup: eui.Group = new eui.Group();


    private getPages () {
        console.log(RES.getRes("data_json"));
        this.pages = RES.getRes("data_json").list;
    }

    private pre (event: egret.TouchEvent) {
        if(this.pageIndex > 0){
            this.reset();
            this.pageIndex --;
            this.addResources(this.pageIndex);
            this.render();
        }
    }

    private next (event: egret.TouchEvent) {
        if(this.pageIndex < this.pages.length - 1){
            this.reset();
            this.pageIndex ++;
            this.addResources(this.pageIndex);
            this.render();
        }
    }

    private init (): void {
        this.addResources(this.pageIndex);
        this.setupTool();
	
        // selects pictures on mouse down
        this.addEventListener(Mouse.START, this.down, this);

        this.render();
    }

    setupTool () {
        ControlSet.controlClass = EgretControl;
        // var controls = this.getCustomControls();
        this.tool.setControls(ControlSet.getUniformScaler());	
    }

    private getFrame () {
        var temp = [];
        var eles = this.pages[this.pageIndex].elements;
        for (var i=0;i<eles.length;i++){
            if(eles[i].type == 102){
                temp.push(this.displayList[i]);
            }
        }
        return temp;
    }

    down (event: egret.TouchEvent) {
        console.log(event.target);
        if(this.pages[this.pageIndex].hasOwnProperty("properties") && this.pages[this.pageIndex].properties.hasOwnProperty("triggerGroup")){
        
            var triggerGroup = this.pages[this.pageIndex].properties.triggerGroup;
            console.log('triggerGroup...');
            console.log(JSON.stringify(triggerGroup));
            triggerGroup.forEach( (item) => {
                if(item.sourceId == event.target.name){
                    if(event.target.data.hasOwnProperty("sound")){
                        var sound:egret.Sound = RES.getRes(event.target.data.name);
                        sound.play(0, 1);
                    }else {
                        console.log('item.targetId = ' + item.targetId);
                        egret.Tween.get( this.getDisplayByName(item.targetId)[0].image ).to( {alpha: 0}, 300, egret.Ease.sineIn );
                    }
                    
                }
            })
            
        }

        

        Mouse.get(event, this);
        var controlled = this.tool.start(Mouse.x, Mouse.y);

        if(!this.containsPoint(Mouse.x, Mouse.y)){
            return false;
        }
        
        if (!controlled && this.selectImage(Mouse.x, Mouse.y)){
            controlled = this.tool.start(Mouse.x, Mouse.y, this.findControlByType(ControlType.TRANSLATE)); 
        }
        
        if (controlled){
            this.addEventListener(Mouse.MOVE, this.move, this);
            this.addEventListener(Mouse.END, this.up, this);
        }
        
        event.preventDefault();
    }

    move (event: egret.TouchEvent) {
        Mouse.get(event, this);
        this.applyDynamicControls(event);
        this.tool.move(Mouse.x, Mouse.y);   
        
        requestAnimationFrame(this.render);
        event.preventDefault();
    }

    up (event: egret.TouchEvent) {

        this.tool.end();

        if(this.inter()){
            console.log('in');
            var m = this.tool.target.matrix;
            this.tool.target.matrix = new Matrix(m.a,m.b,m.c,m.d,this.inter().x,this.inter().y);
        }
	
        this.removeEventListener(Mouse.MOVE, this.move, this);
        this.removeEventListener(Mouse.END, this.up, this);
        
        requestAnimationFrame(this.render);
        event.preventDefault();
    }

    findControlByType(type: any) {
        var i = 0;
        var n = this.tool.controls.length;
        for (i=0; i<n; i++){
            if (this.tool.controls[i].type == type){
                return this.tool.controls[i];
            }
        }
        return null;
    }

    applyDynamicControls (event: any) {
        // if dynamic, set controls based on 
        // keyboard keys
        var dyn = this.getDynamicControl();
        console.log('dyn:'+dyn);
        if (dyn){
            if (event.ctrlKey){
                if (event.shiftKey){
                    dyn.type = ControlType.ROTATE_SCALE;
                }else{
                    dyn.type = ControlType.ROTATE;
                }
            }else if (event.shiftKey){
                dyn.type = ControlType.SCALE;
            }else{
                dyn.type = ControlType.TRANSLATE;
            }
        }
    }

    getDynamicControl () {
        var i = 0;
        var n = this.tool.controls.length;
        for (i=0; i<n; i++){
            if (this.tool.controls[i].dynamicUV){
                return this.tool.controls[i];
            }
        }
        return null;
    }

    containsPoint (x: number, y: number) {
        var globalEdit: egret.Point = this.parent.localToGlobal(this.matrix.tx, this.matrix.ty);
        var globalMouse: egret.Point = this.localToGlobal(Mouse.x, Mouse.y);

        var m: Matrix = new Matrix(
            this.matrix.a,
            this.matrix.b,
            this.matrix.c,
            this.matrix.d,
            globalEdit.x,
            globalEdit.y
        );

        // console.log(globalMouse.x, globalMouse.y)
        // console.log(m.containsPoint(globalMouse.x, globalMouse.y, this.width, this.height));

        return m.containsPoint(globalMouse.x, globalMouse.y, this.width, this.height);
    }

    private getDisplayByName (name: string) {
        return this.displayList.filter( item => 
            item.image.name == name
        )
    }

    inter () {
        var temp = this.getFrame();
        var pic = null;
        var t = null;
        var r: egret.Rectangle = null;
        var i = temp.length;
        var target = this.tool.target.owner.image;
        var rect = new egret.Rectangle(target.x, target.y, target.width, target.height);
        while (i--){
            pic = temp[i];
            t = pic.transform;
            r = new egret.Rectangle(pic.image.x, pic.image.y, pic.image.width, pic.image.height);
            if(r.intersects(rect)){
                return r;
            }
        }

        return null;
    }

    selectImage (x: number, y: number) {
        var pic = null;
        var t = null;
        
        // walk backwards selecting top-most first
        var i = this.displayList.length;
        while (i--){
            pic = this.displayList[i];
            if(!pic.b) return false;
            t = pic.transform;
            if (t.matrix.containsPoint(x, y, t.width, t.height)){
                if (this.tool.target !== t){
                    
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
        let point = new egret.Point(x,y);
        let rect = new egret.Rectangle(0,0,this.width,this.height);
        if(rect.containsPoint(point)){
            this.tool.setTarget(null);            
            return false;
        };
    }

    private addResources (index: number): void {
        
        var i = 0;
        var elements = this.pages[index].elements;
        console.log('elements...');
        console.log(JSON.stringify(elements));
        // var triggerGroup = this.pages[index].properties.triggerGroup;
        var n = elements.length;
        for (i=0; i<n; i++){
            switch (elements[i].type){
                case 1:
                    var label:UULabel = new UULabel();
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
                    var result:UUBitmap = new UUBitmap();
                    var texture:egret.Texture = RES.getRes(elements[i].name);
                    result.texture = texture;
                    result.name = elements[i].id;
                    result.data = elements[i];
                    this.displayList.push(new Picture(result, elements[i].matrix));
                    break;
                case 18:
                    var soundBtn:SoundButton = new SoundButton();
                    soundBtn.label = elements[i].name;
                    // var texture:egret.Texture = RES.getRes(elements[i].name);
                    // result.source = texture;
                    soundBtn.name = elements[i].id;
                    soundBtn.data = elements[i];
                    soundBtn.width = 100;
                    soundBtn.height = 50;
                    this.displayList.push(new Picture(soundBtn, elements[i].matrix));
                    break;
                case 101: 
                    var circle:CircleSector = new CircleSector();
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
                case 99:
                    var bg:UUImage = new UUImage();
                    var texture:egret.Texture = RES.getRes(elements[i].name);
                    bg.texture = texture;
                    // bg.width = this.displayGroup.width;
                    // bg.height = this.displayGroup.height;
                    bg.name = elements[i].id;
                    bg.data = elements[i];
                    this.displayList.push(new Picture(bg, elements[i].matrix, false));
                    break;
                case 102:
                    var c:UUContainer = new UUContainer();
                    c.name = elements[i].id;
                    c.data = elements[i];
                    c.width = 300;
                    c.height = 300;
                    this.displayList.push(new Picture(c, elements[i].matrix));
                    break;
            }
            
        }
        requestAnimationFrame(this.render);
    }

    render () {
        this.clear();
        this.drawDisplayList();
        // this.tool.draw();
    }

    clear () {
        // this.tool.undraw();
    }

    reset () {
        this.clear();
        var i = 0;
        var n = this.displayList.length;
        for (i=0; i<n; i++){
            this.displayList[i].undraw(this.displayGroup);
        }
        this.displayList = [];
    }

    drawDisplayList (): void {
        var i = 0;
        var n = this.displayList.length;
        for (i=0; i<n; i++){
            // if (!targetControl || this.tool.target !== this.displayList[i].transform){
                this.displayList[i].draw(this.displayGroup);
                // 背景图
                let item = this.displayList[i].image;                
                if(item.data.type == 99){
                    this.displayGroup.setChildIndex(item, 0);
                }
            // }
        }
    }

}