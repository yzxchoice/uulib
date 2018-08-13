// TypeScript file
/**
 * 预览
 */
class Preview extends eui.Component {
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
        this.initEui();
        this.init(); 
        // initEvent();
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
        // this.setupTool();
	
        // selects pictures on mouse down
        this.addEventListener(Mouse.START, this.down, this);

        this.render();
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
            // 可拖拽
            let elements = this.pages[this.pageIndex].elements;
            if(elements.some(item => item.id == event.target.name)){
                if(event.target.data.property.drag){
                   
                }
            }
            
        }
        
        event.preventDefault();
    }

    private getDisplayByName (name: string) {
        return this.displayList.filter( item => 
            item.image.name == name
        )
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
                    var result:UUImage = new UUImage();
                    var texture:egret.Texture = RES.getRes(elements[i].name);
                    // result.texture = texture;
                    result.source = texture;
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
            }
            
        }
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
            // }
        }
    }

}