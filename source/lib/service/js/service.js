function ttService(baseUrl) {
    this.baseUrl = "http://" + baseUrl;
    this.wsUrl = "ws://" + baseUrl + "/notifications";
    this.reset();
}

ttService.prototype.logd = function(msg) { 
    //console.log("%c"+msg, "color:black");
}
ttService.prototype.logi = function(msg) {
    console.log("%c"+msg, "color:blue");
}
ttService.prototype.logw = function(msg) {
    console.log("%c"+msg, "color:darkred");
}
ttService.prototype.loge = function(msg) {
    console.log("%c"+msg, "color:red");
}

ttService.prototype.logVolumes = function() {
    var i;
    this.logd("Caching volumes");
    for (i in this.cache.volumes) {
        this.logd("* " + this.cache.volumes[i].label + " - " + this.cache.volumes[i].id)
    }
}

ttService.prototype.reset = function () {
    this.cache = { "volumes" : [] };
    this.notify = { "volumes" : [] };
    this.connectWebSocket();
    this.getSystemInfo();
    this.getVolumes(); 
}

ttService.prototype.connectWebSocket = function() {
    var self = this;
    this.ws = new WebSocket( this.wsUrl );
    this.ws.onopen = function () { self.onWsConnect(); } 
    this.ws.onerror = function (error) { self.onWsError(error); } 
    this.ws.onmessage = function (msg) { self.onWsMessage(msg); } 
}

ttService.prototype.onWsConnect = function () {
    this.logd("Websocket connected");
}

ttService.prototype.onWsError = function (err) {
    this.logd("Websocket error " + err);
}

ttService.prototype.onWsMessage = function (msg) {
    this.logi("Websocket message: " + msg.data);
}

ttService.prototype.login = function (password, result) {
    var self = this;
    $.ajax( this.baseUrl + "/login", {
        type: "POST",
        dataType: "json",
        data:JSON.stringify({"password": password}),
        complete: function(xhr,status) { result (xhr.status == 200) }
    })
}

ttService.prototype.isLoggedIn = function (result) {
    var self = this;
    $.ajax( this.baseUrl + "/login", {
        type: "GET",
        complete: function(xhr,status) { result (xhr.status == 200) }
    })
}

ttService.prototype.getSystemInfo = function () {
    var self = this;
    $.ajax( this.baseUrl + "/system", {
        type: "GET",
        complete: function(xhr,status) { 
            if (xhr.status == 200) {
                self.cache.system = xhr.responseJSON;
                self.logd("Got system info");
            } else {
                self.logw("Failed to get system info");
            }
        },
    })
}

ttService.prototype.getVolume = function (id) {
    for (i in this.cache.volumes) {
        if (this.cache.volumes[i].id == id)
            return this.cache.volumes[i];
    }
    return null;
}

ttService.prototype.setVolume = function (id, property, value) {
    for (i in this.cache.volumes) {
        if (this.cache.volumes[i].id == id)
            this.cache.volumes[i][property] = value;
    }
}
ttService.prototype.getVolumes = function () {
    var self = this;
    if (this.cache.volumes.length != 0)
       return;
    $.ajax( this.baseUrl + "/volumes", {
        type: "GET",
        complete: function(xhr,status) { 
            if (xhr.status == 200) {
                var i;
                self.cache.volumes = xhr.responseJSON;
                for (i in self.cache.volumes)
                    self.notifyVolumes("volume.add", self.cache.volumes[i].id);
            } else {
                self.logw("Failed to get volumes");
            }
        }
    })
}

ttService.prototype.shareVolume = function (id, manage, share) {
    var self = this;
    $.ajax( this.baseUrl + "/volumes/" + id + "/sharing", {
        type: "POST",
        complete: function(xhr,status) { 
            if (xhr.status == 200) {
                self.logi("Changed volume " + id + " share to " + manage + ", " + share);
                self.setVolume(id, "manage", manage);
                self.setVolume(id, "share", share);
                self.notifyVolumes("volume.update", id);
            } else {
                self.logw("Share changes to volume " + id + " FAIL");
            }
        },
        dataType: "json",
        data:JSON.stringify({"manage": manage, "share": share })
    })
}

ttService.prototype.subscribeVolumes = function (f) {
    var i;
    for (i in this.notify.volumes)
        if (this.notify.volumes[i] == f)
            return;
    this.notify.volumes.push(f);
    for (i in this.cache.volumes)
        f("volume.add", this.cache.volumes[i].id);
}

ttService.prototype.cacheNotifyVolumes = function (f) {
}

ttService.prototype.unsubscribeVolumes = function (f) {
    this.notify.volumes  = this.notify.volumes.filter( function(item) { if (item !== f) { return item; } });
}

ttService.prototype.notifyVolumes = function(op, id) {
    this.notify.volumes.forEach(function(f) {  f(op, id); });
}

ttService.prototype.selfTest = function () {
    var self = this;
    this.logi("ttService self test start");

} 


