function MonitoringModule(containerElement, infoChannel) {
    this.containerElement = containerElement;
    // sets infoChannel if provided, if defaults to 'info_channel_A'
    this.infoChannel = infoChannel ? infoChannel : 'info_channel_A';
    this.loadModule();
}

MonitoringModule.prototype.connect = function(channelName) {
    var _this = this;
    var channel = channelName ? channelName : _this.infoChannel;
    _this.infoChannel = channel;
    _this.disconnect();

    // register module to info-channel 
    infoChannelService.connect(_this.infoChannel, _this, function(message) {
        $(_this.containerElement).find('.info_input').val(message);
    });
};

MonitoringModule.prototype.disconnect = function() {
    var _this = this;

    infoChannelService.disconnect(_this.infoChannel, _this);
};

MonitoringModule.prototype.loadModule = function() {
    var _this = this;

    _this.connect();
    _this.loadChannelInfo();
    _this.loadEvents();
};

MonitoringModule.prototype.loadChannelInfo = function() {
    var _this = this;
    var channel = _this.infoChannel;

    // load chanel name
    $(_this.containerElement).find('.channel_name > span').html(channel);
    $(_this.containerElement).find('.broadcast_button').attr('broadcast-channel', channel);

    // load current info
    var currentMessage = infoChannelService.getInfo(channel);
    $(_this.containerElement).find('.info_input').val(currentMessage);
};

MonitoringModule.prototype.loadEvents = function() {
    var _this = this;

    // register broadcast on click event
    $(_this.containerElement).find('.broadcast_button').on('click', function(e) {
        var channel = _this.infoChannel;
        var message = $(_this.containerElement).find('.info_input').val();

        infoChannelService.broadcast(channel, message, _this);
    });
};

MonitoringModule.prototype.remove = function() {
    var _this = this;


    _this.disconnect();
    $(_this.containerElement).children().remove();
};
