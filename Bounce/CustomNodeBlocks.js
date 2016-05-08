// Block colors
var block_color_io=20;
var block_color_timer = 60;
var block_color_leds = 87;

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
            .setCheck("String")
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
    // Ws2812 write rgb
    var pin = Blockly.Lua.valueToCode(block, 'pin',
       Blockly.Lua.ORDER_ATOMIC) || 0;
    var data = Blockly.Lua.valueToCode(block, 'data',
        Blockly.Lua.ORDER_ATOMIC) || '\'\'';
    var code = 'ws2812.writergb(' + pin + ", " + data + ')';
    return [code, Blockly.Lua.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['ws2812_writergb'] ={
    init: function () {
        this.appendDummyInput()
            .appendField("ws2812 output");
        this.appendValueInput("data")
            .setCheck("String")
            .appendField("data string");
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
