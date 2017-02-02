const Blockly = require("node-blockly/browser");
const jquery = require('jquery');
const CustomNodeBlocks = require("./CustomNodeBlocks.js");

CustomNodeBlocks.add_custom_blocks(Blockly);

var BlocklyManager = function() {
    this.workspace = null;
    this.blocklyDiv = null;
    this.blocklyArea = null;
};

BlocklyManager.prototype.setup = function() {
    var _bm = this;
    this.blocklyArea = jquery('#blocklyArea')[0];
    this.blocklyDiv = jquery('#blocklyDiv')[0];
    console.log(this.blocklyDiv);

    var toolbox = jquery('#toolbox')[0];
    console.log("Injecting blockly");
    try {
        this.workspace = Blockly.inject(this.blocklyDiv, {toolbox: toolbox});
    } catch(err) {
        console.log(err);
    }
    console.log("Injected");
    window.addEventListener('resize', function() {_bm.resizeHandler()}, false);
    this.resizeHandler();
};

BlocklyManager.prototype.resizeHandler = function() {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = this.blocklyArea;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    this.blocklyDiv.style.left = x + 'px';
    this.blocklyDiv.style.top = y + 'px';
    this.blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    // this.blocklyDiv.style.height = (blocklyArea.offsetHeight - y) + 'px';
    Blockly.svgResize(this.workspace);
};

BlocklyManager.prototype.getCode = function() {
    return Blockly.Lua.workspaceToCode(this.workspace);
};

BlocklyManager.prototype.getDocument = function() {
    var xml = Blockly.Xml.workspaceToDom(this.workspace);
    return Blockly.Xml.domToPrettyText(xml);
};

BlocklyManager.prototype.loadDocument = function(document) {
    var xml = Blockly.Xml.textToDom(document);
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(this.workspace, xml);
};

exports.BlocklyManager = BlocklyManager;