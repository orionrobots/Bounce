// Describes interactions with a board for Bounce. There may be different boards with different output styles
function Board() {
    this.data_received = null;
    this.line_received = null;
}

// Style:  These all return deferred objects. 
// Connect to a board. Deferred resolves when complete.
Board.prototype.connect = function(comm_name, baud_rate) {};
// This function will verify this is the board in question. Deferred resolved when complete.
Board.prototype.validate = function() {};
// Set a function data_received(data) which is called every time data is present on the port.
Board.prototype.set_data_received = function(data_received_callback) {
    this.data_received = data_received_callback;
};
// Set a function line received(line) called when a complete line (including newline) is buffered. Assumes plain text output.
Board.prototype.set_line_received = function(line_received_callback) {
    this.line_received = line_received_callback;
};
// Send data to the board. Deferred resolved when complete.
Board.prototype.send_data = function(data) {};
// Send an array or lines, or big chunk of line data. Deferred resolved when complete.
Board.prototype.send_multiline_data = function(data) {};
// Send data as a named file - only implement for devices that support this.
Board.prototype.send_as_file = function(data, filename) {};
// Remove file
Board.prototype.remove_file = function(filename) {};
// List files. Calls the callback with the list as a list of strings.
Board.prototype.list_files = function(files_callback) {};
// run a file. No callback - so keep an eye on data received.
Board.prototype.run_file = function() {};
// Stop the current program running completed
Board.prototype.stop = function() {};

exports.Board = Board;