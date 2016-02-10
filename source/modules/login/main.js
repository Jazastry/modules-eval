function LoginModule(containerElement) {
    this.loginUrl = location.origin + '/proxy/login';
    this.containerElement = containerElement;
    this.loadModule();
}

LoginModule.prototype.loadModule = function() {
    var _this = this;

    _this.loadEvents();
};

LoginModule.prototype.remove = function() {
    var _this = this;

    $(_this.containerElement).children().remove();
};

LoginModule.prototype.loadEvents = function() {
    var _this = this;
    _this.form = $(_this.containerElement).find('.login_form');

    $(_this.containerElement).find('.login_form > button').on('click', function(e) {
        _this.login(function(isLogged) {
            if (isLogged) {
                _this.toggleForm();
                location.reload();
            }
        });
    });
};

LoginModule.prototype.toggleForm = function() {
    var _this = this;
    $(_this.form).toggle('fade', {}, 300).find('input').val('');
};

LoginModule.prototype.login = function(callback) {
    var _this = this;
    var requestData = {};

    var form = $(_this.containerElement).find('.login_form');
    var input = $(form).find('input');
    var inputVal = $(input).val();
    var inputName = $(input).attr('name');

    requestData[inputName] = inputVal;

    $.ajax({
        url: _this.loginUrl,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(requestData),
        success: function() {
            userIsLogged(function(isLogged) {
                callback(isLogged);
            });
        },
        error: function(a, b, c, d) {
            var responseText = JSON.parse(a.responseText);
            alert(responseText.error_text);
            callback(false);
        }
    });
};
