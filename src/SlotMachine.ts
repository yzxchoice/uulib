// TypeScript file
/**
 * 轮播图组件
 */
class SlotMachine extends eui.Group implements IUUBase, IUUContainer, IUUComponent {
    data: any;
    layerName:string = '老虎机'
    container: any;
  
    static uuType = UUType.SLOT_MACHINE;
    
    private btn_start: eui.Button;
    private isAnimating: boolean = false;
    draw (): void {
        
    }
	dispose(){

	}
	private itemWidth: number = 250;
	private itemHeight: number = 250;
	private gap: number = 10;
	private tweenFlag: number = 3; // 动画标记
	// 组件宽、高固定
	width: number = 800;
	height: number = 400;
	// props中用到的参数
	bgColor: string | number = '0x666699';
	bdUrl: string = '/assets/pic/draw_card_bg.png';
	
	private awardsTotal: Array<SlideshowItem> = [    
		{
			url: '/assets/pic/post_item_2.png'
		},
		{
			url: '/assets/pic/post_item_3.png'
		},
		{
			url: '/assets/pic/post_item_1.png'
		},
		{
			url: '/assets/pic/post_item_4.png'
		},
		{
			url: '/assets/pic/post_item_6.png'
		},
		{
			url: '/assets/pic/post_item_5.png'
		},
		{
			url: '/assets/pic/post_item_2.png'
		},
    ];
	private _awards : Array<SlideshowItem> = [    
		{
			url: '/assets/pic/post_item_2.png'
		},
		{
			url: '/assets/pic/post_item_3.png'
		},
		{
			url: '/assets/pic/post_item_1.png'
		},
		{
			url: '/assets/pic/post_item_4.png'
		},
		{
			url: '/assets/pic/post_item_6.png'
		},
		{
			url: '/assets/pic/post_item_5.png'
		},
    ]
	public get awards() : Array<SlideshowItem> {
		return this._awards;
	}
	public set awards(v : Array<SlideshowItem>) {
		this._awards = v;
		let firstItem = v.slice(0,1);
		this.awardsTotal = [...v,...firstItem];
	}
	
