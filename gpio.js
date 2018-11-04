var block_color_gpio = 25;
var block_color_gpio_val = 250;

Blockly.Blocks["gpio_pin"] = {
  init: function() {
    this.appendDummyInput()
       .appendField(new Blockly.FieldDropdown([["GPIO0","3"], ["GPIO1","10"], 
	   ["GPIO2","4"], ["GPIO3","9"], ["GPIO4","2"], ["GPIO5","1"], ["GPIO9","11"], 
	   ["GPIO10","12"], ["GPIO12","6"], ["GPIO13","7"], ["GPIO14","5"], ["GPIO15","8"], 
	   ["GPIO16","0"]]), "GPIO");
    this.setOutput(true, "GPIO_PIN");
    this.setColour(block_color_gpio_val);
	this.setTooltip("define gpios");
	this.setHelpUrl("https://nodemcu.readthedocs.io/en/master/en/modules/gpio/#gpio-module");
  }
};

Blockly.Lua["gpio_pin"] = function(block) {
  var dropdown_gpio = block.getFieldValue("GPIO") || "0" ;
  return [dropdown_gpio, Blockly.Lua.ORDER_ATOMIC];
};

Blockly.Blocks["gpio_level"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("gpio level")
        .appendField(new Blockly.FieldDropdown([["hight","HIGH"], ["low","LOW"]]), "LEVEL");
    this.setInputsInline(true);
    this.setOutput(true, "GPIO_LEVEL");
    this.setColour(block_color_gpio_val);
    this.setTooltip("defines GPIO level");
    this.setHelpUrl("https://nodemcu.readthedocs.io/en/master/en/modules/gpio/#gpio-module");
  }
};

Blockly.Lua["gpio_level"] = function(block) {
  var dropdown_level = block.getFieldValue('LEVEL');
  return ["gpio." + dropdown_level, Blockly.Lua.ORDER_ATOMIC];
};

Blockly.Blocks['gpio_mode'] = {
    init: function () {
        this.appendValueInput("PIN")
            .setCheck(["Number", "GPIO_PIN"])
            .appendField("set pin");
        this.appendDummyInput()
		    .appendField("mode to")
            .appendField(new Blockly.FieldDropdown([["input", "INPUT"], 
					["output", "OUTPUT"], ["interrupt", "INT"], ["open drain", "OPENDRAIN"]]), "MODE")
			.appendField("pull-up resistor")
			.appendField(new Blockly.FieldCheckbox("FALSE"), "PULLUP");					
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(block_color_gpio);
        this.setTooltip("Set the mode - input/output for a pin.");
        this.setHelpUrl("https://nodemcu.readthedocs.io/en/master/en/modules/gpio/#gpiomode");
    }
};

Blockly.Lua['gpio_mode'] = function (block) {
    var pin = Blockly.Lua.valueToCode(block, "PIN", Blockly.Lua.ORDER_ATOMIC) || 0;
    var mode = block.getFieldValue('MODE') || "OUTPUT";
	var pullup = block.getFieldValue('PULLUP') == 'TRUE' ? ", gpio.PULLUP" : "";
    var code = "gpio.mode(" + pin + ", gpio." + mode + pullup + ")\n";
    return code;
};

Blockly.Blocks['gpio_trig'] = {
init: function() {
   this.appendValueInput("PIN")
		.setCheck(["Number", "GPIO_PIN"])
		.appendField("when GPIO pin");	  
    this.appendDummyInput()
        .appendField("is")
        .appendField(new Blockly.FieldDropdown([["up","up"], ["down","down"], ["up/down","both"], ["low","low"], ["high","high"]]), "TYPE")
        .appendField("do");
    this.appendStatementInput("DO")
        //.setCheck("pinTriggerCallback")
        .appendField(new Blockly.FieldVariable("level"), "LEVEL")
        .appendField(new Blockly.FieldVariable("when"), "WHEN")
        .appendField(new Blockly.FieldVariable("event count"), "EVENT_COUNT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);		
    this.setColour(block_color_gpio);
    this.setTooltip("Establish or clear a callback function to run on interrupt for a pin.");
    this.setHelpUrl("https://nodemcu.readthedocs.io/en/master/en/modules/gpio/#gpiotrig");
  }
};

Blockly.Lua['gpio_trig'] = function(block) {
  var pin = Blockly.Lua.valueToCode(block, 'PIN', Blockly.Lua.ORDER_NONE) || 0;
  var type = block.getFieldValue('TYPE') || "both";
  var statements_do = Blockly.Lua.statementToCode(block, 'DO') || "";
  
  var var_level = Blockly.Lua.variableDB_.getName(block.getFieldValue('LEVEL'), Blockly.Variables.NAME_TYPE) || 1;
  var var_when = Blockly.Lua.variableDB_.getName(block.getFieldValue('WHEN'), Blockly.Variables.NAME_TYPE);
  var var_event_count = Blockly.Lua.variableDB_.getName(block.getFieldValue('EVENT_COUNT'), Blockly.Variables.NAME_TYPE);
  
  var code = "gpio.trig(" + pin + ", \"" + type + "\", function(" + var_level + ", " + var_when + " ," + var_event_count + ")\n" + statements_do + "end)\n";
  return code;
};

Blockly.Blocks["gpio_read"] = {
  init: function() {
    this.appendValueInput("PIN")
        .setCheck(["Number", "GPIO_PIN"])
		.appendField("read level on GPIO pin");
    this.setOutput(true, "GPIO_LEVEL");
    this.setColour(block_color_gpio);
    this.setTooltip("Read digital GPIO pin value");
    this.setHelpUrl("https://nodemcu.readthedocs.io/en/master/en/modules/gpio/#gpioread");
  }
};

Blockly.Lua['gpio_read'] = function(block) {
  var pin = Blockly.Lua.valueToCode(block, 'PIN', Blockly.Lua.ORDER_NONE) || 0;
  var code = "gpio.read(" + pin + ")";
  return [code, Blockly.Lua.ORDER_FUNCTION_CALL];
};

Blockly.Blocks["gpio_write"] = {
  init: function() {
    this.appendValueInput("PIN")
        .setCheck(["Number", "GPIO_PIN"])
        .appendField("set GPIO pin");
    this.appendValueInput("LEVEL")
        .setCheck("GPIO_LEVEL")
        .appendField("to");
    this.setInputsInline(true);
    this.setColour(block_color_gpio);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);	
    this.setTooltip("Set digital GPIO pin value.");
    this.setHelpUrl("https://nodemcu.readthedocs.io/en/master/en/modules/gpio/#gpiowrite");
  }
};

Blockly.Lua["gpio_write"] = function(block) {
  var pin = Blockly.Lua.valueToCode(block, "PIN", Blockly.Lua.ORDER_ATOMIC) || 0;
  // Blockly.Lua.statementToCode(block, "LEVEL") ||
  var level =  Blockly.Lua.valueToCode(block, "LEVEL", Blockly.Lua.ORDER_ATOMIC) || "gpio.HIGH";
  var code = "gpio.write(" + pin + ", " + level + ")\n";
  return code;
};