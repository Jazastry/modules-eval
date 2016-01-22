function TabsChildBModule(containerElement) {
    this.containerElement = containerElement;
    this.currentTabModule = {};
    this.activeTabIndex = 0;
    // contins tab-children parent div without inner HTML
    this.tabChildren = [];

    this.prepare();
}

TabsChildBModule.prototype.prepare = function() {
    var _this = this;

    _this.tabLabelContainer = $(_this.containerElement).children('.tab_labels_container');
    _this.tabLabel = $(_this.tabLabelContainer).children('.tab_label');
    $(_this.tabLabelContainer).children('.tab_label').remove();
    _this.tabChildren = $(_this.containerElement).children('div[module]');

    _this.createAppendTabChildrenModule();
    _this.createPrependTabLabels();
    _this.showCurrentModuleAndLabel();
};

TabsChildBModule.prototype.createPrependTabLabels = function() {
    var _this = this;
    var tabs = _this.tabChildren;

    for (var i = 0; i < tabs.length; i++) {
        var name = $(tabs[i]).attr('module');

        var label = $(_this.tabLabel).clone().html(name).attr('moduleindex', i);
        $(_this.tabLabelContainer).append(label);
    }

    var currentLabel = $(_this.tabLabelContainer).children('.tab_label')[_this.activeTabIndex];
    $(currentLabel).addClass('active');

    // add change tab on click function
    $(_this.tabLabelContainer).find('.tab_label').on('click', function(e) {
        _this.changeTab(this);
    });
};

// called on label click
TabsChildBModule.prototype.changeTab = function(label) {
    var _this = this;

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

TabsChildBModule.prototype.createAppendTabChildrenModule = function() {
    var _this = this;

    // create module 
    _this.moduleParentElement = $(_this.tabChildren[_this.activeTabIndex])[0];
    modules.moduleFactory(_this.moduleParentElement, function(module) {
        _this.currentTabModule = module;

    });
};

TabsChildBModule.prototype.showCurrentModuleAndLabel = function() {
    var _this = this;

    $(_this.moduleParentElement).addClass('active');
    $(_this.containerElement).find('.tab_label[moduleindex="' + _this.activeTabIndex + '"]').addClass('active');
};

TabsChildBModule.prototype.remove = function() {
    var _this = this;

    // remove currentTabModule refferences
    _this.currentTabModule.remove();
    $(_this.currentTabModule.containerElement).children().remove();
    modules.removeObject(_this.currentTabModule);

    // remove parent element all children 
   $(_this.containerElement).children().remove();

    // remove this  
    modules.removeObject(this);
    modules.removeObject(_this);
};