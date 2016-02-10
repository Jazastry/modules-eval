function VolumesModule(containerElement) {
    this.containerElement = containerElement;
    this.loadModule();
}

VolumesModule.prototype.loadModule = function() {
    var _this = this;

    _this.subscribeForVolumes();
};

VolumesModule.prototype.subscribeForVolumes = function() {
    var _this = this;
    var serviceSubscriptFunction = function(changeType, volumeId) {
        if (changeType === 'volume.add') {
            _this.displayVolumeData(service.getVolume(volumeId));
        } else if (changeType === 'volume.update') {
            _this.updateVolumeData(service.getVolume(volumeId));
        }
    };

    service.subscribeVolumes(serviceSubscriptFunction);

    _this.loadBtnEvents(serviceSubscriptFunction);
};

VolumesModule.prototype.displayVolumeData = function(volumeData) {
    var _this = this;
    $(_this.containerElement).find('.table tbody tr[volume-id="' + volumeData.id + '"]').remove();
    var index = $(_this.containerElement).find('tr').length + 1;
    tr = $('<tr>').attr('volume-id', volumeData.id);
    var tdIndex = $('<td class="volume_data_index">').html(index);
    var tdLabel = $('<td class="volume_data_label">').html('<span data-toggle="tooltip" title="click to toggle - name change panel" class="col-xl-12">'+volumeData.label+'</span>');

    var changeLabelBox = $('<div class="change_label_box"><p><strong><i>current name : </i></strong> '+volumeData.label+'</p><input name="volume.label" type="text" placeholder="New volume label"><br><button class="btn btn-default">Submit</button></div>');
    $(tdLabel).append(changeLabelBox);

    var tdId = $('<td class="volume_data_id">').html(volumeData.id);
    var tdSize = $('<td class="volume_data_size">').html(volumeData.size);
    var tdShared = $('<td class="td_shared">').html($('<select class="volume_data_shared"><option value="true">shared</option><option value="false">private</option></select>'));
    $(tdShared).find('option[value="' + volumeData.shared + '"]').attr('selected', 'selected');
    $(tr).append(tdIndex);
    $(tdLabel).insertAfter(tdIndex);
    $(tdId).insertAfter(tdLabel);
    $(tdSize).insertAfter(tdId);
    $(tdShared).insertAfter(tdSize);
    $(_this.containerElement).find('.table tbody').append(tr);


    _this.loadTableRowEvents(tr);
};

VolumesModule.prototype.updateVolumeData = function(volumeData) {
    var _this = this;
    var tr = $(_this.containerElement).find('.table tbody tr[volume-id="' + volumeData.id + '"]');

    $(tr).find('.volume_data_label').html(volumeData.label);
    $(tr).find('.volume_data_id').html(volumeData.id);
    $(tr).find('.volume_data_size').html(volumeData.size);
    $(tr).find('select option[shared="shared"]').removeAttr('shared');
    $(tr).find('option[value="' + volumeData.shared + '"]').attr('selected', 'selected');
};

VolumesModule.prototype.loadTableRowEvents = function(tableRow) {
    var _this = this;

    $(tableRow).find('.volume_data_shared').change(function(e) {
        var volumeId = $(tableRow).attr('volume-id');
        var shared = JSON.parse($(this).val());

        service.shareVolume(volumeId, true, shared);
    });
};

VolumesModule.prototype.loadBtnEvents = function(subscriptionFunction) {
    var _this = this;

    $(_this.containerElement).find('.unsubscribe_btn').on('click', function(e) {
        if ($(this).html() === 'Unsubscribe') {
            _this.unsubscribeVolumes(subscriptionFunction);
            $(this).html('Subscribe');
        } else {
            _this.subscribeVolumes(subscriptionFunction);
            $(this).html('Unsubscribe');
        }

    });

    // show change volume label panel
    $(_this.containerElement).find('.volume_data_label > span').on('click', function(e){
        var changeLabelBox = $(this).parent().find('.change_label_box');
        changeLabelBox.toggle();        
    });

    // submit new name 
    $(_this.containerElement).find('.change_label_box button').on('click', function(e){
        $(this).parent().toggle();
    });
};

VolumesModule.prototype.unsubscribeVolumes = function() {
    var _this = this;

    service.unsubscribeVolumes(_this.serviceSubscriptFunction);
};

VolumesModule.prototype.remove = function() {
    var _this = this;

    _this.unsubscribeVolumes();
    $(_this.containerElement).children().remove();
};
