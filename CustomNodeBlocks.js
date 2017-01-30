// Block colors
var block_color_io=20;
var block_color_timer = 60;
var block_color_leds = 87;

function add_custom_blocks(Blockly) {
    Blockly.Lua['pin_mode'] = function (block) {
        var pin = Blockly.Lua.valueToCode(block, 'pin',
        Blockly.Lua.ORDER_ATOMIC) || 0;
        var mode = block.getFieldValue('MODE');
        var code = "gpio.mode(" + pin + ", " + mode + ")\n";
        return code;
    };

    Blockly.Blocks['pin_mode'] = {
        init: function () {
            this.appendValueInput("pin")
                .setCheck("Number")
                .appendField("pin");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([["input", "gpio.INPUT"], ["output", "gpio.OUTPUT"]]), "MODE");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(block_color_io);
            this.setTooltip('Set the mode - input/output for a pin.');
            this.setHelpUrl('http://www.example.com/');
        }
    };

    Blockly.Lua['pin_write'] = function (block) {
        var pin = Blockly.Lua.valueToCode(block, 'pin',
        Blockly.Lua.ORDER_ATOMIC) || 0;
        var level = Blockly.Lua.valueToCode(block, 'level',
        Blockly.Lua.ORDER_ATOMIC) || 'False';
        var code = "gpio.write(" + pin + ", " + level + " and 1 or 0)\n";
        return code;
    };

    Blockly.Blocks['pin_write'] = {
        init: function () {
            this.appendValueInput("pin")
                .setCheck("Number")
                .appendField("pin");
            this.appendValueInput("level")
                .setCheck("Boolean")
                .appendField("write");
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(block_color_io);
            this.setTooltip('Write to a pin');
            this.setHelpUrl('http://www.example.com/');
        }
    };

    Blockly.Lua['pin_read'] = function (block) {
        var pin = Blockly.Lua.valueToCode(block, 'pin',
        Blockly.Lua.ORDER_ATOMIC) || 0;
        var code = "gpio.read(" + pin + ")";
        return [code, Blockly.Lua.ORDER_FUNCTION_CALL];
    };

    Blockly.Blocks['pin_read'] = {
        init: function () {
            this.appendValueInput("pin")
                .setCheck("Number")
                .appendField("pin");
            this.appendDummyInput()
                .appendField("read");
            this.setInputsInline(true);
            this.setOutput(true);
            this.setColour(block_color_io);
            this.setTooltip('');
            this.setHelpUrl('http://www.example.com/');
        }
    };

    Blockly.Lua['analog_read'] = function (block) {
        // Analog pin is fixed on the esp.
        var code = "adc.read(0)";
        return [code, Blockly.Lua.ORDER_FUNCTION_CALL];
    };

    Blockly.Blocks['analog_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('Read analog');
            this.setOutput(true);
            this.setColour(block_color_io);
        }
    };

    Blockly.Lua['tmr_alarm'] = function (block) {
        // Repeat string
        var timer = Blockly.Lua.valueToCode(block, 'timer',
            Blockly.Lua.ORDER_ATOMIC) || 0;
        var interval = Blockly.Lua.valueToCode(block, 'interval',
            Blockly.Lua.ORDER_ATOMIC) || 100;
        var repeat = block.getFieldValue('REPEAT');
        var branch = Blockly.Lua.statementToCode(block, 'DO') || '';
        var code = 'tmr.alarm(' + timer + ',' + interval + ', ' + repeat + ', function() \n' + branch + '\nend )\n';
        return code;
    };

    Blockly.Blocks['tmr_alarm'] = {
        init: function() {
            this.appendValueInput("timer")
                .setCheck("Number")
                .appendField("timer");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([["every", "1"], ["after", "0"]]), "REPEAT");
            this.appendValueInput("interval")
                .setCheck("Number");
            this.appendStatementInput("DO")
                .appendField("millis do");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(block_color_timer);
            this.setTooltip('');
        }
    };

    Blockly.Lua['tmr_stop'] = function (block) {
        var timer = Blockly.Lua.valueToCode(block, 'timer',
            Blockly.Lua.ORDER_ATOMIC) || 0;
        var code = 'tmr.stop(' + timer + ')\n';
        return code;
    };

    Blockly.Blocks['tmr_stop'] = {
        init: function () {
            this.appendValueInput("timer")
                .appendField("stop timer");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setTooltip('');
            this.setColour(block_color_timer);
        }
    };

    Blockly.Lua['text_rep'] = function (block) {
        // Repeat string
        var text = Blockly.Lua.valueToCode(block, 'TEXT',
            Blockly.Lua.ORDER_ATOMIC) || '\'\'';
        var count = Blockly.Lua.valueToCode(block, 'COUNT',
            Blockly.Lua.ORDER_ATOMIC) || '0';
        var code = 'string.rep(' + text + ', ' + count + ')';
        return [code, Blockly.Lua.ORDER_FUNCTION_CALL];
    };

    Blockly.Blocks['text_rep'] = {
        init: function () {
            this.appendValueInput("TEXT")
                .setCheck(["String", "Colour"])
                .appendField("repeat text");
            this.appendValueInput("COUNT")
                .setCheck("Number")
                .appendField("for");
            this.appendDummyInput()
                .appendField("times");
            this.setInputsInline(true);
            this.setOutput(true, "String");
            this.setColour(160);
            this.setTooltip('');
        }
    };

    Blockly.Lua['ws2812_writergb'] = function (block) {
        // Ws2812 write rgb list
        // Decode a list(table) of RGB not a string.
        var pin = Blockly.Lua.valueToCode(block, 'pin',
        Blockly.Lua.ORDER_ATOMIC) || 0;
        var data = Blockly.Lua.valueToCode(block, 'data',
            Blockly.Lua.ORDER_ATOMIC) || '\'\'';
        var code = 'ws2812.writergb(' + pin + ", " + data + ')\n';
        return code;
    };

    Blockly.Blocks['ws2812_writergb'] ={
        init: function () {
            this.appendDummyInput()
                .appendField("ws2812 output");
            this.appendValueInput("data")
                .setCheck("String")
                .appendField("colour list");
            this.appendDummyInput()
                .appendField("on ");
            this.appendValueInput("pin")
                .setCheck("Number")
                .appendField("pin");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(false);
            this.setColour(block_color_leds);
            this.setTooltip('');
        }
    };

    Blockly.Lua['dht_temp'] = function(block) {
        // Read DHT temperature
        var pin = Blockly.Lua.valueToCode(block, 'pin',
            Blockly.Lua.ORDER_ATOMIC) || 0;
        // To get one value, we have to construct in brackets, then deref.
        var code= '({dht.read(' + pin + ')})[2]';
        return [code, Blockly.Lua.ORDER_FUNCTION_CALL];
    };

    Blockly.Blocks['dht_temp'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Read dht temperature on");
            this.appendValueInput("pin")
                .setCheck("Number")
                .appendField("pin");
            this.setOutput(true);
            this.setColour(block_color_io);
            this.setTooltip("Read the temperature from a dht sensor");
        }
    };


    Blockly.Lua['dht_humidity'] = function(block) {
        // Read DHT temperature
        var pin = Blockly.Lua.valueToCode(block, 'pin',
            Blockly.Lua.ORDER_ATOMIC) || 0;
        // To get one value, we have to construct in brackets, then deref.
        var code= '({dht.read(' + pin + ')})[3]';
        return [code, Blockly.Lua.ORDER_FUNCTION_CALL];
    };

    Blockly.Blocks['dht_humidity'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Get dht humidity on");
            this.appendValueInput("pin")
                .setCheck("Number")
                .appendField("pin");
            this.setOutput(true);
            this.setColour(block_color_io);
            this.setTooltip("Read the humidity from a dht sensor");
        }
    };


    /* Redefine colours for use with rgb devices like the ws2812. */
    /* Keep colours as chars */
    var repack_colour_=function(colour) {
        var r = parseInt(colour.substring(2, 3), 16);
        var g = parseInt(colour.substring(4, 5), 16);
        var b = parseInt(colour.substring(6, 7), 16);
        return r + "," + g + "," + b;
    };

    Blockly.Lua['colour_picker'] = function(block) {
    // Colour picker.
    var code = 'string.char(' + repack_colour_(block.getFieldValue('COLOUR')) + ')';
    return [code, Blockly.Lua.ORDER_ATOMIC];
    };

    Blockly.Lua['colour_random'] = function(block) {
    // Generate a random colour.
    var functionName = Blockly.Lua.provideFunction_(
        'colour_random',
        ['function ' + Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_ + '()',
        '  local r= math.random(0, 2^5 - 1)',
        '  local g= math.random(0, 2^5 - 1)',
        '  local b= math.random(0, 2^5 - 1)',
        '  return string.char(r, g, b)',
        'end']);

    var code = functionName + '()';
    return [code, Blockly.Lua.ORDER_HIGH];
    };

    Blockly.Lua['colour_rgb'] = function(block) {
    // Compose a colour from RGB components.
    var r = Blockly.Lua.valueToCode(block, 'RED',
                                        Blockly.Lua.ORDER_NONE) || 0;
    var g = Blockly.Lua.valueToCode(block, 'GREEN',
                                        Blockly.Lua.ORDER_NONE) || 0;
    var b = Blockly.Lua.valueToCode(block, 'BLUE',
                                        Blockly.Lua.ORDER_NONE) || 0;
    var code = 'string.char(' + r + ', ' + g + ', ' + b + ')';
    return [code, Blockly.Lua.ORDER_HIGH];
    };

    Blockly.Lua['colour_blend'] = function(block) {
    // Blend two colours together.
    var functionName = Blockly.Lua.provideFunction_(
        'colour_blend',
        ['function ' + Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_ +
            '(colour1, colour2, ratio)',
        '  local r1 = string.byte(colour1, 0)',
        '  local r2 = string.byte(colour2, 0)',
        '  local g1 = string.byte(colour1, 1)',
        '  local g2 = string.byte(colour2, 1)',
        '  local b1 = string.byte(colour1, 2)',
        '  local b2 = string.byte(colour2, 2)',
        '  local ratio = math.min(1, math.max(0, ratio))',
        '  local r = math.floor(r1 * (1 - ratio) + r2 * ratio + .5)',
        '  local g = math.floor(g1 * (1 - ratio) + g2 * ratio + .5)',
        '  local b = math.floor(b1 * (1 - ratio) + b2 * ratio + .5)',
        '  return string.char(r, g, b)',
        'end']);
    var colour1 = Blockly.Lua.valueToCode(block, 'COLOUR1',
        Blockly.Lua.ORDER_NONE) || 'string.char(0, 0, 0)';
    var colour2 = Blockly.Lua.valueToCode(block, 'COLOUR2',
        Blockly.Lua.ORDER_NONE) || 'string.char(0, 0, 0)';
    var ratio = Blockly.Lua.valueToCode(block, 'RATIO',
        Blockly.Lua.ORDER_NONE) || 0;
    var code = functionName + '(' + colour1 + ', ' + colour2 + ', ' + ratio + ')';
    return [code, Blockly.Lua.ORDER_HIGH];
    };

    /* Fixes (to be pushed back into lua/lists.js - update_libs.sh needs to accommodate this properly) */
    Blockly.Lua['lists_split'] = function(block) {
        var mode = block.getFieldValue('MODE');
        var input = Blockly.Lua.valueToCode(block, 'INPUT');
        if(mode == 'JOIN') {
            var code = "table.concat(" + input + ")";
            return [code, Blockly.Lua.ORDER_HIGH];
        } else {
            //
            throw "Woops - not yet implemented";
        }
    };

    Blockly.Blocks['lists_combine'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("combine");
        this.appendValueInput("first")
            .setCheck("Array");
        this.appendValueInput("second")
            .setCheck("Array");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
    }
    };

    /* Combine two lists into one list */
    Blockly.Lua['lists_combine'] = function(block) {
        var first = Blockly.Lua.valueToCode(block, 'first');
        var second = Blockly.Lua.valueToCode(block, 'second');

        var functionName = Blockly.Lua.provideFunction_(
        'lists_combine',
        ['function ' + Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_ +
            '(first, second)',
            '  local new_list = {}',
            '  for item=1,#first do',
            '    table.insert(new_list, first[item])',
            '  end',
            '  for item=1, #second do',
            '    table.insert(new_list, second[item])',
            '  end',
            '  return new_list',
            'end']);
        var code = functionName + '(' + first + ',\n ' + second + ')';
        return [code, Blockly.Lua.ORDER_HIGH];
    };

    Blockly.Blocks['lights_led_grid'] ={
        init: function () {
            this.appendDummyInput()
                .appendField("led grid:");
            var grid_width = 8; // TODO: Configurable
            var grid_height = 8;
            for(var row=0; row<grid_height; row++) {
                var line = this.appendDummyInput().appendField(row + " ");
                for(var column=0; column<grid_width; column++) {
                    // TODO: Option, variables or colours.
                    line = line.appendField(new Blockly.FieldColour('#000000'), 'd' + row + '_' + column );
                }
            }
            this.setOutput(true);
            this.setColour(block_color_leds);
            this.setTooltip('Make a grid of colours for lights.');
        }
    };

    Blockly.Lua['lights_led_grid'] = function(block) {
        var code = 'string.char(';
        var grid_width = 8; // TODO: Configurable
        var grid_height = 8;

        var next_comma = "\n  ";
        for(var row=0; row<grid_height; row++) {
            var prefix="d" + row + "_";
            for(var column=0; column<grid_width; column++) {
                code += next_comma + repack_colour_(block.getFieldValue(prefix + column));
                next_comma = ", ";
            }
            next_comma = ",\n  ";
        }
        code += ')';
        return [code, Blockly.Lua.ORDER_ATOMIC]
    };
};

exports.add_custom_blocks = add_custom_blocks;