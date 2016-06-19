var workspace;
var mcu_console;
var is_preparing = false;
var ui;


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

function prepare_blockly_workspace() {
    var blocklyArea = document.getElementById('blocklyArea');
    var blocklyDiv = document.getElementById('blocklyDiv');
    workspace = Blockly.inject(blocklyDiv,
      {toolbox: goog.dom.$('toolbox'), media: "blockly-nodemcu/media/" });
    var onresize = function() {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        var element = blocklyArea;
        var x = 0;
        var y = 0;
        do {
          x += element.offsetLeft;
          y += element.offsetTop;
          element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(workspace);
    };
    window.addEventListener('resize', onresize, false);
    onresize();
}


/**
 * Send the code directly to the mcu repl.
 * @param mcu
 */
function run(mcu) {
    var code = Blockly.Lua.workspaceToCode(workspace);
    mcu.send_multiline_data(code, function() {});
}

function export_document() {
    var xml = Blockly.Xml.workspaceToDom(workspace);

    return Blockly.Xml.domToPrettyText(xml);
}


function load_document(text) {
    is_preparing = true;
    var xml = Blockly.Xml.textToDom(text);
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(workspace, xml);
}

/**
 * Bounce Ui - The controller mapping the html window buttons to functions.
 * @constructor
 */
function BounceUI() {
    var fileMenu;
    var _ui = this;
    this._currentFileEntry=null;
    this._modified = false;
}

/**
 * Button handler to upload the current code with a filename.
 * It will (todo) ask the user for a filename.
 *
 * @param mcu
 * @private
 */
BounceUI.prototype._upload = function(mcu) {
    var fndlg = new AskForFilename();
    fndlg.display(function(filename) {
        var code = Blockly.Lua.workspaceToCode(workspace);
        mcu.send_as_file(code, filename, function() {
            mcu_console.writeLine("Completed upload");
        });
    });
};

/**
 * Save the NodeMcu blockly code
 *
 * @private
 */
BounceUI.prototype._save = function() {
    this._currentFileEntry.createWriter(function(writer) {
        writer.onwriteend = function(e) {
            console.log('write complete');
        };
        writer.write(new Blob([export_document()], {type: 'text/plain'}));
    })
};

/**
 * Open a file from the filesystem. Load into blockly workspace.
 *
 * @private
 */
BounceUI.prototype._open_file = function() {
    var _ui = this;
    var accepts = [{
        description: "Bounce code",
        extensions: ['bounce', 'node']
    }];
    // Show a file open
    chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function(theEntry) {
        if (!theEntry) {
            mcu_console.writeLine('No file selected.');
            return;
        }
        // On ok
        // use local storage to retain access to this file
        //chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
        // Inject that code.
        console.log("turning entry into file");
        theEntry.file(function(file) {
            console.log("opening file");
            var reader = new FileReader();
            reader.onloadend = function(e) {
                load_document(e.target.result);
            };
            reader.readAsText(file);
        });
        _ui._currentFileEntry = theEntry;
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
    chrome.fileSystem.chooseEntry({type: 'saveFile', accepts:accepts}, function(writableFileEntry) {
        _ui._currentFileEntry = writableFileEntry;
        _ui._save();
    });
};

/**
 * Export the lua code
 */
BounceUI.prototype._export = function() {
    var _ui = this;
    var accepts = [{
        extensions: ['lua'],
        description: 'Lua File'
    }, {
        extensions: ['txt'],
        description: 'Plain text'
    }];
    chrome.fileSystem.chooseEntry({type: 'saveFile', accepts:accepts}, function(writableFileEntry) {
        writableFileEntry.createWriter(function(writer) {
            writer.onwriteend = function(e) {
                console.log('write complete');
            };
            writer.write(
                new Blob([
                    Blockly.Lua.workspaceToCode(workspace)], {type: 'text/plain'}));
        })
    });
};

/**
 * Prepare the ui and menu
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

    $("#run_button").click(function() { run(_ui.currentMcu); });
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
    $("#close_button").click(function(){ window.close(); });

    this.setup_examples();
};

BounceUI.prototype.new_document = function() {
    /* todo - request confirmation */
    is_preparing = true;
    Blockly.mainWorkspace.clear();
    this._currentFileEntry = null;
    this._modified = false;
};

BounceUI.prototype.changed = function () {
    console.log("Workspace changed");
    if (is_preparing) {
        is_preparing = false;
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
    var code = Blockly.Lua.workspaceToCode(workspace);
    this.currentMcu.send_as_file(code, filename, function() {
        mcu_console.writeLine("Completed upload");
    });
};

/**
 * Start the serial port scan
 */
BounceUI.prototype.start_scan = function() {
    var _ui = this;
    bounce.Nodemcu.scan(mcu_console, this.config.getBaudRate(), function(mcu) {
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
    var examples_menu = new goog.ui.Menu();
    examples_menu.decorate(goog.dom.getElement("examples_menu"));
    $("#examples_menu").find(".example").click(function(event) {
        /* Load appropriate example */
        var filename = event.target.parentElement.getAttribute("data-value");
        $.get("Examples/" + filename, function(data){
            load_document(data);
        });
    });
};

BounceUI.prototype.connect_code = function() {
    var code_element = $('#code');
    this.gc = new GeneratedCode(code_element);
    this.gc.setWorkspace(workspace);
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


$(function () {
    prepare_blockly_workspace();

    mcu_console = new OutputConsole($('#output'));
    mcu_console.setupInput($('#consoleInput'));
    ui = new BounceUI();
    ui.setup_menu();
    ui.setup_tabs();
    workspace.addChangeListener(function() {ui.changed()});
});

