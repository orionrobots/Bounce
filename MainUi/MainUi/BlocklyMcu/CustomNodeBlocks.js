Blockly.Blocks['pin_mode'] = {
    init: function () {
        this.appendValueInput("pin")
            .setCheck("Number")
            .appendField("pin");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["input", "INPUT"], ["output", "OUTPUT"]]), "MODE");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.Lua['pin_write'] = {

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
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};



Blockly.Blocks['tmr_alarm'] = {
    init: function() {
        this.appendValueInput("timer")
            .setCheck("Number")
            .appendField("timer");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["every", "1"], ["after", "0"]]), "repeat");
        this.appendValueInput("interval")
            .setCheck("Number");
        this.appendStatementInput("NAME")
            .appendField("millis do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(60);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
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