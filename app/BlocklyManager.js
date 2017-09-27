//Store the blockly manager class, and overrides to fit blockly functionality into Electron/Chrome apps.
'use strict';
goog.require('goog.ui.Prompt');

// Blockly.FieldVariable.prototype._validate_varname = function(newVar) {
//     // Merge runs of whitespace.  Strip leading and trailing whitespace.
//     // Beyond this, all names are legal.
//     if (newVar) {
//     newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
//     if (newVar == Blockly.Msg.RENAME_VARIABLE ||
//         newVar == Blockly.Msg.NEW_VARIABLE) {
//         // Ok, not ALL names are legal...
//         newVar = null;
//     }
//     }
//     return newVar;
// };

Blockly.prompt = function(message, defaultValue, callback) {
    prompt = new goog.ui.Prompt(message, defaultValue, callback);
    prompt.setModal(true);
    prompt.setVisible(true);
};