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

	$(_this.containerElement).find('.volume').on('click', function(e){
		if ($(_this.containerElement).find('.volumes_container').attr('opened') === 'true') {
			$(_this.containerElement).find('.volumes_container').attr('opened', 'false');
			$('.volume').height('102px');
			$('.info_container').css('opacity', '0');
			$('.volumes_container').removeClass('col-xl-11').addClass('col-xl-6');
			$('.volume_options_container').css('right', '0px').removeClass('col-xl-1').addClass('col-xl-6');
		} else {
			$(_this.containerElement).find('.volumes_container').attr('opened', 'true');
			$('.volume').height('102px');
			$('.info_container').css('opacity', '1');
			$('.volumes_container').removeClass('col-xl-6').addClass('col-xl-11');
			$('.volume_options_container').css('right', '-186px').removeClass('col-xl-6').addClass('col-xl-1');

		}
	});
};

FakeVolumesModule.prototype.remove = function() {
	var _this = this;

	$(_this.containerElement).children().remove();
};
