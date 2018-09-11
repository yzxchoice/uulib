class TweenControl extends eui.Group {
	// private ball:egret.Shape;
	private isMoving:boolean = false;

	private _start: egret.Point;
    private _control: egret.Point;
    private _anchor: egret.Point;

	public target:any;
	public tool: TransformTool;
	public data: UUData<null>;
	private tweener: ITween;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage () {

		var btn: eui.Button = new eui.Button();
		btn.label = "go";
		btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.start, this);
		this.addChild(btn);
	}

	start () {
		if (this.isMoving) {
            return;
        }
        this.isMoving = true;
        egret.Tween.get(this).to({factor: 1}, 2000).call(this.moveOver, this);
	}

	private moveOver():void {
        this.isMoving = false;
    }

	public get factor():number {
        return 0;
    }

	setTarget (target: any) {
		
		// this.tool = tool;
		if(!target)  return;
		this.target = target;
		this.data = this.target.data as UUData<null>;

		if(this.data.hasOwnProperty('properties') && this.data.properties.hasOwnProperty('anims')){
			this.tweener = this.data.properties.anims[0];
		}
	}
	
	/**
	 * 设置控制点值
	 */
	public setValue ( start: egret.Point, control?: egret.Point, anchor?: egret.Point) {
		
		this._start = start;
		this._control = control;
		this._anchor = anchor;

	}

    public set factor(value:number) {
		switch ( this.tweener.type ) {
			case animType.circle:
				let PI = Math.PI;
				this.target.x = Math.cos(PI / 180 * (360 * value - 90)) * 100 + this._start.x;
				this.target.y = Math.sin(PI / 180 * (360 * value - 90)) * 100 + this._start.y;
				break;
			case animType.curve:
				this.target.x = (1 - value) * (1 - value) * this._start.x + 2 * value * (1 - value) * this._control.x + value * value * this._anchor.x;
				this.target.y = (1 - value) * (1 - value) * this._start.y + 2 * value * (1 - value) * this._control.y + value * value * this._anchor.y;	
				break;
		}
    }
}