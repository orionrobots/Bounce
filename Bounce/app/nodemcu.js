// NodeMCU Handler
// Utility bits


var string_to_array_buffer = function(string_data) {
    var buf=new ArrayBuffer(string_data.length);
    var bufView=new Uint8Array(buf);
    for (var i=0; i<string_data.length; i++) {
        bufView[i]=string_data.charCodeAt(i);
  }
  return buf;
};

/**
 * Class to handle the interactions with the NodeMCU device
 *
 * @param baud_rate Baud rate to establish connection with.
 * @param output_console to write output to
 * @param serial_port_path The serial port to make this with.
 *
 * @constructor
 */
bounce.Nodemcu = function(serial_port_path, baud_rate, output_console) {
    this.port = serial_port_path;
    var _connection_info = null; //If connected - the chrome connection info.
    var _received_str = '';
    var _node_instance = this;
    this._output_console = output_console;

    /**
     * Register a an event for a line of text received.
     * Note - stuff like prompts, do not come as a line!
     *
     * @param listener
     */
    this.addLineEventListener = function(listener) {
        document.addEventListener('line_received', listener, false);
    };

    this._fire_line_received_event = function(line) {
        var event = new CustomEvent('line_received', {'detail': {node: _node_instance, line: line}});
        document.dispatchEvent(event);
    };

    /**
     * Listener for data - assembling into lines.
     * @param info
     * @private
     */
    function _data_received(info) {
        if(info.connectionId == _connection_info.connectionId && info.data) {
            var str = bounce.Nodemcu._decoder.decode(info.data);
            output_console.write(str);
            // Append str to received str
            _received_str += str;
            if(_received_str.indexOf('\n') > 0) {
                var parts = _received_str.split("\n");
                for(var n=0; n<parts.length-1; n++) {
                    _node_instance._fire_line_received_event(parts[n]);
                }
                _received_str = parts[n];
            }
        }
    }

    function _setup_data_listener() {
        chrome.serial.onReceive.addListener(_data_received);
    }

    this.connect = function (connected_callback) {
        function connected_inner(connectionInfo) {
            _connection_info = connectionInfo;
            _setup_data_listener();
            connected_callback(_node_instance);
        }
        output_console.writeLine("Connecting to device on " + serial_port_path);
        try {
            chrome.serial.connect(serial_port_path, {bitrate: baud_rate}, connected_inner);
        } catch(e) {
            throw new bounce.Nodemcu.ConnectionFailed(this, e);
        }
    };

    this.disconnect = function(disconnected_callback) {
        output_console.writeLine("Disconnecting");
        chrome.serial.onReceive.removeListener(_data_received);
        chrome.serial.disconnect(_connection_info.connectionId, function() {disconnected_callback && disconnected_callback()});
    };

    /**
     * Send data as a single chunk to the micro
     *
     * @param data Data to send to the device. Always flushed for now.
     * @param sent_callback Called when data was sent and flushed.
     */
    this.send_data = function(data, sent_callback) {
        // Send, flush when done, then perform the callback after this.
        chrome.serial.send(_connection_info.connectionId,
            //bounce.Nodemcu._encoder.encode(data),
            string_to_array_buffer(data),
            function(){
                chrome.serial.flush(_connection_info.connectionId, function() {
                    sent_callback && sent_callback();
            });
        });
    };

    /**
     * Send data a line at a time to the micro
     *
     * @param data                  Multiline chunk of text to send
     * @param completed_callback    Call this when done
     */
    this.send_multiline_data = function(data, completed_callback) {
        var lines;
        if(data instanceof Array) {
            lines = data;
        } else {
            lines = data.split("\n");
        }
        var current_line = 0;
        var send_next;
        var last_data = '';

        var multiline_listener = function(info) {
            console.log("Received call. Info data is ", JSON.stringify(info));
            var data = bounce.Nodemcu._decoder.decode(info.data);
            console.log('Data was :', JSON.stringify(data));
            if(info.connectionId == _connection_info.connectionId && goog.string.endsWith(last_data + data, "> ")) {
                send_next();
            } else {
                last_data = data;
            }
        };

        // Send each one, with the sent callback priming the next.
        send_next = function() {
            if (current_line < lines.length) {
                _node_instance.send_data(lines[current_line++] + "\n", function() {});
            } else {
                console.log("Last line sent. Removing listener....");
                chrome.serial.onReceive.removeListener(multiline_listener);
                completed_callback();
            }
        };

        chrome.serial.onReceive.addListener(multiline_listener);

        send_next();
    };
};

