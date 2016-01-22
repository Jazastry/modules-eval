var modules = modules || {};

modules = (function() {
    function Modules() {}

    // factory for creating modules
    Modules.prototype.moduleFactory = function(moduleParentElement, callback) {
    	var _this = this;

        var module = {};
        var moduleName = $(moduleParentElement).attr('module');
        var modulePath = './modules/' + moduleName + '/';
        var evalFunc = _this.moduleNameToFuncName(moduleName);

        $(moduleParentElement).load(modulePath + 'index.html', function() {
            var moduleName = '';
            module = {};

            if (evalFunc) {
                moduleName = eval(evalFunc);
                module = new moduleName(moduleParentElement);
            }

            if (callback) {
                return callback(module);
            }
        });
    };

    // object and properties removal
    Modules.prototype.removeObject = function(obj) {
        for (var member in obj) {
            // preserve channel value from deletion
            if (member !== 'channel') {
                delete obj[member];
            }
        }

        obj = null;
    };

    // load nad render one level modules
    Modules.prototype.renderOneLevelModules = function(moduleParentElement) {
    	var _this = this;

        var oneLevelModules = $(moduleParentElement).children('div[module]').not('div[module]>div[module]');

        for (var i = 0; i < oneLevelModules.length; i++) {
            _this.moduleFactory(oneLevelModules[i]);
        }
    };

    Modules.prototype.moduleNameToFuncName = function(moduleFolderName) {
    	var stringArr = moduleFolderName.split('_');
    	for (var i = 0; i < stringArr.length; i++) {
    		stringArr[i] = stringArr[i].charAt(0).toUpperCase() + stringArr[i].slice(1);
    	}

    	return stringArr.join('') + 'Module';    	
    };

    return new Modules();
}());
