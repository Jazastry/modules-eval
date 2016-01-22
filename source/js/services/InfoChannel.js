var infoChannelService = (function(){
	function InfoChannelService () {
		this.channels = {
			'info_channel_A': {
				'name': 'info_channel_A',
				'listeners': [],
				'info': ''
			},
			'info_channel_B': {
				'name': 'info_channel_B',
				'listeners': [],
				'info': ''
			},
			'info_channel_C': {
				'name': 'info_channel_C',
				'listeners': [],
				'info': ''
			}
		};
	}

	InfoChannelService.prototype.connect = function(chanelName, listener, callback) {
		var _this = this;
		var listenerObj = {'listener': listener, 'callback': callback};

		_this.channels[chanelName].listeners.push(listenerObj);
	};

	InfoChannelService.prototype.disconnect = function(chanelName, listener) {
		var _this = this;
		var listeners =_this.channels[chanelName].listeners;

		for (var i = 0; i < listeners.length; i++) {
			if( listeners[ i ].listener === listener ) {
		    listeners.splice( i, 1 );
		    console.log('disconnected chanelName, listener ' , chanelName, listener);
		    return true;
		  }
		}		 
		
		return false;
	};

	InfoChannelService.prototype.broadcast = function(chanelName, info) {
		var _this = this;
		var listeners = _this.channels[chanelName].listeners;

		
		for (var i = 0; i < listeners.length; i++) {
			listeners[i].callback(info, chanelName);
		}

		_this.channels[chanelName].info = info;	
	};

	InfoChannelService.prototype.getInfo = function(chanelName) {
		var _this = this;

		return _this.channels[chanelName].info ? _this.channels[chanelName].info : '';
	};

	return new InfoChannelService();
}());