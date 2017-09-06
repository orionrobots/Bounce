/**
 * Setup and handle configuration options
 * @constructor
 */
const {app} = require('electron').remote;
const fs = require('fs');

var BounceConfig = function () {
    var _cfg = this;
    this.baudControl = $("#baud_rate");
    this.timeoutControl = $('#serial_timeout');

    this.file = app.getPath('userData') + "/prefs.js";

    this.defaults = {
        baud_rate: '9600',
        serial_timeout: '2'
    }

    this.settings = this.getSettings();
    _cfg.setupBaudControl();
    _cfg.setupTimeout();
};

BounceConfig.prototype.getSettings = function() {
    // Load the settings from the file
    if(fs.existsSync(this.file)) {
        raw = fs.readFileSync(this.file);
        data = JSON.parse(raw);
    }
    else {
        data = this.defaults;
    }
    settings = {
        baud_rate: data.baud_rate,
        serial_timeout: data.serial_timeout
    }
    return settings;
};

BounceConfig.prototype.saveSettings = function() {
    data = JSON.stringify(this.settings);
    fs.writeFileSync(this.file, data);
};

BounceConfig.prototype.setupBaudControl = function() {
    var _cfg = this;
    var _initialValue = this.defaults.baud_rate;
    if('baud_rate' in this.settings) {
        _initialValue = this.settings.baud_rate;
    }
    this.baudControl.val(_initialValue);

    this.baudControl.change(function() {
        _cfg.baudChanged();
    });
};

BounceConfig.prototype.setupTimeout = function() {
    var _cfg = this;
    var _initialValue = this.defaults.serial_timeout;
    if('serial_timeout' in this.settings) {
        _initialValue = this.settings.serial_timeout;
    }
    this.timeoutControl.val(_initialValue);
    this.timeoutControl.change(function() { _cfg.timeoutChanged(); });
};

BounceConfig.prototype.baudChanged = function() {
    this.settings.baud_rate = this.getBaudRate();
    this.saveSettings();
};

BounceConfig.prototype.getBaudRate = function() {
    return parseInt(this.baudControl.val());
};

BounceConfig.prototype.getSerialTimeout = function() {
    return parseInt(this.timeoutControl.val());
};

BounceConfig.prototype.timeoutChanged = function() {
    this.settings.serial_timeout = this.getSerialTimeout();
};

module.exports = BounceConfig;