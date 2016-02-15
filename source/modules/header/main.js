function HeaderModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
}

HeaderModule.prototype.loadModule = function() {
    var _this = this;

    _this.loadClickEvents();
};

HeaderModule.prototype.loadClickEvents = function() {
    var _this = this;

    $(_this.containerElement).find('li').on('click', function(e) {
        var moduleName = $(this).attr('module_name');
        if (moduleName) {
            var moduleContainerElement = '<div class="main_container"><div module="' + moduleName + '"></div></div>';
            var html = moduleContainerElement;

            $('body').find('.main_container').remove();
            $('body').append(html);
            modules.renderOneLevelModules($('body'));
        }
    });
};

HeaderModule.prototype.remove = function() {
    var _this = this;

    $(_this.containerElement).children().remove();
};
