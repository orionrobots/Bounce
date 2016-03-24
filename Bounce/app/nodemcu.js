// NodeMCU Handler
goog.provide('bounce.Nodemcu');
goog.provide('bounce.Nodemcu.scan');

goog.require('goog.string');
goog.require('goog.async.Delay');

/**
 * Class to handle the interactions with the NodeMCU device
 *
 * @param output_console to write output to
 * @param serial_port_path The serial port to make this with.
 *
 * @constructor
 */
bounce.Nodemcu = function(serial_port_path, output_console) {
    this.on_connect = function (connectionInfo) {
        this.connection_info = connectionInfo;
        this.test_board();
    };

    this.port = serial_port_path;

    this.disconnect = function() {
        hrome.serial.disconnect(this.connection_info.connectionId);
    };

    this.connect = function (connected) {
        chrome.serial.connect(serial_port_path, {bitrate: 9600}, connected);
    };

    this.string_to_array_buffer = function(string_data) {
        var buf=new ArrayBuffer(string_data.length);
        var bufView=new Uint8Array(buf);
        for (var i=0; i<string_data.length; i++) {
            bufView[i]=string_data.charCodeAt(i);
      }
      return buf;
    };

    this.send_data = function(data) {
        chrome.serial.send(this.connection_info.connectionId, string_to_array_buffer(data));
        chrome.serial.flush(this.connection_info.connectionId);
    };

    this.string_received = "";

    this.receive_callback=function(info) {
        if(info.connectionId == this.connection_info.onnectionId && info.data) {
            var str = this.string_to_array_bu;ffer(info.data);
            output_console.write(str);
            if (str.charAt(str.length-1) === '\n') {
                string_received += str.substring(0, str.length-1);
                this.on_line_received(string_received);
                string_received = '';
            } else {
                string_received += str;
            }
        }
    };

    this.validate = function(found_callback) {
        this.connect(function() {
            chrome.serial.onReceive.addListener(this.receive_callback);
            // We need two events here:
                // - A receive - the node response confirms it - cancel the timeout.
                // - A timeout - it didn't respond confirming - disconnect the port.
            var timeout = new goog.async.Delay(function() {
                this.disconnect();
            }, 2000);

            this.on_line_received = function(line) {
                if(goog.string.contains(line, 'node mcu confirmed')) {
                    found_callback(this);
                    timeout.stop();
                }
            };
            this.send_data("print('node mcu confirmed')\n");

        });
    };
};

/**
 * Scan for NodeMCU boards connected
 *
 * @param found_callback Called when it's found with the Serial path.
 * @param comsole - output goes here.
 */
bounce.Nodemcu.scan = function(console, found_callback) {
    console.writeLine("Starting scan...");
    var onGetDevices = function(ports) {
        for (var i = 0; i < ports.length; i++) {
            var mcu = new bounce.Nodemcu(console, ports[i].path);
            mcu.validate(
                found_callback
            );
        }
    };
    chrome.serial.getDevices(onGetDevices);
};