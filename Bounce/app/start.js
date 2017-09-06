var mcu_console;
var ui;

const {dialog} = require('electron').remote;
const fs = require('fs');
/**
 *
 * @constructor Prompt for a filename - use "display(ok_callback, cancel_callback)" to prompt.
 */
function AskForFilename() {
    var main_div = $("#filename_dlg");
    var ok_button = main_div.find("#ok");
    var cancel_button = main_div.find("#cancel");
    var _lb = this;


    function _ok_clicked() {
        _lb.hide();
        var filename = main_div.find("#filename").val();
        _lb.ok_call(filename);
    }

    /**
     *
     * @param ok_call - Call this with the filename when this dialog is ok'd.
     * @param cancel_call - Call this if it's cancelled. May be empty.
     */
    this.display = function(ok_call, cancel_call) {
        $(main_div).removeClass("lightbox-hidden");
        this.ok_call = ok_call;
        ok_button.click(_ok_clicked);
        cancel_button.click(function() {
            _lb.hide();
            if(cancel_call) {
                cancel_call();
            }
        });
    };

    /**
     * Hide the popup.
     */
    this.hide = function () {
        $(main_div).addClass("lightbox-hidden");
    }
}

var BlocklyManager = function() {
    this.workspace = null;
    this.blocklyDiv = null;
    this.blocklyArea = null;
};

