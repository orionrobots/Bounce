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
    this.port = serial_port_path;

    this.disconnect = function() {
        hrome.serial.disconnect(this.connection_info.connectionId);
    };

    this.connect = function (connected) {
        chrome.serial.connect(serial_port_path, {bitrate: 9600}, connected);
    };

    this.array_buffer_to_string = function(buffer_data) {
        var str = '';
        for (var i=0; i<buffer_data.length; i++) {
            str += String.fromCharCode(buffer_data[i]);
        }
        return str;
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
        chrome.serial.send(this.connection_info.connectionId, this.string_to_array_buffer(data), function(){});
        chrome.serial.flush(this.connection_info.connectionId, function() {});
    };

    var string_received = "";

    this.receive_callback=function(info) {
        if(info.connectionId == this.connection_info.connectionId && info.data) {
            var str = this.array_buffer_to_string(info.data);
            output_console.write(str);
            if (str.charAt(str.length-1) === '\n') {
                this.string_received += str.substring(0, str.length-1);
                this.on_line_received(this.string_received);
                this.string_received = '';
            } else {
                this.string_received += str;
            }
        }
    };

    this.validate = function(found_callback) {
        var node_instance = this;
        this.connect(function(connectionInfo) {
            node_instance.connection_info = connectionInfo;
            chrome.serial.onReceive.addListener(node_instance.receive_callback);
            // We need two events here:
                // - A receive - the node response confirms it - cancel the timeout.
                // - A timeout - it didn't respond confirming - disconnect the port.
            var timeout = new goog.async.Delay(function() {
                node_instance.disconnect();
            }, 2000);

            this.on_line_received = function(line) {
                if(goog.string.contains(line, 'node mcu confirmed')) {
                    found_callback(node_instance);
                    timeout.stop();
                }
            };
            node_instance.send_data("print('node mcu confirmed')\n");

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
            console.writeLine('Found serial port ' + ports[i].path + '. Testing...');
            var mcu = new bounce.Nodemcu(ports[i].path, console);
            mcu.validate(found_callback);
        }
    };

    chrome.serial.getDevices(onGetDevices);
};