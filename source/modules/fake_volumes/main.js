function FakeVolumesModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
}

FakeVolumesModule.prototype.loadModule = function() {
    var _this = this;

    _this.loadClickEvents();
};

FakeVolumesModule.prototype.loadClickEvents = function() {
	var _this = this;

	var hei = $('body').outerHeight() - $('.module_header').outerHeight() - 40;
	$(_this.containerElement).find('.volume_options_container').height(hei);

	$(_this.containerElement).find('.volume').on('click', function(e){
		if ($(this).hasClass('shrink')) {
			$(_this.containerElement).find('.volume').removeClass('shrink');
			$(_this.containerElement).find('.volume_options_container').removeClass('strech');
			$(_this.containerElement).find('.point_body').hide();
		} else {
			var height = $(this).height();
			$(_this.containerElement).find('.volume').height(height).addClass('shrink');
			$(_this.containerElement).find('.volume_options_container').addClass('strech');
			$(this).find('.point_body').show();
		}
	});
};

FakeVolumesModule.prototype.remove = function() {
	var _this = this;

	$(_this.containerElement).children().remove();
};
