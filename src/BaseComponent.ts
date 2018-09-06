

class BaseComponent extends eui.Group implements IUUComponent {
	awards: Array<IResource>
    tweens: Array<egret.Tween>

	public constructor() {
		super();
	}

	getProps () {
        return {
            awards: this.awards
        }
    }

	setProps (d: IComponentData) {
        this.awards = d.awards;
    }

    redraw () {
        
    }

    /**
     * 切换页和删除图层的时候回收组件释放当前组件动画等
     */
    dispose () {
        for (let t of this.tweens) {
            t.pause();
        }
        egret.Tween.removeAllTweens();
        this.tweens = [];
    }
}