// TypeScript file
/**
 * 转盘组件
 */
class CircleSector extends BaseComponent implements IUUBase, IUUComponent {
    data: UUData<IComponentData>;
    layerName:string = '转盘'
    container: any;
    width:number = 400;
    height:number = 400;
    static uuType = UUType.CIRCLE_SECTOR;

    tweens: Array<egret.Tween> = [];
    
    awards: Array<IResource> = [    
        {
            text: '文本1',
            url: '/assets/1.png'
        },
        {
            text: '文本2',
            url: '/assets/2.png'
        },
        {
            text: '文本3',
            url: '/assets/3.png'
        },
        {
            text: '文本4',
            url: '/assets/4.png'
        },
        {
            text: '文本5',
            url: '/assets/5.png'
        },
        {
            text: '文本6',
            url: '/assets/5.png'
        }
    ];
    private main: eui.Group = new eui.Group();
    constructor () {
        super();
        this.touchEnabled = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    draw (): void {
        
    }

    private onAddToStage (event:egret.Event) {
        this.init();
        this.drawSector(); 
    }

    private onRemoveFromStage (event: egret.Event) {
        this.dispose();
    }
    
    private init () {
        this.width = 400;
        this.height = 400;
        this.main.anchorOffsetX = 200;
        this.main.anchorOffsetY = 200;
        this.main.x = 200;
        this.main.y = 200;
        var s: egret.Shape = new egret.Shape();
        // s.graphics.beginFill(0x000000, 0.5);
        // s.graphics.lineStyle(1, 0xf2f2f2);
        // s.graphics.drawRect(0, 0, 456, 444);
        // s.graphics.endFill();
        this.main.touchEnabled = false;
        this.main.addChild(s);
        this.addChild(this.main);
    }

    redraw () {
        this.main.removeChildren();
        this.drawSector();
    }

    async drawSector () {
        var shape:egret.Shape = new egret.Shape();
        shape.touchEnabled = true;
        this.main.addChild(shape);
        
        var arc = 360 / this.awards.length;
        var lastAngle = 0;
        var r = 200;

        var fillStyle: any = 0xffffff;
        var strokeStyle: any = 0x007eff;
        var lineWidth: number = 2;

        for (var i = 0; i< this.awards.length; i++){

            if (i % 2 === 0) fillStyle = 0xFFFFFF;
            else             fillStyle = 0xFD5757;
            lastAngle = i * arc;

            this.drawArc(shape,r,r,r,arc,lastAngle,fillStyle);


            var g: eui.Group = new eui.Group();
            g.width = 2 * r * Math.sin(arc * 2 * Math.PI/ 360/2);
            g.height = r;
            g.x = 200 + Math.cos(lastAngle * Math.PI / 180 + arc* Math.PI / 180 / 2) * 200;
            g.y = 200 + Math.sin(lastAngle * Math.PI / 180 + arc* Math.PI / 180 / 2) * 200;
            g.touchEnabled = false;
            g.rotation = (lastAngle * Math.PI / 180 + arc * Math.PI / 180 / 2 + Math.PI /2 ) * 180 / Math.PI;
            // var s: egret.Shape = new egret.Shape();
            // s.graphics.beginFill(0x000000, 0);
            // s.graphics.lineStyle(1, 0xf2f2f2);
            // s.graphics.drawRect(0, 0, g.width, g.height);
            // s.graphics.endFill();
            // g.addChild(s);
            var label: eui.Label = new eui.Label(this.awards[i].text);
            label.textColor = 0xE5302F;
            label.size = 18;
            // label.horizontalCenter = 50;
            label.x = - label.width / 2;
            label.y = 10;
            g.addChild(label);
            var img: egret.Bitmap = new egret.Bitmap();
            // var texture:egret.Texture = RES.getRes((i%5+1)+"_png");
            var t = await Utils.getTexture("resource/"+this.awards[i].url);
            img.texture = <egret.Texture>t;
            img.width = 80;
            img.height = 80;
            img.x = - img.width / 2;
            img.y = label.height + 20;
            g.addChild(img);
            
            this.main.addChild(g);
        }

         var jt: eui.Image = new eui.Image();
        var texture:egret.Texture = RES.getRes("jt2_png");
        jt.texture = texture;
        jt.horizontalCenter = 0;
        jt.verticalCenter = 0;
        jt.addEventListener(Mouse.START, this.down, this);
        this.addChild(jt);

    }

    private down (event: egret.TouchEvent) {
        var item = this.rnd(1,this.awards.length);
        this.rotateFn(item, this.awards[item-1].text);
    }

    private rnd(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
        
    }

    rotateFn (item: number, txt: string) {
        var angles = item * (360 / this.awards.length) - (360 / (this.awards.length*2));
        if(angles<270){
			angles = 270 - angles; 
		}else{
			angles = 360 - angles + 270;
		}
        egret.Tween.pauseTweens(this.main);
		var t = egret.Tween.get( this.main );
        t.to( {rotation: angles+1800}, 8000, egret.Ease.sineOut );
        this.tweens.push(t);
    }

    // dispose () {
    //     egret.Tween.pauseTweens(this.main);
    //     // egret.Tween.removeTweens(this.main);
    // }

    /**
     * 画弧形方法
     */
    drawArc(mc:egret.Shape, x:number=200, y:number=200, r:number=100, angle:number=27, startFrom:number=270, color:number=0xff0000):void {
        mc.graphics.beginFill(color,50);
        mc.graphics.lineStyle(0,color);   
        mc.graphics.moveTo(x,y);
        angle=(Math.abs(angle)>360)?360:angle;
        var n:number=Math.ceil(Math.abs(angle)/45);
        var angleA:number=angle/n;
        angleA=angleA*Math.PI/180;
        startFrom=startFrom*Math.PI/180;
        mc.graphics.lineTo(x+r*Math.cos(startFrom),y+r*Math.sin(startFrom));
        for (var i=1; i<=n; i++) {
            startFrom+=angleA;
            var angleMid=startFrom-angleA/2;
            var bx=x+r/Math.cos(angleA/2)*Math.cos(angleMid);
            var by=y+r/Math.cos(angleA/2)*Math.sin(angleMid);
            var cx=x+r*Math.cos(startFrom);
            var cy=y+r*Math.sin(startFrom);
            mc.graphics.curveTo(bx,by,cx,cy);
        }
        if (angle!=360) {
            mc.graphics.lineTo(x,y);
        }
        mc.graphics.endFill();
    }

}