// load InfoChannel service
$('body script').first().before('<script src="./js/services/InfoChannel.js"></script>');
$('body script').first().before('<script src="./lib/modules/modules.js"></script>');
$('body script').first().before('<script src="./lib/service/service.js"></script>');

var userIsLogged = function(callback) {
    $.ajax({
        url: location.origin + '/proxy/login',
        type: 'GET',
        success: function(a, b) {
            return callback(true);
        },
        error: function(a, b, c, d) {
            return callback(false);
        }
    });
};

var loadLoginModule = function(){
	var html = '<div module="login"></div>';
	$('body > .container').append(html);
	modules.renderOneLevelModules($('body > .container'));
};

var loadMainModules = function(){
    var header = '<header module="header"></header>';
    var navberLeft = '<div class="col-xl-2">'+
            '<div module="navbar_left"></div>' +
        '</div>';
        
    var tabsModule = '<div class="col-xl-10">' +
                     '    <div module="tabs" class="tabs_container col-xl-12"></div>' +
                     '</div>';

    var volumes = '    <div class="col-xl-6">' +
                  '        <div module="volumes" class="col-xl-12">' +
                  '        </div>' +
                  '    </div>'+
                  '    <div class="col-xl-6">' +
                  '        <div module="volumes" class="col-xl-12">' +
                  '        </div>' +
                  '    </div>';

    var fakeVolumes = '<div module="fake_volumes"></div>';

    var html =  header + fakeVolumes;
	// $('body > .container').find('*').remove();
	// $('body > .container').append(html);
    $('body').find('*').remove();
    $('body').append(html);
	// modules.renderOneLevelModules($('body > .container'));
    modules.renderOneLevelModules($('body'));
};


var service = {};
$(document).ready(function(){
    // register service connection
    service = new ttService("10.200.0.182:9125/v2");

    // select main modules container and pass it to render function
    //modules.renderOneLevelModules($('body>.container'));
    userIsLogged(function(isLogged){
    	if (isLogged) {
    		loadMainModules();
    	} else {
    		loadLoginModule();
    	}
    });

    $('.change_theme').on('click', function(e){
        var body = $('body');
        if ($(body).hasClass('dark')) {
            $('body').removeClass('dark');
        } else {
            $('body').addClass('dark');
        }
    });
});
