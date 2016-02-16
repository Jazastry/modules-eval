function HeaderModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
}

HeaderModule.prototype.loadModule = function() {
    var _this = this;

    _this.loadInteractiveStyles();
    _this.loadClickEvents();
};

HeaderModule.prototype.loadClickEvents = function() {
    var _this = this;

    $(_this.containerElement).find('li').on('click', function(e) {
        var moduleName = $(this).attr('module_name');
        if (moduleName) {
            var moduleContainerElement = '<div class="main_container"><div module="' + moduleName + '"></div></div>';

            $('body').find('.main_container').remove();
            $('body').append(moduleContainerElement);
            modules.renderOneLevelModules($('body'));
        }
    });
};

HeaderModule.prototype.loadInteractiveStyles = function() {
    var _this = this;
    var liCount = $(_this.containerElement).find('li').length;
    var liWidth = (100 / liCount);
    $(_this.containerElement).find('li').width(liWidth+'%');
};

HeaderModule.prototype.remove = function() {
    var _this = this;

    $(_this.containerElement).children().remove();
};
