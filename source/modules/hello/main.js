function HelloModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
}

HelloModule.prototype.loadModule = function() {
    var _this = this;
    $(_this.containerElement).find('.hello_button').on('click', function(e){
   		alert('HELLO');
    });
};

HelloModule.prototype.remove = function() {
	var _this = this;

	$(_this.containerElement).children().remove();
};
