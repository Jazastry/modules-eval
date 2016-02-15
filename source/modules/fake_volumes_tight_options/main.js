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

    $(_this.containerElement).find('.volume').on('click', function(e) {
        var volumeElement = $(this);
        var volumeOptionsContainer = $(_this.containerElement).find('.volume_options_container');
        loadOptionsData(volumeElement, volumeOptionsContainer);
        adjustPositions(volumeElement, volumeOptionsContainer);

        if ($(volumeOptionsContainer).attr('opened') === 'true') {
            $(_this.containerElement).find('.point_body').hide();
            $(volumeElement).find('.point_body').show();
        } else {            
            $(_this.containerElement).find('.point_body').hide();

            $(volumeOptionsContainer).find('fieldset').width('360px');
            $(volumeOptionsContainer).animate({
                width: '400px'
            }, {
                duration: 1500,
                easing: 'easeOutQuint',
                start: function() {
                    var fieldsetWidth = '';
                    $(_this.containerElement).find('.volume').animate({
                        width: '-=300px'
                    }, {
                        duration: 1500,
                        easing: 'easeOutQuint',
                    });                   
                },
                complete: function() {
                    $(volumeOptionsContainer).attr('opened', true);
                    var pointer = $(_this.containerElement).find('.pointer');
                    var pointerTop = $(volumeElement).position().top - ($(volumeElement).outerHeight() - 5);               
                    var pointerRight = $(volumeOptionsContainer).position().left;
                    $(_this.containerElement).find('.point_body').show().css('top', pointerTop);
                    $(pointer).css('right', 400);               }
            });
        }
    });

    $(_this.containerElement).find('.close_btn').on('click', function(){
        var volumeOptionsContainer = $(_this.containerElement).find('.volume_options_container');
        close(volumeOptionsContainer);
    });

    function adjustPositions(volumeElement, volumeOptionsContainer) {
        var bodyScrollVal = $('body').scrollTop();
        var bodyPadding = parseInt($('.module_fake_volumes').css('padding').replace('px', ''));
        var currentPos = $(volumeOptionsContainer).position();
        $(volumeOptionsContainer).css('top', bodyScrollVal - bodyPadding - 3);
    }

    function loadOptionsData(volumeElement, volumeOptionsContainer) {
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

    function open(volumeElement, volumeOptionsContainer) {
        $(_this.containerElement).find('.point_body').hide();

        $(volumeOptionsContainer).animate({
            width: '50%'
        }, {
            duration: 1500,
            easing: 'easeOutQuint',
            start: function() {
                console.log('START');
                $(_this.containerElement).find('.volume').animate({
                    width: '50%'
                }, {
                    duration: 1500,
                    easing: 'easeOutQuint'
                });
            },
            complete: function() {
                console.log('COMPLETE');
                $(volumeOptionsContainer).attr('opened', true);
                $(volumeElement).find('.point_body').show();
            }
        });
    }

    function close(volumeOptionsContainer) {
        $(_this.containerElement).find('.point_body').hide();

        $(volumeOptionsContainer).animate({
            width: '0%'
        }, {
            duration: 1500,
            easing: 'easeOutQuint',
            start: function() {
                $(_this.containerElement).find('.volume').animate({
                    width: '100%'
                }, {
                    duration: 1500,
                    easing: 'easeOutQuint'
                });
            },
            complete: function() {
                console.log('COMPLETE');
                $(volumeOptionsContainer).attr('opened', false);
            }
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
