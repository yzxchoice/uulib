class Card extends eui.Group implements IUUBase, IUUContainer {
	static uuType = UUType.CARD;
	data: any;
	container: any;
	width:number = 800;
    height:number = 600;
	ques: IQuestions = {
		items: [
			{
				select: "toitem1",
				resource: {
					id: "item1",
					url: "assets/pic/post_item_18.png"
				}
			},
			{
				select: "toitem1",
				resource: {
					id: "item2",
					url: "assets/pic/post_item_19.png"
				}
			}
		],
		toItems: [
			{
				select: "item1",
				resource: {
					id: "toitem1",
					url: "assets/pic/post_item_22.png"
				}
			}
		]
	};
	private itemContainer: eui.Group = new eui.Group();
	private toitemContainer: eui.Group = new eui.Group();

	getProps () {
        return {
            ques: this.ques
        }
    }

    setProps (d) {
        this.ques = d;
    }

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage () {

		var vLayout:eui.VerticalLayout = new eui.VerticalLayout();
		this.layout = vLayout;

		
		var hLayout:eui.HorizontalLayout = new eui.HorizontalLayout();
        hLayout.gap = 30;
        hLayout.horizontalAlign = egret.HorizontalAlign.LEFT;
        hLayout.verticalAlign = egret.VerticalAlign.MIDDLE;
        hLayout.paddingRight = 30;
		this.itemContainer.height = 300;
		this.toitemContainer.height = 300;
        this.itemContainer.layout = hLayout;
		this.toitemContainer.layout = hLayout;

		var bg:egret.Shape = new egret.Shape;
		bg.graphics.lineStyle(1,0x999999);
		bg.graphics.beginFill(0xffffff,1);
		bg.graphics.drawRect(0, 0, this.width, this.height);
		bg.graphics.endFill();
		this.addChild(bg);

		this.addChild(this.itemContainer);
		this.addChild(this.toitemContainer);
		this.draw();
	}

	async draw () {
		
		for (let i: number = 0;i<this.ques.items.length; i++) {
			let img: UUImage = new UUImage();
			let t = await Utils.getTexture("resource/"+this.ques.items[i].resource.url);
			img.texture = <egret.Texture>t;
			img.width = 300;
			img.height = 300;
			this.itemContainer.addChild(img);
		}

		for (let i: number = 0;i<this.ques.toItems.length; i++) {
			let img: UUImage = new UUImage();
			let t = await Utils.getTexture("resource/"+this.ques.toItems[i].resource.url);
			img.texture = <egret.Texture>t;
			img.width = 300;
			img.height = 300;
			this.toitemContainer.addChild(img);
		}
	}

	reset () {
		this.itemContainer.removeChildren();
		this.toitemContainer.removeChildren();
	}

	dispose () {

	}
}