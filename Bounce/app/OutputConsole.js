/**
 * Create a console to output data in visible in the UI.
 * @param output_element A DOM element to use for output.
 * @constructor
 */
var OutputConsole = function (output_element) {
    this.output_element = output_element;
    this.lineTypedHandler = null;
    this.writeLine('Console initialised.');
};

/**
 * Write some data to the output. HTML is escaped.
 * @param data Data to write.
 */
OutputConsole.prototype.write = function(data) {
    var safe_data = goog.string.htmlEscape(data);
    safe_data = goog.string.newLineToBr(safe_data);
    this.output_element.append(safe_data);
};

/**
 * Write a line of data.
 * @param line
 */
OutputConsole.prototype.writeLine = function(line) {
    this.write(line + '\n')
};

/**
 * Set a handler for a line being typed. Only one handler allowed here.
 * @param handler The handler to call. Expects only a "line" parameter - a string of input.
 */
OutputConsole.prototype.lineTyped = function(handler) {
    this.lineTypedHandler = handler;
};

OutputConsole.prototype.setupInput = function(inputElement) {
    var _oc = this;
    inputElement.keypress(function(e) {
        /* If it's an enter key */
       if(e.which == 13) {
           var line = inputElement.val();
           _oc.lineTypedHandler(line + "\n");
           inputElement.val('');
       }
    });
};