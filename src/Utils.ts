class Utils {
	public constructor() {
	}

	static getComs () {
		return [UULabel, UUImage, UUContainer, SoundButton, CircleSector, UUBackground, Slideshow, SlotMachine];
	}

	static getTexture(url: string) {
        return new Promise( (resolve, reject) => {
            RES.getResByUrl(url, function(texture:egret.Texture):void {
                resolve(texture);
            }, this, RES.ResourceItem.TYPE_IMAGE);
        })
    }

	static getSound (url: string) {
		return new Promise( (resolve, reject) => {
            var sound = new egret.Sound();
			sound.addEventListener(egret.Event.COMPLETE, (event:egret.Event) => {
				resolve(event.target);
			}, this);
			sound.load(url);
        })
	}

	static trans ( arr: Array<any>, templateId: number) {

		var obj = {
			"groups": [
				{
					"keys": "data_json",
					"name": "preloadpic"
				}
			],
			"resources": [
				{
					"url": templateId + "/data.json",
					"type": "json",
					"name": "data_json"
				}
			]
		}
		arr.forEach( (item, index) => {
			item.elements.forEach ( elem => {
				if(elem.hasOwnProperty('src') && elem.src != ''){
					var n = elem.src.substring(elem.src.lastIndexOf("/")+1).replace('.','_');
					obj.resources.push({
						url: elem.src,
						type: 'image',
						name: n
					})
					obj.groups[0].keys = obj.groups[0].keys == '' ? n : obj.groups[0].keys+','+n;
				}
			})
		})

		return obj;
	}
}
