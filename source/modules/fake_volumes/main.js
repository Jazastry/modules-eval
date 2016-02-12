function FakeVolumesModule(containerElement) {
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
        "label": "szg-ntfs-20g",
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
        "label": "HHH-ntfs-20g",
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
        "guid": "D89721E1100000000000000000000000",
        "label": "TTT-ntfs-20g",
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

FakeVolumesModule.prototype.loadModule = function() {
    var _this = this;

    _this.loadVolumes();
};

FakeVolumesModule.prototype.loadInteractiveStyles = function() {
    var _this = this;

    // add header height to relative vlumes container - top
    $(_this.containerElement).find('.module_fake_volumes').css('top', $('header').css('height'));
};

FakeVolumesModule.prototype.loadVolumes = function() {
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

    $.get('/modules/fake_volumes/templates/volume_template.html', null,
        function(data) {
            loadVolumesDataToTemplate(data);
            _this.loadInteractiveStyles();
            _this.loadClickEvents();
        });
};

FakeVolumesModule.prototype.loadClickEvents = function() {
    var _this = this;

    $(_this.containerElement).find('.volume').on('click', function(e) {
        toggleOptions(this);
    });

    function closeOptionsOpenVolumes() {
        $(_this.containerElement).find('.volume').removeClass('shrink');
        $(_this.containerElement).find('.volume_options_container').removeClass('strech');
        $(_this.containerElement).find('.point_body').hide();
    }

    function openOptionsCloseVolumes(volumeElement, volumeOptionsContainer) {
        loadOptionsData(volumeElement);

        var bodyScrollVal = $('body').scrollTop();
        var headerHeight = $('.module_header').outerHeight(true);
        var height = $(volumeElement).height();
        var bodyPadding = parseInt($('.module_fake_volumes').css('padding').replace('px', ''));

        $(_this.containerElement).find('.volume').height(height).addClass('shrink');
        $(volumeOptionsContainer).css('top', bodyScrollVal - bodyPadding - 3).css('min-height', $windowHeight - headerHeight);
        $(volumeOptionsContainer).addClass('strech');
        $(volumeElement).find('.point_body').show();
    }

    function changeVolumeFocus(volumeElement, volumeOptionsContainer) {
    	var bodyScrollVal = $('body').scrollTop();
    	 var bodyPadding = parseInt($('.module_fake_volumes').css('padding').replace('px', ''));
    	var currentPos = $(volumeOptionsContainer).position();
    	$(volumeOptionsContainer).css('top', bodyScrollVal - bodyPadding - 3);
        $(_this.containerElement).find('.point_body').hide();
        $(volumeElement).find('.point_body').show();
        loadOptionsData(volumeElement);
    }

    function loadOptionsData(volumeElement) {
        var guid = $(volumeElement).attr('volume_guid');
        var volumeData = _this.volumes.filter(function(volume) {
            if (volume.guid === guid) {
                return true;
            }
        });

        volumeData = volumeData[0];
        var dataFields = $(_this.containerElement).find('.volume_options_container *[volume_data]');

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
            	console.log('volumeData[volumeDataKey], volumeDataKey ' , volumeData[volumeDataKey], volumeDataKey);
            }
        }
    }

    function toggleOptions(volumeElement) {
        var volumeOptionsContainer = $(_this.containerElement).find('.volume_options_container');

        if ($(volumeElement).hasClass('shrink')) {
            changeVolumeFocus(volumeElement, volumeOptionsContainer);
        } else {
            openOptionsCloseVolumes(volumeElement, volumeOptionsContainer);
            $(volumeOptionsContainer).find('.close_btn').on('click', function(e) {
                closeOptionsOpenVolumes();
            });
        }
    }
};

FakeVolumesModule.prototype.remove = function() {
    var _this = this;

    $(_this.containerElement).children().remove();
};
