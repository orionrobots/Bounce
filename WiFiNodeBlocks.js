var block_color_wifi = 15;

Blockly.Blocks['wifi_mode'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wifi mode")
        .appendField(new Blockly.FieldDropdown([["client","STATION"], ["access point","SOFTAP"], ["accesspoint and client","STATIONAP"], ["none","NULLMODE"]]), "WIFI_MODE");
    this.setOutput(true, "WIFI_MODE");
    this.setColour(block_color_wifi);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Lua['wifi_mode'] = function(block) {
  var dropdown_wifi_mode = block.getFieldValue('WIFI_MODE');
  var code = "wifi." + dropdown_status;
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Blocks['wifi_setmode'] = {
  init: function() {
    this.appendValueInput("MODE")
        .setCheck("WIFI_MODE")
        .appendField("set wifi to");
    this.setColour(block_color_wifi);
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Lua['wifi_setmode'] = function(block) {
  var value_mode = Blockly.Lua.valueToCode(block, 'MODE', Blockly.Lua.ORDER_ATOMIC);
  var code = "wifi.setmode(" + mode + ")\n";
  return code;
};

Blockly.Blocks['wifi_getmode'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get wifi mode");
    this.setOutput(true, "WIFI_MODE");
    this.setColour(block_color_wifi);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Lua['wifi_getmode'] = function(block) {
  var code = "wifi.getmode()\n";
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Blocks["wifi_sta_status"] = {
  init: function() {
    this.appendDummyInput()
		.appendField("wifi status")
        .appendField(new Blockly.FieldDropdown([["idle","STA_IDLE"], ["connecting","STA_CONNECTING"], ["wrong password","STA_WRONGPWD"], ["access point not found","STA_APNOTFOUND"], ["fail","STA_FAIL"], ["ok","STA_GOTIP"]]), "STATUS");
    this.setOutput(true, "WIFI_STA_STATUS");
    this.setColour(block_color_wifi);
	this.setTooltip("");
	this.setHelpUrl("");
  }
};

Blockly.Lua["wifi_sta_status"] = function(block) {
  var dropdown_status = block.getFieldValue("STATUS");
  var code = "wifi." + dropdown_status;
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Blocks["wifi_sta_getstatus"] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get wifi client status");
    this.setOutput(true, "WIFI_STA_STATUS");
    this.setColour(block_color_wifi);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Lua["wifi_sta_getstatus"] = function(block) {
  var code = "wifi.sta.status()\n";
  return [code, Blockly.Lua.ORDER_NONE];
}; 
  
Blockly.Blocks['wifi_sta_config'] = {
  init: function() {
    this.appendValueInput("SSID")
        .setCheck("String")
        .appendField("create config for access point connection with")
        .appendField("ssid");
    this.appendValueInput("PWD")
        .setCheck("String")
        .appendField("password");
    this.setInputsInline(true);
    this.setOutput(true, "WIFI_STA_CONFIG");
    this.setColour(block_color_wifi);
    this.setTooltip("connect to Access Point (DO NOT save config to flash)");
    this.setHelpUrl("https://nodemcu.readthedocs.io/en/master/en/modules/wifi/#wifistaconnect");
  }
};  

Blockly.Lua['wifi_sta_config'] = function(block) {
  var value_ssid = Blockly.Lua.valueToCode(block, 'SSID', Blockly.Lua.ORDER_ATOMIC);
  var value_pwd = Blockly.Lua.valueToCode(block, 'PWD', Blockly.Lua.ORDER_ATOMIC);
  // TODO: Assemble Lua into code variable.
  var code = "{ssid=" + ssid + "pwd=" + value_pwd + ", value_pwd}";
  return [code, Blockly.Lua.ORDER_NONE];
};