    private itemGroup: eui.Group;
    constructor () {
        super();
        this.touchEnabled = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    getProps () {
        return {
			bgColor: this.bgColor,
			bdUrl: this.bdUrl,
            awards: this.awards,
        }
    }

	setProps (d: ISlotMachine) {
        this.awards = d.awards;
		this.bdUrl = d.bdUrl;
		this.bgColor = d.bgColor;
    }

    redraw () {
		this.removeChildren();
		this.init();
    }

    private onAddToStage (event:egret.Event) {
		this.init()
    }

    private onRemoveFromStage (event: egret.Event) {

    }

	private async init(){
		let vLayout = new eui.VerticalLayout();
		vLayout.horizontalAlign = 'center';
		this.layout = vLayout;
        let mainBox = await this.createMainBox();
		let btn = this.createStartBtn();
		this.addChild(mainBox);
		this.addChild(btn);		
	}

	private async createMainBox(){
		let group = new eui.Group();
		group.width = this.width;
		group.height = this.itemHeight + 2 * this.gap;
		// 背景
		let shape = new egret.Shape();
		shape.graphics.beginFill(<number>this.bgColor, 1);
		shape.graphics.drawRect(0, 0, group.width, group.height);
		shape.graphics.endFill();
		// 主容器
		let itemGroup = new eui.Group();
		itemGroup.width = this.width;
		itemGroup.height = group.height;
		this.itemGroup = itemGroup;
		itemGroup.mask = new egret.Rectangle(0,0,itemGroup.width,itemGroup.height);
		// 生成3项竖向轮播图容器
		for(let i = 0, len = 3; i < len; i++){
			let itemBox = await this.createItemBox();
			itemBox.x = (12 + this.itemWidth) * i + 12;
			itemBox.y = this.gap;			
			itemGroup.addChild(itemBox);
		};
		group.addChild(shape);
		group.addChild(itemGroup);
		return group;
	}
	// 竖向轮播图容器
	private async createItemBox(){
		let group = new eui.Group();
		group.width = this.itemWidth;
		group.height = (this.itemWidth + this.gap) * this.awardsTotal.length - this.gap;
		let vLayout = new eui.VerticalLayout();
		vLayout.gap = this.gap;
		vLayout.paddingTop = 0;
		group.layout = vLayout;
		let promiseArr = [];
		for (let i = 0, len = this.awardsTotal.length; i< len; i++){
 			promiseArr.push(this.createItem(this.awardsTotal[i].url));
		};
		await Promise.all(promiseArr).then(itemArr => {
			for(let i = 0, len = itemArr.length; i < len; i++){
				let item = itemArr[i];
				group.addChild(item);
			}
		});
		return group;
	}

	private async createItem(url){
		let group = new eui.Group();
		group.width = this.itemWidth;
		group.height = this.itemHeight;
		let bg = await this.createImg(this.bdUrl);
		let img = await this.createImg(url);
		group.addChild(bg);
		group.addChild(img);
		return group;
	}

	private async createImg(url){
		var img: egret.Bitmap = new egret.Bitmap();
		var t = await Utils.getTexture("resource/"+url);
		img.width = this.itemWidth
		img.height = this.itemHeight;            
		img.texture = <egret.Texture>t;
		return img;
	}

	private createStartBtn(){
		let btn = new eui.Button();
		btn.label = '开始';		
		btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		return btn;
	}

	private onClick(evt: TouchEvent){
		evt.stopPropagation();
		evt.stopImmediatePropagation();
		if(this.tweenFlag !== 3) return;
		this.tweenFlag = 0;
		let stepRandomMax = this.awardsTotal.length - 1;
		let stepRandomMIn = 4;
		let step1 = Math.floor(Math.random() * stepRandomMax) + stepRandomMIn;
		let step2 = Math.floor(Math.random() * stepRandomMax) + stepRandomMIn;
		let step3 = Math.floor(Math.random() * stepRandomMax) + stepRandomMIn;

		let timeRandomMax = (this.awardsTotal.length - 1) * 200;
		let timeRandomMIn = 1000;
		let time1 = Math.floor(Math.random() * timeRandomMax) + timeRandomMIn;
		let time2 = Math.floor(Math.random() * timeRandomMax) + timeRandomMIn;
		let time3 = Math.floor(Math.random() * timeRandomMax) + timeRandomMIn;		
				
		let firstBox = <eui.Group>this.itemGroup.getChildAt(0);
		let secondBox = <eui.Group>this.itemGroup.getChildAt(1);
		let thirdBox = <eui.Group>this.itemGroup.getChildAt(2);

		this.tween(firstBox, step1, time1);
		this.tween(secondBox, step2, time2);
		this.tween(thirdBox, step3, time3);
		
	}

	private tween(item:eui.Group, step: number, duration: number = 500){
		let initY = item.y;
		let addY = -(this.itemHeight + this.gap) * step;
		let totalY = initY + addY;
		let maxY = -(this.itemHeight + this.gap) * (this.awardsTotal.length - 1) + this.gap;
		
		if(totalY < maxY){
			let oneStepTime = duration / step;
			let step1 = (maxY - initY) / -(this.itemHeight + this.gap);
			let step2 = step - step1;
			let time1 = step1 * oneStepTime;
			let time2 = duration - time1;
			
			let t = egret.Tween.get(item);
			t.to({y: maxY }, time1)
				.call(() => {
					item.y = 10;
					this.tween(item, step2, time2);
				})
				
		}else if(totalY > maxY) {
			egret.Tween.get(item)
				.to({y: totalY }, duration)
				.call(() => {
					this.tweenFlag += 1;									
				})
		}else if(totalY == maxY) {
			egret.Tween.get(item)
				.to({y: totalY }, duration)
				.call(() => {
					item.y = 10;
					this.tweenFlag += 1;					
				})
		}
	}
}