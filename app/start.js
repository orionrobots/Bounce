var mcu_console;
var ui;

const {dialog, Menu, MenuItem} = require('electron').remote;
const fs = require('fs');
const package_info = require('./package.json');

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
    this._is_preparing_new_document = false;
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
    var filename = dialog.showSaveDialog({filters:bounce_file_filters});
    this._currentFileEntry = filename;
    this._save();
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

BounceUI.prototype.show_about_box = function() {
    dialog.showMessageBox({
        type: "info",
        title: "About Bounce",
        message: "Bounce version:" + package_info.version  + "\nHomepage: " + package_info.homepage
    })
};

/**
 * Prepare the ui and menu
 * TODO: About box - accredit Sway Grantham for planting this seed.
 */
BounceUI.prototype.setup_menu = function() {
    var _ui = this;
    
    template = [
        {
            label: 'File',
            submenu: [
                {label: 'New', click: () => { _ui.new_document(); }, accelerator: 'CommandOrControl+N'},
                {label: 'Open', click: ()=> { _ui._open_file(); }},
                {label: 'Save', id: 'save', enabled: false, click: ()=> { _ui._save(); },
                 accelerator: 'CommandOrControl+S'},
                {label: 'Save As', id: 'saveas', enabled: false, click: ()=> { _ui._save_as(); }},
                {type: 'separator'},
                {label: 'Export', click: ()=> {_ui._export(); }},
                {type: 'separator'},
                {role: 'quit'}
            ]
        },
        {
            label: 'Examples',
            submenu: this.get_examples()
        },
        {
            label: 'Upload',
            id: 'upload',
            enabled: false,
            click: ()=>_ui._upload(_ui.currentMcu)
        },
        {
            label: 'Upload as Init',
            id: 'upload_init',
            enabled: false,
            click: ()=>_ui._upload_as_init()
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    role: 'toggledevtools'
                    // click: ()=> require('electron').remote.getCurrentWebContents().toggleDevTools()
                },
                {
                    label: 'About',
                    click: ()=> _ui.show_about_box()
                }
            ]
        }
    ]
    this.menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(this.menu);
    
    fileMenu = this.menu.items.find(i=>i.label == 'File').submenu;
    this.save_button = fileMenu.items.find(i=>i.id == 'save');
    this.save_as_button = fileMenu.items.find(i=>i.id == 'saveas');

    $('#toggle-connections').click(function() {
        $('#connections').toggle();
        return false;
    });
    $('#scan').click(() => _ui.start_scan());
    this.connectMenu = $('#connections');
};

BounceUI.prototype.enable_connected_menu_items_ = function() {
    $('#play').removeClass('disabled');
    $('#stop').removeClass('disabled');
    $('#play').click( ()=>this.run());
    $('#stop').click( ()=>this.currentMcu.stop());    
};    

BounceUI.prototype.show_save_first_dialog = function() {
    if(this._modified) {
        var response = dialog.showMessageBox({
            type: "warning",
            buttons: ["Save", "Don't Save", "Cancel"],
            message: "This work has not been saved",
            detail: "Do you want to save your changes?",
        });
        switch(response) {
            case 0:
                if (this._currentFileEntry) {
                    this._save();
                } else {
                    this._save_as();
                }
                return true;
                break;
            case 1:
                return true;
            default:
                return false;
        }
    } else {
        return true;
    }
};

BounceUI.prototype.new_document = function() {
    if(this.show_save_first_dialog()) {
        this._is_preparing_new_document = true;
        Blockly.mainWorkspace.clear();
        this._currentFileEntry = null;
        this._modified = false;
    }
};

BounceUI.prototype.changed = function () {
    console.log("Workspace changed");
    if (this._is_preparing_new_document) {
        this._is_preparing_new_document = false;
    } else {
        this._modified = true;
        this.save_as_button.enabled = true;
        if (this._currentFileEntry) {
            this.save_button.enabled = true;
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
 * Connect menu - li's - label is the port.
 */
BounceUI.prototype.start_scan = function() {
    var _ui = this;
    bounce.Nodemcu.scan(mcu_console, this.config.getBaudRate(), this.config.getSerialTimeout(), function(mcu) {
        if (_ui.connectMenu.find('#'+mcu.get_slug()).length > 0) {
            console.log("Port already added");
            return;
        }

        mcu_console.writeLine('Adding found item... ' + mcu.get_name());
        var connectItem = $.parseHTML('<li id="' + mcu.get_slug() + '">' + mcu.get_name() + "</li>");
        _ui.connectMenu.append(connectItem);
        $(connectItem).click(()=> {
            mcu_console.writeLine("Connecting.. outer");
            _ui.connect_menu_item_clicked_(connectItem, mcu);
            _ui.connectMenu.hide();
            _ui.enable_connected_menu_items_();
            return false;
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
    mcu_console.writeLine("Connecting..");
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
            mcu_console.lineTyped((line) => mcu.send_data(line));
            // Add a tick (Check) to the connection menu item
            connectItem.checked = true;
            // disconnect any others
            // Enable the run menu
            _ui.menu.items.find(i=>i.id=="go").enabled = true;
            _ui.menu.items.find(i=>i.id=="stop").enabled = true;
            // _ui.menu.items.find(i=>i.id=="upload").enabled = true;
            _ui.menu.items.find(i=>i.id=="upload_as_init").enabled = true;
        });
    } catch(e) {
        mcu_console.writeLine("Unable to connect to that chip");
        throw(e);
    }
};

/**
 * Prepare menu of examples
 */
BounceUI.prototype.load_example = function(filename) {
    $.get("Examples/" + filename, (data)=>{
        this.blocklyManager.loadDocument(data);
    });
}

BounceUI.prototype.get_examples = function() {
    return [
        {click: ()=> this.load_example("blink.node"), label: "Blink an LED"},
        {click: ()=>this.load_example("loops.node"), label: "Loops"},
        {click: ()=>this.load_example("pin_write.node"), label: "Writing to an IO Pin"},
        {click: ()=>this.load_example("print_hello_world.node"), label: "Print Hello World"},
        {click: ()=>this.load_example("timers.node"), label: "Timers"},
        // <!--<div id="temperature_dh11" data-value="dh11sense.node" class="example">DH11 Temp Sensor"},-->
        // {click: ()=>this.load_example("ws2812_test.node"), label: "WS2812 Led Demo"},
    ]
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

