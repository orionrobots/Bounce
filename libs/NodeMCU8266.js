var Board = require("board.js").Board;
var util = require("util.js");
var SerialPort = require("serialport");

function NodeMCU8266() {
    Board.call(this);
    this.serial_port = null;
}

util.inherits(NodeMCU8266, Board);

// This specifically expects a nod
NodeMCU8266.prototype.connect = function(comm_name, baud_rate) {
    var dfd = new $.Deferred();    
    this.serial_port = SerialPort.SerialPort(
        comm_name, {baudRate: baud_rate}
    )
    this.serial_port.on("open", function() {
        this._validate_intenal(dfd);
    });
    this.serial_port.on("error", function() {
        
    });
    this.serial_port = serial_port;
    return dfd.promise();
};

NodeMCU8266.prototype.send_data = function(data) {
    this.serial_port.sen
};