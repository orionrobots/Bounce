/**
 * Setup and handle configuration options
 * @param element
 * @constructor
 */
var BounceConfig = function (element) {
    this.element = element;
    this.baudControl = document.getElementById("baud_rate");
};

BounceConfig.prototype.getBaudRate = function() {
    return parseInt(this.baudControl.value);
};
