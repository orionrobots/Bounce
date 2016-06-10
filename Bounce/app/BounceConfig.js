/**
 * Setup and handle configuration options
 * @constructor
 */
var BounceConfig = function () {
    var _cfg = this;
    this.baudControl = $("#baud_rate");

    this.setupBaudControl();
};

BounceConfig.prototype.setupBaudControl = function() {
    var _cfg = this;
    chrome.storage.sync.get('baud_rate', function(data) {
        var _initialValue = '9600';
        if('baud_rate' in data) {
            _initialValue = data['baud_rate'];
        }
        _cfg.baudControl.val(_initialValue);
    });
    this.baudControl.change(function() {_cfg.baudChanged();});
};

BounceConfig.prototype.baudChanged = function() {
    chrome.storage.sync.set({'baud_rate': this.getBaudRate()});
};

BounceConfig.prototype.getBaudRate = function() {
    return parseInt(this.baudControl[0].value);
};
