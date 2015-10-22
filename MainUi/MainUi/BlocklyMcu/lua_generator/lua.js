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
 * @fileoverview Helper functions for generating Lua for blocks.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

goog.provide('Blockly.Lua');

goog.require('Blockly.Generator');


Blockly.Lua = new Blockly.Generator('Lua');

/**
 * Note: ComputerCraft uses Lua 5.1, so that's what we use
 * [http://www.computercraft.info/forums2/index.php?/topic/15305-lua-52/].
 */

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Lua.addReservedWords(
    // Special character
    '_' +
    // From theoriginalbit's script:
    // https://github.com/espertus/blockly-lua/issues/6
    '__inext,assert,bit,colors,colours,coroutine,disk,dofile,error,fs,' +
    'fetfenv,getmetatable,gps,help,io,ipairs,keys,loadfile,loadstring,math,' +
    'native,next,os,paintutils,pairs,parallel,pcall,peripheral,print,' +
    'printError,rawequal,rawget,rawset,read,rednet,redstone,rs,select,' +
    'setfenv,setmetatable,sleep,string,table,term,textutils,tonumber,' +
    'tostring,turtle,type,unpack,vector,write,xpcall,_VERSION,__indext,' +
    // Not included in the script, probably because it wasn't enabled:
    'HTTP,' +
    // Keywords (http://www.lua.org/pil/1.3.html).
    'and,break,do,else,elseif,end,false,for,function,if,in,local,nil,not,or,' +
    'repeat,return,then,true,until,while,' +
    // Metamethods (http://www.lua.org/manual/5.2/manual.html).
    'add,sub,mul,div,mod,pow,unm,concat,len,eq,lt,le,index,newindex,call,' +
    // Basic functions (http://www.lua.org/manual/5.2/manual.html, section 6.1).
    'assert,collectgarbage,dofile,error,_G,getmetatable,inpairs,load,' +
    'loadfile,next,pairs,pcall,print,rawequal,rawget,rawlen,rawset,select,' +
    'setmetatable,tonumber,tostring,type,_VERSION,xpcall,' +
    // Modules (http://www.lua.org/manual/5.2/manual.html, section 6.3).
    'require,package,string,table,math,bit32,io,file,os,debug'
);

/**
 * Order of operation ENUMs.
 * http://www.lua.org/manual/5.1/manual.html#2.5.6
 */
Blockly.Lua.ORDER_ATOMIC = 0;          // literals
// The next level was not explicit in documentation and inferred by Ellen.
Blockly.Lua.ORDER_HIGH = 1;            // Function calls, tables[]
Blockly.Lua.ORDER_EXPONENTIATION = 2;  // ^
Blockly.Lua.ORDER_UNARY = 3;           // not # - ()
Blockly.Lua.ORDER_MULTIPLICATIVE = 4;  // * / %
Blockly.Lua.ORDER_ADDITIVE = 5;        // + -
Blockly.Lua.CONCATENATION = 6;         // ..
Blockly.Lua.ORDER_RELATIONAL = 7;      // < > <=  >= ~= ==
Blockly.Lua.ORDER_AND = 8;             // and
Blockly.Lua.ORDER_OR = 9;              // or
Blockly.Lua.ORDER_NONE = 10;

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1)\n'
 * @type ?string
 */
Blockly.Lua.INFINITE_LOOP_TRAP = null;

/**
 * This is used as a placeholder in functions defined using
 * Blockly.Lua.provideFunction_.  It must not be legal code that could
 * legitimately appear in a function definition (or comment), and it must
 * not confuse the regular expression parser.
 */
Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_ = '{{{}}}';
Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_REGEXP_ =
    new RegExp(Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_, 'g');

// Change the default prefix from '$_' to 'var'.
// A prefix is needed to prevent variables from starting with 'lua_'
// or 'LUA_'.
Blockly.Names.PREFIX_ = 'var';

/**
 * Initialise the database of variable names.
 */
Blockly.Lua.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Lua.definitions_ = {};
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Lua.functionNames_ = {};

  if (Blockly.Variables) {
    if (!Blockly.Lua.variableDB_) {
      Blockly.Lua.variableDB_ =
          new Blockly.Names(Blockly.Lua.RESERVED_WORDS_);
    } else {
      Blockly.Lua.variableDB_.reset();
    }

    /*
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = Blockly.Lua.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ' = nil';
    }
    Blockly.Lua.definitions_['variables'] = defvars.join('\n');
    */
  }
};

Blockly.Lua.SENSOR_REGEXP_ = /\Wsensor\./;

/**
 * Prepend the generated code with the function definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Lua.finish = function(code) {
  var definitions = [];
  for (var name in Blockly.Lua.definitions_) {
    definitions.push(Blockly.Lua.definitions_[name]);
  }
  var prefix = definitions.join('\n\n');
/*
  if (Blockly.Lua.SENSOR_REGEXP_.test(code) ||
      Blockly.Lua.SENSOR_REGEXP_.test(prefix)) {
    prefix += '\n\n' +
        'function getSensor()\n' +
        '  if peripheral and peripheral.getType("right") == "peripheral" then\n' +
        '    local per = peripheral.wrap("right")\n' +
        '    if per and per.detectBlock and per.detectBlockUp then\n' +
        '      return per\n' +
        '    end\n' +
        '  end\n' +
        '  return false\n' +
        'end\n\n' +
        'sensor = getSensor()\n' +
        'if not sensor then\n' +
        '  error("Sensor not found")\n' +
        'end\n';
  }
*/
  return prefix.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Lua.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped Lua string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Lua string.
 * @private
 */
Blockly.Lua.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Lua from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Lua code created for this block.
 * @return {string} Lua code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Lua.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Define a function to be included in the generated code.
 * The first time this is called with a given desiredName, the code is
 * saved and an actual name is generated.  Subsequent calls with the
 * same desiredName have no effect but have the same return value.
 *
 * It is up to the caller to make sure the same desiredName is not
 * used for different code values.
 *
 * The code gets output when Blockly.Lua.finish() is called.
 *
 * @param {string} desiredName The desired name of the function (e.g., isPrime).
 * @param {code} A list of Lua statements.
 * @return {string} The actual name of the new function.  This may differ
 *     from desiredName if the former has already been taken by the user.
 * @private
 */
Blockly.Lua.provideFunction_ = function(desiredName, code) {
  if (!Blockly.Lua.definitions_[desiredName]) {
    var functionName = Blockly.Lua.variableDB_.getDistinctName(
        desiredName, Blockly.Generator.NAME_TYPE);
    Blockly.Lua.functionNames_[desiredName] = functionName;
    Blockly.Lua.definitions_[desiredName] = code.join('\n').replace(
        Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);
  }
  return Blockly.Lua.functionNames_[desiredName];
};
