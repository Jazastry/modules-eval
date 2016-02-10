function ttService(url) {
    var cache, notify;
    var ws;

    var baseUrl = "http://" + url;
    var wsUrl = "ws://" + url + "/notifications";

    // ------------------------------------- LOGGING --------------------------------------

    var logd = function(msg) { 
        //console.log("%c"+msg, "color:black");
    }
    var logi = function(msg) {
        console.log("%c"+msg, "color:blue");
    }
    var logw = function(msg) {
        console.log("%c"+msg, "color:darkred");
    }
    var loge = function(msg) {
        console.log("%c"+msg, "color:red");
    }
    
    // ----------------------------------- WEB SOCKETS ------------------------------------

    var onWsConnect = function () {
        logd("Websocket connected");
    }

    var onWsError = function (err) {
        logd("Websocket error " + err);
    }

    var onWsMessage = function (msg) {
        logi("Websocket message: " + msg.data);
    }

    var connectWebSocket = function() {
        ws = new WebSocket( wsUrl );
        ws.onopen = function () { onWsConnect(); } 
        ws.onerror = function (error) { onWsError(error); } 
        ws.onmessage = function (msg) { onWsMessage(msg); } 
    }

    // ----------------------------- PRIVATE METHODS --------------------------------------

    var getSystemInfo = function () {
        $.ajax( baseUrl + "/system", {
            type: "GET",
            complete: function(xhr,status) { 
                if (xhr.status == 200) {
                    cache.system = xhr.responseJSON;
                    logd("Got system info");
                } else {
                    logw("Failed to get system info");
                }
            },
        })
    }

    var setVolume = function (id, property, value) {
        for (i in cache.volumes) {
            if (cache.volumes[i].id == id)
                cache.volumes[i][property] = value;
        }
    }

    var getVolumes = function () {
        if (cache.volumes.length != 0)
            return;
        $.ajax( baseUrl + "/volumes", {
            type: "GET",
            complete: function(xhr,status) { 
                if (xhr.status == 200) {
                    var i;
                    cache.volumes = xhr.responseJSON;
                    for (i in cache.volumes)
                        notifyVolumes("volume.add", cache.volumes[i].id);
                } else {
                    logw("Failed to get volumes");
                }
            }
        })
    }

    var notifyVolumes = function(op, id) {
        notify.volumes.forEach(function(f) {  f(op, id); });
    }

    var reset = function () {
        cache = { "volumes" : [] };
        notify = { "volumes" : [] };
        connectWebSocket();
        getSystemInfo();
        getVolumes(); 
    }

    // ------------------------------ PUBLIC METHODS ---------------------------------------

    this.getVolume = function (id) {
        for (i in cache.volumes) {
            if (cache.volumes[i].id == id)
                return cache.volumes[i];
        }
        return null;
    }

    this.shareVolume = function (id, manage, share) {
        $.ajax( baseUrl + "/volumes/" + id + "/sharing", {
            type: "POST",
            complete: function(xhr,status) { 
                if (xhr.status == 200) {
                    logi("Changed volume " + id + " share to " + manage + ", " + share);
                    setVolume(id, "manage", manage);
                    setVolume(id, "shared", share);
                    notifyVolumes("volume.update", id);
                } else {
                    logw("Share changes to volume " + id + " FAIL");
                }
            },
            dataType: "json",
            data:JSON.stringify({"manage": manage, "share": share })
        })
    }

    this.subscribeVolumes = function (f) {
        var i;
        for (i in notify.volumes)
            if (notify.volumes[i] == f)
                return;
        notify.volumes.push(f);
        for (i in cache.volumes)
            f("volume.add", cache.volumes[i].id);
    }

    this.unsubscribeVolumes = function (f) {
        notify.volumes  = notify.volumes.filter( function(item) { if (item !== f) { return item; } });
    }

    reset();
}
