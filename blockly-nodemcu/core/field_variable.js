/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable input field.
 * @author fraser@google.com (Neil Fraser)
 *
 * Updates - by Danny Staple
 *  - Use the goog.ui.Prompt
 *  If this is updated, merge this in - chrome apps will not display window.prompt calls.
 */
'use strict';

goog.provide('Blockly.FieldVariable');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.Variables');
goog.require('goog.string');
goog.require('goog.ui.Prompt');


/**
 * Class for a variable's dropdown field.
 * @param {?string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @param {Function=} opt_changeHandler A function that is executed when a new
 *     option is selected.  Its sole argument is the new option value.
 * @extends {Blockly.FieldDropdown}
 * @constructor
 */
Blockly.FieldVariable = function(varname, opt_changeHandler) {
  Blockly.FieldVariable.superClass_.constructor.call(this,
      Blockly.FieldVariable.dropdownCreate, null);
  this.setChangeHandler(opt_changeHandler);
  this.setValue(varname || '');
};
goog.inherits(Blockly.FieldVariable, Blockly.FieldDropdown);


Blockly.FieldVariable.prototype._validate_varname = function(newVar) {
  // Merge runs of whitespace.  Strip leading and trailing whitespace.
  // Beyond this, all names are legal.
  if (newVar) {
    newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    if (newVar == Blockly.Msg.RENAME_VARIABLE ||
        newVar == Blockly.Msg.NEW_VARIABLE) {
      // Ok, not ALL names are legal...
      newVar = null;
    }
  }
  return newVar;
};

/**
 * Sets a new change handler for angle field.
 * @param {Function} handler New change handler, or null.
 */
Blockly.FieldVariable.prototype.setChangeHandler = function(handler) {
  var thisField = this;
  var wrappedHandler;
  if (handler) {
    // Wrap the user's change handler together with the variable rename handler.
    wrappedHandler = function(value) {
      var v1 = handler.call(this, value);
      if (v1 === null) {
        var v2 = v1;
      } else {
        if (v1 === undefined) {
          v1 = value;
        }
        var v2 = Blockly.FieldVariable.dropdownChange.call(this, v1);
        if (v2 !== undefined) {
          v2 = v1;
        }
      }
      v2 = thisField._validate_varname(v2);
      return v2 === value ? undefined : v2;
    };
  } else {
    wrappedHandler = Blockly.FieldVariable.dropdownChange;
  }
  Blockly.FieldVariable.superClass_.setChangeHandler.call(this, wrappedHandler);
};

/**
 * Install this dropdown on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldVariable.prototype.init = function(block) {
  if (this.sourceBlock_) {
    // Dropdown has already been initialized once.
    return;
  }

  if (!this.getValue()) {
    // Variables without names get uniquely named for this workspace.
    if (block.isInFlyout) {
      var workspace = block.workspace.targetWorkspace;
    } else {
      var workspace = block.workspace;
    }
    this.setValue(Blockly.Variables.generateUniqueName(workspace));
  }
  Blockly.FieldVariable.superClass_.init.call(this, block);
};

/**
 * Get the variable's name (use a variableDB to convert into a real name).
 * Unline a regular dropdown, variables are literal and have no neutral value.
 * @return {string} Current text.
 */
Blockly.FieldVariable.prototype.getValue = function() {
  return this.getText();
};

/**
 * Set the variable name.
 * @param {string} text New text.
 */
Blockly.FieldVariable.prototype.setValue = function(text) {
  this.value_ = text;
  this.setText(text);
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function() {
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    var variableList =
        Blockly.Variables.allVariables(this.sourceBlock_.workspace);
  } else {
    var variableList = [];
  }
  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && variableList.indexOf(name) == -1) {
    variableList.push(name);
  }
  variableList.sort(goog.string.caseInsensitiveCompare);
  variableList.push(Blockly.Msg.RENAME_VARIABLE);
  variableList.push(Blockly.Msg.NEW_VARIABLE);
  // Variables are not language-specific, use the name as both the user-facing
  // text and the internal representation.
  var options = [];
  for (var x = 0; x < variableList.length; x++) {
    options[x] = [variableList[x], variableList[x]];
  }
  return options;
};

/**
 * Event handler for a change in variable name.
 * Special case the 'New variable...' and 'Rename variable...' options.
 * In both of these special cases, prompt the user for a new name.
 * @param {string} text The selected dropdown menu option.
 * No return value
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownChange = function(text) {
  var workspace = this.sourceBlock_.workspace;
  var thisField = this;
  var oldVar = null;
  var prompt = null;

  var common_callback = function(value) {
    value = thisField._validate_varname(value);
    /* do processing of the value here */
    if(value == null) {

    } else {
      if(oldVar == null) {
        oldVar = value;
      }
      // We have the real value
      Blockly.Variables.renameVariable(oldVar, value, workspace);
      thisField.setValue(value);
    }
  };


  if (text == Blockly.Msg.RENAME_VARIABLE) {
    oldVar = this.getText();
    prompt = new goog.ui.Prompt(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), "", common_callback);
    prompt.setDefaultValue(oldVar);
    prompt.setVisible(true);
  } else if (text == Blockly.Msg.NEW_VARIABLE) {
    prompt = new goog.ui.Prompt(Blockly.Msg.NEW_VARIABLE_TITLE, "", common_callback);
    prompt.setDefaultValue('');
    prompt.setVisible(true);
  }
};
