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
