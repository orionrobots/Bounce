/**
 * Setup and handle configuration options
 * @constructor
 */
var BounceConfig = function () {
    var _cfg = this;
    this.baudControl = $("#baud_rate");
    this.timeoutControl = $('#serial_timeout');
    chrome.storage.sync.get(['baud_rate', 'serial_timeout'], function(data) {
        _cfg.configData = data;
        _cfg.setupBaudControl();
        _cfg.setupTimeout();
    });
};

BounceConfig.prototype.setupBaudControl = function() {
    var _cfg = this;
    var _initialValue = '9600';
    if('baud_rate' in this.configData) {
        _initialValue = this.configData['baud_rate'];
    }
    this.baudControl.val(_initialValue);

    this.baudControl.change(function() {
        _cfg.baudChanged();
    });
};

BounceConfig.prototype.setupTimeout = function() {
    var _cfg = this;
    var _initialValue = '2';
    if('serial_timeout' in this.configData) {
        _initialValue = this.configData['serial_timeout'];
    }
    this.timeoutControl.val(_initialValue);
    this.timeoutControl.change(function() { _cfg.timeoutChanged(); });
};

BounceConfig.prototype.baudChanged = function() {
    chrome.storage.sync.set({'baud_rate': this.getBaudRate()});
};

BounceConfig.prototype.getBaudRate = function() {
    return parseInt(this.baudControl.val());
};

BounceConfig.prototype.getSerialTimeout = function() {
    return parseInt(this.timeoutControl.val());
};

BounceConfig.prototype.timeoutChanged = function() {
    chrome.storage.sync.set({'serial_timeout': this.getSerialTimeout()});
};

