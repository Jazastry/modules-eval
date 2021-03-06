function FakeVolumesTightOptionsModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
    this.volumes = [{
        "clients": ["0ac80065", "0ac80066"],
        "device-symbolic-link": "THE FIRST \\\\?\\Volume{d89721e8-0000-0000-0000-000000000000}",
        "dir-count": 313,
        "disk-number": 1,
        "dynamic": false,
        "files-count": 14693,
        "frag-data-size": 103598244,
        "frag-file-count": 65,
        "free-space": 10650140672,
        "fs-type": "NTFS",
        "guid": "D89721E8000000000000000000000000",
        "label": "mbr-ntfs-10g",
        "marked": true,
        "shared": true,
        "partition-type": "IFS",
        "preferred-mount-point": "M:",
        "sector-size": 512,
        "serial-number": 3633783272,
        "size": 10734272000,
        "auto-defrag": false,
        "hidden": false,
        "masters": ["10.200.0.119"]
    }, {
        "clients": ["0ac80065", "0ac80066"],
        "device-symbolic-link": "THE SECOND \\\\?\\Volume{d89721e8-0000-0000-0000-000000000000}",
        "dir-count": 313,
        "disk-number": 1,
        "dynamic": false,
        "files-count": 143,
        "frag-data-size": 244,
        "frag-file-count": 6,
        "free-space": 100987672,
        "fs-type": "NTFS",
        "guid": "D89721E9000000000000000000000000",
        "label": "szg-ntfs-BIG",
        "marked": true,
        "shared": true,
        "partition-type": "IFS",
        "preferred-mount-point": "",
        "sector-size": 512,
        "serial-number": 3633783272,
        "size": 44552672000,
        "auto-defrag": false,
        "hidden": false,
        "masters": ["10.200.0.119"]
    }, {
        "clients": ["0ac80065", "0ac80066"],
        "device-symbolic-link": "THE SECOND \\\\?\\Volume{d89721e8-0000-0000-0000-000000000000}",
        "dir-count": 313,
        "disk-number": 1,
        "dynamic": false,
        "files-count": 143,
        "frag-data-size": 244,
        "frag-file-count": 6,
        "free-space": 100987672,
        "fs-type": "NTFS",
        "guid": "D89721E1000000000000000000000000",
        "label": "HHH-ntfs-BIG",
        "marked": true,
        "shared": true,
        "partition-type": "IFS",
        "preferred-mount-point": "",
        "sector-size": 512,
        "serial-number": 3633783272,
        "size": 44552672000,
        "auto-defrag": false,
        "hidden": false,
        "masters": ["10.200.0.119"]
    }];
}

FakeVolumesTightOptionsModule.prototype.loadModule = function() {
    var _this = this;

    _this.loadVolumes();
};

FakeVolumesTightOptionsModule.prototype.loadInteractiveStyles = function() {
    var _this = this;

    // add header height to relative vlumes container - top
    $(_this.containerElement).find('.module_fake_volumes').css('top', $('header').css('height'));
};

FakeVolumesTightOptionsModule.prototype.loadVolumes = function() {
    var _this = this;

    function loadVolumesDataToTemplate(template) {
        for (var i = 0; i < _this.volumes.length; i++) {
            var filledTemplateClone = loadVolumeData($(template).clone(), _this.volumes[i]);
            $(_this.containerElement).find('.volumes_container').append(filledTemplateClone);
        }
    }

    function loadVolumeData(template, volume) {
        for (var key in volume) {
            var volumeDataPlace = $(template).find('*[volume_data="' + key + '"]');
            var dataConvert = volumeDataPlace.attr('data_convert');
            var data = volume[key];

            // convert bytes to GB if necesary
            data = dataConvert !== 'GB' ? data : Math.round(parseInt(data) / 1000000000) + 'GB';
            var dataField = $(template).find('*[volume_data="' + key + '"]');

            /* TODO: move to function repeating with loadOptionsData*/
            if (data !== '' && data !== undefined) {
                if ($(dataField).is('input')) {
                    $(dataField).val(data).width('500px');
                } else {
                    $(dataField).html(data);
                }
            }
        }

        // set the volume guid for later HTML element-data binding
        $(template).attr('volume_guid', volume.guid);

        return template;
    }

    $.get('/modules/fake_volumes_tight_options/templates/volume_template.html', null,
        function(data) {
            loadVolumesDataToTemplate(data);
            _this.loadInteractiveStyles();
            _this.loadClickEvents();
        });
};

