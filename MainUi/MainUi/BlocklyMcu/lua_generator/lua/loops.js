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
 * @fileoverview Generating Lua for loop blocks.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

goog.provide('Blockly.Lua.loops');

goog.require('Blockly.Lua');


Blockly.Lua['controls_repeat'] = function(block) {
  // Repeat n times (internal number).
  var repeats = parseInt(block.getTitleValue('TIMES'), 10);
  var branch = Blockly.Lua.statementToCode(block, 'DO') || '';
  var loopVar = Blockly.Lua.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + '= 1, ' + repeats + ' do\n' + branch + 'end';
  return code;
};

Blockly.Lua['controls_repeat_ext'] = function(block) {
  // Repeat n times (external number).
  var repeats = Blockly.Lua.valueToCode(block, 'TIMES',
      Blockly.Lua.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.Lua.statementToCode(block, 'DO') || '\n';
  var loopVar = Blockly.Lua.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' = 1, ' + repeats + ' do\n' +
      branch + 'end\n';
  return code;
};

Blockly.Lua['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getTitleValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Lua.valueToCode(block, 'BOOL',
      until ? Blockly.Lua.ORDER_UNARY :
      Blockly.Lua.ORDER_NONE) || 'False';
  var branch = Blockly.Lua.statementToCode(block, 'DO') || '\n';
  if (block.getTitleValue('MODE') == 'UNTIL') {
    if (!argument0.match(/^\w+$/)) {
      argument0 = '(' + argument0 + ')';
    }
    argument0 = 'not ' + argument0;
  }
  return 'while ' + argument0 + ' do\n' + branch + 'end\n';
};

Blockly.Lua['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.Lua.variableDB_.getName(
      block.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Lua.valueToCode(block, 'FROM',
      Blockly.Lua.ORDER_NONE) || '0';
  var argument1 = Blockly.Lua.valueToCode(block, 'TO',
      Blockly.Lua.ORDER_NONE) || '0';
  var increment = Blockly.Lua.valueToCode(block, 'BY',
      Blockly.Lua.ORDER_NONE) || '1';
  var branch = Blockly.Lua.statementToCode(block, 'DO') || '\n';

  var code = 'for ' + variable0 + ' = ' + argument0 + ', ' + argument1;
  // Increment amount may be omitted if 1.
  if (!Blockly.isNumber(increment) || Math.abs(parseFloat(increment)) != 1) {
    code += ', ' + increment;
  }
  code += ' do\n' + branch + 'end\n';
  return code;
};

Blockly.Lua['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Lua.variableDB_.getName(
      block.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Lua.valueToCode(block, 'LIST',
      Blockly.Lua.ORDER_RELATIONAL) || '[]';
  var branch = Blockly.Lua.statementToCode(block, 'DO') || '\n';
  var code = 'for _, ' + variable0 + ' in ipairs(' + argument0 + ') do \n' +
      branch + 'end\n';
  return code;
};

Blockly.Lua['controls_flow_statements'] = function(block) {
  // break; we eliminated "continue"
  return 'break\n';
};
