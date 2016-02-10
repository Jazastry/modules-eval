function NavbarLeftModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
}

NavbarLeftModule.prototype.loadModule = function() {
    var _this = this;

    _this.loadEvents();
};

NavbarLeftModule.prototype.remove = function() {
    var _this = this;

    $(_this.containerElement).children().remove();
};

NavbarLeftModule.prototype.loadEvents = function() {
    var _this = this;

    $(_this.containerElement).find('section > div').on('click', function(e){  
        $(_this.containerElement).find('section > ul:visible').toggle('blind', {}, 300);
        $(this).next('ul').toggle( 'blind', {}, 300);
    });
};
