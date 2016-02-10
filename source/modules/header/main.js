function HeaderModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
}

HeaderModule.prototype.loadModule = function() {
    var _this = this;

};

HeaderModule.prototype.remove = function() {
	var _this = this;

	$(_this.containerElement).children().remove();
};
