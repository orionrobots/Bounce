var block_color_i2c = 300;
var block_color_sensors = 310;

Blockly.Lua['i2c_setup'] = function (block) {
    var sda = Blockly.Lua.valueToCode(block, 'sda', Blockly.Lua.ORDER_ATOMIC) || 1;
    var scl = Blockly.Lua.valueToCode(block, 'scl', Blockly.Lua.ORDER_ATOMIC) || 2;
    var speed = block.getFieldValue('SPEED');
	var code = "i2c.setup(0, " + sda + ", " + scl + ", " + speed + ")\n";
    return code;
};

Blockly.Blocks['i2c_setup'] = {
    init: function () {
		this.setInputsInline(true);
		this.appendDummyInput()
            .appendField("I²C: setup");
        this.appendValueInput("sda")
            .setCheck(["Number", "GPIO_PIN"])
            .appendField("pin SDA");
        this.appendValueInput("scl")
            .setCheck(["Number", "GPIO_PIN"])
            .appendField("pin SCL");
		this.appendDummyInput()
            .appendField("comm. speed")
            .appendField(new Blockly.FieldDropdown([["slow", "i2c.SLOW"]]), "SPEED");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(block_color_i2c);
        this.setTooltip('Setup I2C Bus');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.Blocks['am2320_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("am2320: setup");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(block_color_sensors);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Lua['am2320_setup'] = function(block) {
  var code = "am2320.setup()\n";
  return code;
};

Blockly.Blocks['am2320_setup_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("am2320: setup and read");
    this.appendDummyInput()
        .appendField("model into ")
        .appendField(new Blockly.FieldVariable("model"), "MODEL");
    this.appendDummyInput()
        .appendField("version into")
        .appendField(new Blockly.FieldVariable("version"), "VERSION");
    this.appendDummyInput()
        .appendField("serial into")
        .appendField(new Blockly.FieldVariable("serial"), "SERIAL");
    //this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(block_color_sensors);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Lua['am2320_setup_info'] = function(block) {
  var var_model = Blockly.Lua.variableDB_.getName(block.getFieldValue('MODEL'), Blockly.Variables.NAME_TYPE);
  var var_version = Blockly.Lua.variableDB_.getName(block.getFieldValue('VERSION'), Blockly.Variables.NAME_TYPE);
  var var_serial = Blockly.Lua.variableDB_.getName(block.getFieldValue('SERIAL'), Blockly.Variables.NAME_TYPE);
  var code = var_model + ", " + var_version + ", " + var_serial + " = am2320.setup()\n";
  return code;
};

Blockly.Blocks['am2320_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("am2320: read temperature into")
        .appendField(new Blockly.FieldVariable("temperature"), "TEMPERATURE")
        .appendField("humidity into ")
        .appendField(new Blockly.FieldVariable("humidity"), "HUMIDITY");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true, null);
    this.setColour(block_color_sensors);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Lua['am2320_read'] = function(block) {
  var var_temperature = Blockly.Lua.variableDB_.getName(block.getFieldValue('TEMPERATURE'), Blockly.Variables.NAME_TYPE);
  var var_humidity = Blockly.Lua.variableDB_.getName(block.getFieldValue('HUMIDITY'), Blockly.Variables.NAME_TYPE);
  var code = var_humidity + ", " + var_temperature + " = am2320.read()\n";
  return code;
};