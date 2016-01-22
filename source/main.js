// load InfoChannel service
$('body script').first().before('<script src="./js/services/InfoChannel.js"></script>');
$('body script').first().before('<script src="./lib/modules/modules.js"></script>');

$(document).ready(function(){
    // select main modules container and pass it to render function
    modules.renderOneLevelModules($('body>.container'));
});