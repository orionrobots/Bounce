require("google-closure-library");
goog.require("goog.string");
/**
 * Create a console to output data in visible in the UI.
 * @constructor
 */
var OutputConsole = function () {
    this.outputElement = null;
    this.lineTypedHandler = null;
};

/**
 *
 * @param outputElement A DOM element to write the output to.
 * @param inputElement A DOM element to read the input from.
 */
OutputConsole.prototype.setup = function(outputElement, inputElement) {
    this.outputElement = outputElement;
    this.lineTypedHandler = null;
    this.writeLine('Console initialised.');
    this.setupInput(inputElement);
};

/**
 * Write some data to the output. HTML is escaped.
 * @param data Data to write.
 */
OutputConsole.prototype.write = function(data) {
    var safe_data = goog.string.htmlEscape(data);
    safe_data = goog.string.newLineToBr(safe_data);
    this.outputElement.append(safe_data);
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

module.exports = OutputConsole;