FakeVolumesTightOptionsModule.prototype.loadClickEvents = function() {
    var _this = this;
    var volumeOptionsContainer = $(_this.containerElement).find('.volume_options_container');
    var animationSettings = {
        optionsContainerWidth: '400px',
        optionsContainerAddition: 15,
        animationDuration: 900,
        easing: 'easeOutQuint',
        pointer: $(_this.containerElement).find('.volumes_container .pointer')
    };

    $(_this.containerElement).find('.volume').on('click', function(e) {
        toggleOptions(this);
    });

    $(_this.containerElement).find('.close_btn').on('click', function() {
        closeOptions(animationSettings);
    });

    function toggleOptions(volumeElement) {
        loadOptionsData(volumeElement);

        var pointerTop = $(volumeElement).position().top - ($(volumeElement).height() + ($(volumeElement).height() / 4));

        if ($(volumeOptionsContainer).attr('opened') === 'true') {
            changePointerVolumeFocus(animationSettings, pointerTop);
        } else {
            openOptions(animationSettings, pointerTop);
        }
    }

    function adjustOptionsTopPosition() {
        var bodyScrollVal = $('body').scrollTop();
        var bodyPadding = parseInt($('.module_fake_volumes').css('padding').replace('px', ''));
        var currentPos = $(volumeOptionsContainer).position();
        $(volumeOptionsContainer).css('top', bodyScrollVal);
    }

    function loadOptionsData(volumeElement) {
        var guid = $(volumeElement).attr('volume_guid');
        var volumeData = _this.getVolumeByGuid(guid);

        var dataFields = $(volumeOptionsContainer).find('*[volume_data]');

        for (var i = 0; i < dataFields.length; i++) {
            var volumeDataKey = $(dataFields[i]).attr('volume_data');

            /* TODO: move to function repeating with loadVolumeData*/
            if (volumeData[volumeDataKey] !== '' && volumeData[volumeDataKey] !== undefined) {
                if ($(dataFields[i]).is('input')) {
                    $(dataFields[i]).val(volumeData[volumeDataKey]).width('500px');
                } else {
                    $(dataFields[i]).html(volumeData[volumeDataKey]);
                }
            } else {

            }
        }
    }

    function openOptions(animationSettings, pointerTop) {
        $(animationSettings.pointer).find('.point_body').css('top', pointerTop);
        $(volumeOptionsContainer).find('fieldset').outerWidth(animationSettings.optionsContainerWidth);

        $(volumeOptionsContainer).animate({
            width: (parseInt(animationSettings.optionsContainerWidth) + animationSettings.optionsContainerAddition) + 'px'
        }, {
            duration: animationSettings.animationDuration,
            easing: 'easeOutQuint',
            queue: false,
            start: function() {
                $(volumeOptionsContainer).show();
                $(animationSettings.pointer).show();

                $(animationSettings.pointer).animate({
                    right: '+=' + animationSettings.optionsContainerWidth
                }, {
                    duration: animationSettings.animationDuration,
                    easing: animationSettings.easing,
                });

                $(_this.containerElement).find('.volume').animate({
                    width: '-=' + animationSettings.optionsContainerWidth
                }, {
                    duration: animationSettings.animationDuration,
                    easing: animationSettings.easing,
                });


                $(volumeOptionsContainer).find('fieldset').animate({
                    opacity: '1'
                }, {
                    duration: animationSettings.animationDuration,
                    easing: animationSettings.easing
                });
            }
        });
        $(volumeOptionsContainer).attr('opened', true);
    }

    function closeOptions(animationSettingsanimationSettings) {
        $(volumeOptionsContainer).animate({
            width: '-=' + animationSettings.optionsContainerWidth
        }, {
            duration: animationSettings.animationDuration,
            easing: animationSettings.easing,
            start: function() {
                $(animationSettings.pointer).animate({
                    right: '-=' + animationSettings.optionsContainerWidth
                }, {
                    duration: animationSettings.animationDuration,
                    easing: animationSettings.easing,
                });

                $(_this.containerElement).find('.volume').animate({
                    width: '+=' + animationSettings.optionsContainerWidth
                }, {
                    duration: animationSettings.animationDuration,
                    easing: animationSettings.easing
                });

                $(volumeOptionsContainer).find('fieldset').animate({
                    opacity: '0'
                }, {
                    duration: animationSettings.animationDuration,
                    easing: animationSettings.easing
                });
            },
            complete: function() {
                $(volumeOptionsContainer).attr('opened', false);
                $(volumeOptionsContainer).find('fieldset').css('width', '0px');
                $(volumeOptionsContainer).hide();
            }
        });
    }

    function changePointerVolumeFocus(animationSettings, pointerTop) {
        $(_this.containerElement).find('.point_body').animate({
            top: pointerTop
        }, {
            duration: 900,
            easing: animationSettings.easing,
            queue: false
        });
    }
};

FakeVolumesTightOptionsModule.prototype.getVolumeByGuid = function(guid) {
    var _this = this;

    var volumeData = _this.volumes.filter(function(volume) {
        if (volume.guid === guid) {
            return true;
        }
    });

    return volumeData[0];
};

FakeVolumesTightOptionsModule.prototype.remove = function() {
    var _this = this;

    $(_this.containerElement).children().remove();
};
