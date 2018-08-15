// TypeScript file
class UURequest {
    // private req: egret.HttpRequest = new egret.HttpRequest();
    constructor () {
        
    }

    // start (params): Promise {
    //     return new Promise((resolve, reject) => {
    //         var request: egret.HttpRequest = new egret.HttpRequest();
    //         request.responseType = egret.HttpResponseType.TEXT;
    //         request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //         request.open("http://localhost:8002/template/updateTemplate",egret.HttpMethod.POST);
    //         request.send(params);
    //         request.addEventListener(egret.Event.COMPLETE,function(event:egret.Event) {
    //             var request = <egret.HttpRequest>event.currentTarget;
    //             egret.log("post data : ",request.response);
    //             resolve(request.response);
    //         },this);
    //         request.addEventListener(egret.IOErrorEvent.IO_ERROR,function(event:egret.IOErrorEvent) {
    //             egret.log("post error : " + event);
    //             reject(event);
    //         },this);
    //         request.addEventListener(egret.ProgressEvent.PROGRESS,function(event:egret.ProgressEvent) {
    //             egret.log("post progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
    //             // reject(event);
    //         },this);
    //     });
    // }
}