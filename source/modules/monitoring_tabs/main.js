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

MonitoringTabsModule.prototype.loadGridElementLabelBarEvents = function(moduleContainer) {
    var _this = this;
    var gridModuleContainer = $(moduleContainer).find('div[module]');
    // 

    // $(moduleContainer).find('.grid_element_header button.grid_module_collapse_btn').on('click', function() {
    //     var btn = $(this);
    //     btn.children('div').toggleClass("glyphicon-minus glyphicon-plus");
    //     btn.closest(".grid_element").find(".grid_element_content").toggle();
    // });

    $(moduleContainer).find('.grid_element_header button.grid_module_collapse_btn').on('click', function(){
        if ($(gridModuleContainer).hasClass('min')) {
            $( gridModuleContainer ).show( 'blind', {}, 500);
            $(gridModuleContainer).removeClass('min');
            $(this).children('div').removeClass('glyphicon-plus').addClass('glyphicon-minus');
        } else {
            $( gridModuleContainer ).hide( 'blind', {}, 500);
            $(gridModuleContainer).addClass('min');
            $(this).children('div').removeClass('glyphicon-minus').addClass('glyphicon-plus');
        }
    });
};

MonitoringTabsModule.prototype.addMonitoringModule = function(channelName) {
    var _this = this;

    var monitoringOuterContainer = $(_this.containerElement).find('.grid_element').first().clone();
    $(monitoringOuterContainer).removeClass('template');
    var monitoringInnerContainer = $(monitoringOuterContainer).find('div[module="monitoring"]');

    modules.moduleFactory(monitoringInnerContainer, function(module) {
        _this.loadMonitoringTabEvants(monitoringOuterContainer, module);
        module.connect(channelName);
        module.loadEvents();
        module.loadChannelInfo();
    });

    var firstCol = $(_this.containerElement).find('.sortable_grid_column')[0];
    var forstColLen = $(firstCol).find('.grid_element').not('.grid_element.template').length; 
    console.log('forstColLen ' , forstColLen);
    var secondCol =$(_this.containerElement).find('.sortable_grid_column')[1];
    var secondColLen = $(secondCol).find('.grid_element').not('.grid_element.template').length;
    console.log('secondColLen ' , secondColLen);

    if (forstColLen > secondColLen) {
        $(secondCol).append(monitoringOuterContainer);
    } else {
        $(firstCol).append(monitoringOuterContainer);
    }

    // $(_this.containerElement).find('.grid_element').last().after(monitoringOuterContainer);

    // configure jqueryUi grid elements behavior
    $(".sortable_grid_column").sortable({
        // tolerance: "pointer",
        revert: true,
        // containment: ".grid_container",
        connectWith: ".sortable_grid_column",
        handle: ".grid_element_header",
        cancel: ".grid_module_collapse_btn",
        placeholder: "grid_element_placeholder ui-corner-all",
        activate: function(e, ui){
            var elHeight = $(ui.item).css('height');
            var marg = $(ui.item).css('margin-top');
            var width = $(ui.item).css('width');
            $('.grid_element_placeholder')
                .css('height', elHeight)
                .css('margin-top', marg)
                .css('width', width);
        },
    });

    _this.loadGridElementLabelBarEvents(monitoringOuterContainer);
};

MonitoringTabsModule.prototype.loadMonitoringTabEvants = function(monitoringContainer, module) {
    var _this = this;

    $(monitoringContainer).find('.monitoring_tabs_remove_module_button').on('click', function(e) {
        module.remove();
        $(module.containerElement).remove();
        $(monitoringContainer).remove();
    });
};
