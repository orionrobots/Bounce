// NodeMCU Handler
const SerialPort = require("serialport");

/**
 * Class to handle the interactions with the NodeMCU device
 *
 * @param baud_rate Baud rate to establish connection with.
 * @param output_console to write output to
 * @param port A serial port to make this with.
 *
 * @constructor
 */
bounce.Nodemcu = function(port_info, baud_rate, output_console) {
    this.port_info = port_info;
    this._port = null;// If connected - the port connection object
    var _received_str = '';
    var _node_instance = this;
    this._output_console = output_console;
    this._multiline_listener = false; // Chains multiline data sends

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
    function _data_received(data) {
        if(data) {
            output_console.write(data);
            // Append str to received str
            _received_str += data;
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
        _node_instance._port.on('data', (data)=>{
            console.log(data);
            if (_node_instance._multiline_listener) {
                _node_instance._multiline_listener();
            }
            _data_received(data)
        });
    }

    this.connect = function (connected_callback) {
        output_console.writeLine("Connecting to device on " + this.port_info.comName);
        this._port = new SerialPort(this.port_info.comName, {baudRate: baud_rate}, (err)=>{
            if (err) {
                console.log(err.message);
                throw err;
            }
            this._port.on('error', function(err) {
                output_console.writeLine('Error: ', err.message);
                throw err;
            });
            this._port.setEncoding('utf-8');
            _setup_data_listener();
            connected_callback(_node_instance);
        });
    };

    this.disconnect = function(disconnected_callback) {
        output_console.writeLine("Disconnecting");
        this._port.close(()=>{if (disconnected_callback) disconnected_callback()});
    };

    /**
     * Send data as a single chunk to the micro
     *
     * @param data Data to send to the device. Always flushed for now.
     * @param sent_callback Called when data was sent and flushed.
     */
    this.send_data = function(data, sent_callback) {
        // Send, flush when done, then perform the callback after this.
        this._port.write(data);
        this._port.drain(()=>{if (sent_callback) sent_callback();});
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

        this._multiline_listener = function(data) {
            console.log("Received call. Data is ", JSON.stringify(data));
            if(goog.string.endsWith(last_data + data, "> ")) {
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
                this._multiline_listener = null;
                completed_callback();
            }
        };

        send_next();
    };
};

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

bounce.Nodemcu.prototype.get_name = function() {
    return this.port_info.comName;
}

/**
 * USed by scan to validate this is a node.
 *
 * @param found_callback - Function to call when found
 * @param timeout_millis - Time to wait before giving up/disconnecting.
 */
bounce.Nodemcu.prototype.validate = function(found_callback, timeout_millis) {
    var _node_instance = this;

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
        var timeout = new goog.async.Delay(_timed_out, timeout_millis);
        timeout.start();
        // - A receive - the node response confirms it - cancel the timeout.
        _node_instance.addLineEventListener(function(e) {
            if(goog.string.contains(e.detail.line, 'node mcu confirmed')||
                goog.string.contains(e.detail.line, 'powered by Lua')) {
                _node_instance._output_console.writeLine("Confirmed - NodeMCU found");
                _node_instance.disconnect(()=>found_callback(_node_instance));
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
 * @param console - output goes here.
 * @param baud_rate number - the baud rate to scan with.
 * @param timeout - how long to wait in seconds for a serial response to the sent text.
 * @param found_callback Called when it's found with the Serial path.
 */
bounce.Nodemcu.scan = function(console, baud_rate, timeout, found_callback) {
    console.writeLine("Starting scan at " + baud_rate + "...");
    var onGetDevices = function(err, ports) {
        ports.forEach((port)=> {
            console.writeLine('Found serial port ' + port.comName + ', ' + port.manufacturer + '. Testing...');
            var mcu = new bounce.Nodemcu(port, baud_rate, console);
            mcu.validate(found_callback, timeout * 1000);
        });
    };

    SerialPort.list(onGetDevices);
};
