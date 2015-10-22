/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Generating Lua for variable blocks.
 *
 * This is unchanged from the Python version, except for replacing "Python"
 * with "Lua" wherever it appeared.
 *
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Lua.variables');

goog.require('Blockly.Lua');


Blockly.Lua['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.Lua.variableDB_.getName(block.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Lua.ORDER_ATOMIC];
};

Blockly.Lua['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE',
      Blockly.Lua.ORDER_NONE) || '0';
  var varName = Blockly.Lua.variableDB_.getName(block.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + '\n';
};

Blockly.Lua['variables_set_two'] = function(block) {
  // Set two variables to a function's return value.
  // If the input is not a procedure returning mulltiple values, the
  // user will have been warned both when the connection was made and when
  // changing to the Lua tab.
  var value = Blockly.Lua.valueToCode(block, 'VALUE',
      Blockly.Lua.ORDER_NONE) || 'nil, nil';
  var varName1 = Blockly.Lua.variableDB_.getName(block.getTitleValue('VAR1'),
      Blockly.Variables.NAME_TYPE);
  var varName2 = Blockly.Lua.variableDB_.getName(block.getTitleValue('VAR2'),
      Blockly.Variables.NAME_TYPE);
  return varName1 + ', ' + varName2 + ' = ' + value + '\n';
};

Blockly.Lua['variables_set_three'] = function(block) {
  // Set three variables to a function's return value.
  // If the input is not a procedure returning at least three values, the
  // user will have been warned both when the connection was made and when
  // changing to the Lua tab.
  var value = Blockly.Lua.valueToCode(block, 'VALUE',
      Blockly.Lua.ORDER_NONE) || 'nil, nil, nil';
  var varName1 = Blockly.Lua.variableDB_.getName(block.getTitleValue('VAR1'),
      Blockly.Variables.NAME_TYPE);
  var varName2 = Blockly.Lua.variableDB_.getName(block.getTitleValue('VAR2'),
      Blockly.Variables.NAME_TYPE);
  var varName3 = Blockly.Lua.variableDB_.getName(block.getTitleValue('VAR3'),
      Blockly.Variables.NAME_TYPE);
  return varName1 + ', ' + varName2 + ', ' + varName3 + ' = ' + value + '\n';
};
