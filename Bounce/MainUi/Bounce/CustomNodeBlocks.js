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
        this.setColour(20);
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
        this.setColour(20);
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
        this.setColour(20);
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
        this.setColour(20);
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
        this.setColour(60);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
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
        this.setHelpUrl('http://www.example.com/');
        this.setColour(60);
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
        this.setHelpUrl('http://www.example.com/');
    }
};