bounce.Nodemcu._decoder = new TextDecoder('utf8');
bounce.Nodemcu._encoder = new TextEncoder('utf8');

/**
 * Exception to raise when the connection failed
 * @param mcu - the chip we failed to connect to.
 * @param original - the original exception
 * @constructor
 */
bounce.Nodemcu.ConnectionFailed = function(mcu, original) {
    this.mcu = mcu;
    this.original = original;
};


/**
 * USed by scan to validate this is a node.
 *
 * @param found_callback
 */
bounce.Nodemcu.prototype.validate = function(found_callback) {
    var _node_instance = this;

    function _found_wrapper() {
        found_callback(_node_instance);
    }

    function _timed_out() {
        _node_instance._output_console.writeLine("Timed out - not running NodeMCU");
        _node_instance.disconnect();
    }

    // Validate by attempting a connection
    this._output_console.writeLine("Attempting connection");
    this.connect(function() {
        _node_instance._output_console.writeLine("Connected");
        // We need two events here:
        // - A timeout - it didn't respond confirming - disconnect the port.
        var timeout = new goog.async.Delay(_timed_out, 2000);
        timeout.start();
        // - A receive - the node response confirms it - cancel the timeout.
        _node_instance.addLineEventListener(function(e) {
            if(goog.string.contains(e.detail.line, 'node mcu confirmed')) {
                _node_instance._output_console.writeLine("Confirmed - NodeMCU found");
                _node_instance.disconnect(_found_wrapper);
                timeout.stop();
            }
        });
        _node_instance._output_console.writeLine("Sending confirmation test");
        _node_instance.send_data("print('node mcu confirmed')\n");
    });
};

/**
 * Send a block of code - save it under the given filename on the device.
 *
 * @param  data     - Data to send
 * @param filename  - Filename to store on the device as
 * @param completed_callback    - Function call when all sent.
 */
bounce.Nodemcu.prototype.send_as_file= function(data, filename, completed_callback) {
        var input_lines = data.split("\n");
        var output_lines = [];
        output_lines.push('file.open("' + filename + '", "w")');
        goog.array.every(input_lines, function(line) {
            output_lines.push('file.write("' + line + '\\n")');
            return true;
        });
        output_lines.push('file.close()');
        this.send_multiline_data(output_lines, completed_callback);
    };

/**
 * Stop all timers.
 */
bounce.Nodemcu.prototype.stop = function() {
    this.send_multiline_data(["for i=0, 6 do", "tmr.stop(i)", "end"], function() {});
};

/**
 * Scan for NodeMCU boards connected
 *
 * @param baud_rate number - the baud rate to scan with.
 * @param found_callback Called when it's found with the Serial path.
 * @param console - output goes here.
 */
bounce.Nodemcu.scan = function(console, baud_rate, found_callback) {
    console.writeLine("Starting scan at " + baud_rate + "...");
    var onGetDevices = function(ports) {
        for (var i = 0; i < ports.length; i++) {
            console.writeLine('Found serial port ' + ports[i].path + '. Testing...');
            var mcu = new bounce.Nodemcu(ports[i].path, baud_rate, console);
            mcu.validate(found_callback);
        }
    };

    chrome.serial.getDevices(onGetDevices);
};