BlocklyManager.prototype.setup = function() {
    var _bm = this;
    this.blocklyArea = document.getElementById('blocklyArea');
    this.blocklyDiv = document.getElementById('blocklyDiv');
    this.workspace = Blockly.inject(this.blocklyDiv,
      {toolbox: goog.dom.$('toolbox'), media: "blockly-nodemcu/media/" });
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
    this.blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
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


/**
 * Bounce Ui - The controller mapping the html window buttons to functions.
 * @constructor
 */
function BounceUI() {
    var fileMenu;
    var _ui = this;
    this._currentFileEntry=null;
    this._modified = false;
    this._is_preparing = false;
}

BounceUI.prototype.connectBlockly = function(blocklyManager) {
    this.blocklyManager = blocklyManager;
    blocklyManager.workspace.addChangeListener(function() {ui.changed()});
};

/**
 * Button handler to upload the current code with a filename.
 * It will (todo) ask the user for a filename.
 *
 * @param mcu
 * @private
 */
BounceUI.prototype._upload = function(mcu) {
    var _ui = this;
    var fndlg = new AskForFilename();
    fndlg.display(function(filename) {
        mcu.send_as_file(_ui.blocklyManager.getCode(), filename, function() {
            mcu_console.writeLine("Completed upload");
        });
    });
};


/**
 * Send the code directly to the mcu repl.
 */
BounceUI.prototype.run = function(mcu) {
    var code = this.blocklyManager.getCode();
    this.currentMcu.send_multiline_data(code, function() {});
};

/**
 * Save the NodeMcu blockly code
 *
 * @private
 */
BounceUI.prototype._save = function() {
    var _ui = this;
    var data = _ui.blocklyManager.getDocument();
    fs.writeFile(this._currentFileEntry, data, function(err) {
        if (err) throw err;
        console.log('write complete');
    });
};

const bounce_file_filters = [{
    description: "Bounce code",
    name: "Bounce code",
    extensions: ['bounce', 'node']
}];
/**
 * Open a file from the filesystem. Load into blockly workspace.
 *
 * @private
 */
BounceUI.prototype._open_file = function() {
    var _ui = this;
    // Show a file open
    dialog.showOpenDialog({filters: bounce_file_filters}, function(filePaths) {
        console.log("opening file");
        var filePath = filePaths[0];
        data = fs.readFile(filePath, function(err, data) {
            _ui.is_preparing = true;
            _ui.blocklyManager.loadDocument(data);
        });
        _ui._currentFileEntry = filePath;
    });
};

/**
 * Save the blockly workspace to a file.
 *
 * @private
 */
BounceUI.prototype._save_as = function() {
    var _ui = this;

    var accepts = [{
        extensions: ['bounce', 'node'],
        description: "Bounce code"
    }];
    dialog.showSaveDialog({filters:bounce_file_filters}, function(filename) {
        _ui._currentFileEntry = filename;
        _ui._save();
    });
};

/**
 * Export the lua code
 */
BounceUI.prototype._export = function() {
    var _ui = this;
    var filters = [{
        extensions: ['lua'],
        name: 'Lua File'
    }, {
        extensions: ['txt'],
        name: 'Plain text'
    }];

    dialog.showSaveDialog({filters: filters}, function(filePath) {
        var data = Blockly.Lua.workspaceToCode(_ui.blocklyManager.workspace);
        fs.writeFile(filePath, data, function(err) {
            if (err) throw err;
            console.log('write complete');
        });
    });
};

/**
 * Prepare the ui and menu
 * TODO: About box - accredit Sway Grantham for planting this seed.
 */
BounceUI.prototype.setup_menu = function() {
    var _ui = this;

    this.toolbar = new goog.ui.Toolbar();
    this.toolbar.decorate(goog.dom.getElement('toolbar'));
    this.connectMenu = new goog.ui.Menu();
    this.connectMenu.decorate(goog.dom.getElement('connect_menu'));

    // var testItem = new goog.ui.MenuItem('test');
    // testItem.setId("test");
    // this.connectMenu.addChild(testItem, true);

    this.fileMenu = new goog.ui.Menu();
    this.fileMenu.decorate(goog.dom.getElement('file_menu'));

    $("#run_button").click(function() { _ui.run(); });
    $("#stop_button").click(function() { _ui.currentMcu.stop(); });
    $("#new_button").click(function() { _ui.new_document(); });
    $("#open_button").click(function() { _ui._open_file(); });
    $("#saveas_button").click(function() { _ui._save_as(); });
    $("#save_button").click(function() { _ui._save(); });
    $("#export_button").click(function() { _ui._export(); });
    $("#upload_as_init").click(function() { _ui._upload_as_init(); });
    $("#upload").click(function() { _ui._upload(_ui.currentMcu); });

    // When the scanButton is clicked, scan for mcu's to add.
    $("#scan_button").click(function() {_ui.start_scan()});

    this.setup_examples();
};

BounceUI.prototype.new_document = function() {
    /* todo - request confirmation */
    this._is_preparing = true;
    Blockly.mainWorkspace.clear();
    this._currentFileEntry = null;
    this._modified = false;
};

BounceUI.prototype.changed = function () {
    console.log("Workspace changed");
    if (this._is_preparing) {
        this._is_preparing = false;
        this._modified = true;
    } else {
        this.fileMenu.getChild("saveas_button").setEnabled(true);
        if (this._currentFileEntry) {
            this.fileMenu.getChild("save_button").setEnabled(true);
        }
    }
};

/**
 * Upload the file as init.lua.
 *
 */
BounceUI.prototype._upload_as_init = function() {
    var filename="init.lua";
    var code = this.blocklyManager.getCode();
    this.currentMcu.send_as_file(code, filename, function() {
        mcu_console.writeLine("Completed upload");
    });
};

/**
 * Start the serial port scan
 */
BounceUI.prototype.start_scan = function() {
    var _ui = this;
    bounce.Nodemcu.scan(mcu_console, this.config.getBaudRate(), this.config.getSerialTimeout(), function(mcu) {
        if($("#" + mcu.port).length > 0) {
            mcu_console.writeLine("Port already added");
            return;
        }

        mcu_console.writeLine('Adding found item... ' + mcu.port);
        var connectItem = new goog.ui.MenuItem(mcu.port);
        connectItem.setId(mcu.port);
        _ui.connectMenu.addChild(connectItem, true);

        $(connectItem.getContentElement()).click(function() {
            _ui.connect_menu_item_clicked_(connectItem, mcu);
        });
    });
};

/**
 *
 * @param connectItem Menu item that was clicked
 * @param mcu The associated NodeMCU device
 * @private
 */
BounceUI.prototype.connect_menu_item_clicked_ = function(connectItem, mcu) {
    var _ui = this;
    // if(this.currentMcu == mcu) {
    //     mcu_console.writeLine("Already connected to this mcu - disconnecting");
    //     mcu.disconnect();
    //     return;
    // }
    try {
        mcu.connect(function () {
            // We've now connected the mcu. Update the UI
            mcu_console.writeLine("Connected");
            _ui.currentMcu = mcu;
            mcu_console.lineTyped(mcu.send_data);
            // Add a tick (Check) to the connection menu item
            //connectItem.setChecked(true);
            // disconnect any others
            // Enable the run menu
            _ui.toolbar.getChild("run_button").setEnabled(true);
            _ui.toolbar.getChild("stop_button").setEnabled(true);
            //_ui.toolbar.getChild("upload").setEnabled(true);
            _ui.toolbar.getChild("upload_as_init").setEnabled(true);
        });
    } catch(e) {
        mcu_console.writeLine("Unable to connect to that chip");
        throw(e);
    }
};

/**
 * Prepare menu of examples
 */
BounceUI.prototype.setup_examples = function() {
    var _ui = this;
    var examples_menu = new goog.ui.Menu();
    examples_menu.decorate(goog.dom.getElement("examples_menu"));
    $("#examples_menu").find(".example").click(function(event) {
        /* Load appropriate example */
        var filename = event.target.parentElement.getAttribute("data-value");
        $.get("Examples/" + filename, function(data){
            _ui.blocklyManager.loadDocument(data);
        });
    });
};

BounceUI.prototype.connect_code = function() {
    var code_element = $('#code');
    this.gc = new GeneratedCode(code_element);
    this.gc.setWorkspace(this.blocklyManager.workspace);
};

/**
 * Prepare the tabs
 */
BounceUI.prototype.setup_tabs = function() {
    var right_tabs = new goog.ui.TabPane(document.getElementById('rightTabs'));
    right_tabs.addPage(new goog.ui.TabPane.TabPage(
        document.getElementById('console'), "Output"));
    right_tabs.addPage(new goog.ui.TabPane.TabPage(
        document.getElementById('code_page'), "Code"));
    this.connect_code();
    right_tabs.addPage(new goog.ui.TabPane.TabPage(
        document.getElementById('config'), "Options"));
    this.config = new BounceConfig();
};

/**
 * The App - it has logic. And ties the other elements together
 * @constructor
 */
BounceApp = function() {
    /* Just name the members here. Setup will construct and connect them */
    this.generated_code = null; /* Generated code */
    this.ui = null; /* UI - which has menu's and buttons */
    this.output_console = null; /* The output console */
    this.blockly_manager = null; /* This has a blockly workspace and manages it */
    this.node_mcu = null; /* This will have a value when connected */
    this.config = null; /* This has the apps configuration */
};


/**
 * Construct and connect the components of the app.
 */
BounceApp.prototype.setup = function() {
    this.output_console = new OutputConsole();
    this.output_console.setup($('#output'), $('#consoleInput'));

};

$(function () {
    var blocklyManager = new BlocklyManager();
    blocklyManager.setup();

    mcu_console = new OutputConsole();
    mcu_console.setup($('#output'), $('#consoleInput'));
    ui = new BounceUI();
    ui.connectBlockly(blocklyManager);
    ui.setup_menu();
    ui.setup_tabs();
});

