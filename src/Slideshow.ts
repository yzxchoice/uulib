// TypeScript file
/**
 * 轮播图组件
 */
class Slideshow extends eui.Group implements IUUBase, IUUContainer {
    data: any;
    layerName:string = '轮播图'
    container: any;
    width:number = 600;
    height:number = 400;
    static uuType = UUType.SLIDESHOW;
    private activeIndex: number = 0;
    private duration: number = 500;
    private delayed: number = 100; 
    draw (): void {
        
    }
	dispose(){

	}
    awards = [    
		{
			url: '/assets/pic/post_item_44.png'
		},
		{
			url: '/assets/pic/post_item_45.png'
		},
		{
			url: '/assets/pic/post_item_42.png'
		},
		{
			url: '/assets/pic/post_item_43.png'
		},
		{
			url: '/assets/pic/post_item_46.png'
		},
    ];
    private imgBox: eui.Group;
    constructor () {
        super();
        this.touchEnabled = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    getProps () {
        return {
            awards: this.awards
        }
    }

    setProps (d) {
        this.awards = d;
    }

    private onAddToStage (event:egret.Event) {
		this.init()
    }

    private onRemoveFromStage (event: egret.Event) {

    }

	private async init(){
		var hLayout:eui.HorizontalLayout = new eui.HorizontalLayout();
        hLayout.gap = 10;
        hLayout.paddingTop = 30;
        hLayout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
		hLayout.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.layout = hLayout;   /// 水平布局
		let btn_left = new eui.Button();
        btn_left.width = 80;
		btn_left.label = 'left';
        btn_left.enabled = true;
        btn_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclickLeft, this);
		let btn_right = new eui.Button();
        btn_right.width = 80;
		btn_right.label = 'right';
        btn_right.enabled = true;        
        btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclickRight, this);        
		let group = new eui.Group();
        group.width = 600;
        group.height = 400;
		this.imgBox = group;        
		this.resetImgBox();
		this.addChild(btn_left);
		this.addChild(group);
		this.addChild(btn_right);		
	}
    private onclickLeft(){
        if(this.activeIndex <= 0) return;
        let image = this.imgBox.getChildAt(0);
        var tw = egret.Tween.get( image );
        tw.to( { x:image.width }, this.duration )
            .call(() => { 
                this.imgBox.setChildIndex(image, this.imgBox.numChildren);
                tw.to({ x: 0 }, this.duration)
                    .call(() => {
                        setTimeout(() => {
                            this.activeIndex -= 1;
                            this.resetLeft();
                        }, 10);
                    })
            } )
            .wait( this.delayed );
    }
    private onclickRight(){
        if(this.activeIndex >= this.awards.length) return;
        let image = this.imgBox.getChildAt(this.imgBox.numChildren - 1);
        var tw = egret.Tween.get( image );
        tw.to( { x:image.width }, this.duration )
            .call(() => { 
                this.imgBox.setChildIndex(image, 1);
                tw.to({ x: 0 }, this.duration)
                    .call(() => {
                        setTimeout(() => {
                            this.activeIndex += 1;
                            this.resetRight();
                        }, 10);
                    })
            } )
            .wait( this.delayed );
    }
    private resetLeft(){
        console.log('resetLeft...');
        let item = this.awards.shift();
        this.awards.push(item);
        this.resetImgBox();
    }
    private resetRight(){
        console.log('resetRight..'); 
        let item = this.awards.pop();
        this.awards.unshift(item);
        this.resetImgBox();
    }
    private async resetImgBox(){
        this.imgBox.removeChildren();
        for (let i = 0, len = this.awards.length; i< len; i++){
 			var img: egret.Bitmap = new egret.Bitmap();
            var t = await Utils.getTexture("resource/"+this.awards[i].url);
            img.width = this.imgBox.width;
            img.height = this.imgBox.height;            
            img.texture = <egret.Texture>t;
            this.imgBox.addChild(img)
		}
    }
}