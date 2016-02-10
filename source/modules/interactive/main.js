function InteractiveModule(containerElement) {
    this.containerElement = containerElement;
    this.loadEvents();
}

InteractiveModule.prototype.loadEvents = function() {
    var _this = this;
    
    // loop through info channels and load events
    $(_this.containerElement).find('.interactive_channel').each(function(i, channelElement) {
        var channelName = $(channelElement).attr('id');

        // register module to info-channel 
        infoChannelService.connect(channelName, _this, function(message) {
            $(_this.containerElement).find('.interactive_channel[id="' + channelName + '"] input').val(message);
        });

        // load broadcast event
        $(channelElement).find('button').on('click', function(e) {
            var message = $(channelElement).find('input').val();
            infoChannelService.broadcast(channelName, message);
        });
    });
};
