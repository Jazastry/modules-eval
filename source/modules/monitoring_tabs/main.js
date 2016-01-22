function MonitoringTabsModule(containerElement) {
    this.containerElement = containerElement;
    this.prepare();
}

MonitoringTabsModule.prototype.prepare = function() {
    var _this = this;

    // prepend interactive module channels html to select_chanel_dialog radio buttons
    $.each($('div[module="interactive"]').find('.interactive_channel'), function(i, channel) {
        var channelName = $(channel).attr('id');
        $(_this.containerElement).find('.select_chanel_dialog>h4')
            .after('<label><input type="radio" name="channel" value="' + channelName + '"><i>' + channelName + '</i></label><br>');
    });

    _this.loadEvents();
};

MonitoringTabsModule.prototype.remove = function() {
    var _this = this;

    // call current module remove function
    if (_this.currentTabModule) {
        _this.currentTabModule.remove();
    }

    // unbind all attached events and remove all HTML elements
    $(_this.containerElement).children().unbind();
    $(_this.containerElement).children().remove();
    $(_this.containerElement).children().find("*").addBack().unbind();
    $(_this.containerElement).children().find("*").addBack().remove();

    // remove all function instances
    modules.removeObject(_this);
};

MonitoringTabsModule.prototype.loadEvents = function() {
    var _this = this;

    $(_this.containerElement).find('.select_chanel_dialog>button.channel_submit').on('click', function(e) {
        var channelName = $(_this.containerElement).find(".select_chanel_dialog input:radio[name=channel]:checked").val();
        _this.addMonitoringModule(channelName);
        $(_this.containerElement).find('.select_chanel_dialog').hide();
    });

    $(_this.containerElement).find('.select_chanel_dialog>button.hide_select_chanel_dialog').on('click', function(e) {
        $(_this.containerElement).find('.select_chanel_dialog').hide();
    });

    $('#monitoring_tabs_add_module_button').on('click', function(e) {
        $(_this.containerElement).find('.select_chanel_dialog').show();
    });
};

MonitoringTabsModule.prototype.addMonitoringModule = function(channelName) {
    var _this = this;

    var monitoringOuterContainer = $(_this.containerElement).find('.monitoring_container').first().clone();
    $(monitoringOuterContainer).removeClass('template');
    var monitoringInnerContainer = $(monitoringOuterContainer).find('div[module="monitoring"]');

    modules.moduleFactory(monitoringInnerContainer, function(module) {
        _this.loadMonitoringTabEvants(monitoringOuterContainer, module);
        module.connect(channelName);
        module.loadEvents();
        module.loadChannelInfo();
    });

    $(_this.containerElement).find('.monitoring_container').last().after(monitoringOuterContainer);

    $( "#monitoring_grid" ).sortable({
        tolerance: "pointer",
        revert: true,
    });
    $( "#monitoring_grid" ).disableSelection();
};

MonitoringTabsModule.prototype.loadMonitoringTabEvants = function(monitoringContainer, module) {
    var _this = this;

    $(monitoringContainer).find('.monitoring_tabs_remove_module_button').on('click', function(e) {
        module.remove();
        $(module.containerElement).remove();
        $(monitoringContainer).remove();
    });
};
