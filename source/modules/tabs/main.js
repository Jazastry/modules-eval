function TabsModule(containerElement) {
    this.containerElement = containerElement;
    this.currentTabModule = {};
    this.activeTabIndex = 0;
    // contins tab-children parent div without inner HTML
    this.tabChildren = [];

    this.render();
}

TabsModule.prototype.render = function() {
    var _this = this;

    // initialize tabs HTML parts
    _this.tabLabelContainer = $(_this.containerElement).children('.tab_labels_container');
    _this.tabLabel = $(_this.tabLabelContainer).children('.tab_label');
    _this.tabChildren = $(_this.containerElement).children('div[module]');

    // remove unnecessary tab-label HTML template 
    $(_this.tabLabelContainer).children('.tab_label').remove();

    _this.createAppendTabChildrenModule();
    _this.createPrependTabLabels();
    _this.showCurrentModuleAndLabel();
};

TabsModule.prototype.createPrependTabLabels = function() {
    var _this = this;
    var tabs = _this.tabChildren;

    for (var i = 0; i < tabs.length; i++) {
        // get tab name
        var name = $(tabs[i]).attr('module');
        // get clone of tab-label HTML element
        var label = $(_this.tabLabel).clone().html(name).attr('moduleindex', i);

        $(_this.tabLabelContainer).append(label);
    }

    // change current label unactive to active look
    var currentLabel = $(_this.tabLabelContainer).children('.tab_label')[_this.activeTabIndex];
    $(currentLabel).addClass('active');

    // add change tab on click function
    $(_this.tabLabelContainer).find('.tab_label').on('click', function(e) {
        _this.changeTab(this);
    });
};

// called on label click
TabsModule.prototype.changeTab = function(label) {
    var _this = this;

    if (_this.currentTabModule && _this.currentTabModule.remove) {
        _this.currentTabModule.remove();
    }

    // remove currentTabModule HTML parent-element content
    $(_this.containerElement).children('.tab.active').unbind();

    // remove currentTabModule refferences
    $(_this.currentTabModule.containerElement).children().remove();
    modules.removeObject(_this.currentTabModule);

    // hide last active modules (remove .active css class)
    $(_this.containerElement).find('.active').removeClass('active');
    // remove all imported module containers
    $(_this.containerElement).find('.module_container').remove();

    // save clicked label tab-index
    _this.activeTabIndex = $(label).attr('moduleindex');
    // generate new module
    _this.createAppendTabChildrenModule();

    _this.showCurrentModuleAndLabel();
};

TabsModule.prototype.createAppendTabChildrenModule = function() {
    var _this = this;

    // get module by index
    _this.moduleParentElement = $(_this.tabChildren[_this.activeTabIndex])[0];
    // initialize new module
    modules.moduleFactory(_this.moduleParentElement, function(module) {
        _this.currentTabModule = module;
    });
};

TabsModule.prototype.showCurrentModuleAndLabel = function() {
    var _this = this;

    // show current module by adding 'active' css class
    $(_this.moduleParentElement).addClass('active');
    // change corresponding label state to active
    $(_this.containerElement).find('.tab_label[moduleindex="' + _this.activeTabIndex + '"]').addClass('active');
};

TabsModule.prototype.remove = function() {
    var _this = this;

    // remove currentTabModule refferences
    _this.currentTabModule.remove();
};
