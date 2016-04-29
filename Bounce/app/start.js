
goog.provide('bounce.start');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.async.Delay');
//goog.require('goog.ui.Button');
//goog.require('goog.ui.ButtonSide');
//goog.require('goog.ui.Component.EventType');
//goog.require('goog.ui.Component.State');
//goog.require('goog.ui.Menu');
//goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Toolbar');
//goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarMenuButton');

goog.require('bounce.Nodemcu.scan');

// Core Bockly.
goog.require('Blockly');
// Choose a language.
// goog.require('Blockly.Msg.en');

goog.require('Blockly.Block');
goog.require('Blockly.BlockSvg');
goog.require('Blockly.Blocks');
goog.require('Blockly.Bubble');
goog.require('Blockly.Comment');
goog.require('Blockly.Connection');
goog.require('Blockly.ConnectionDB');
goog.require('Blockly.ContextMenu');
goog.require('Blockly.Css');
goog.require('Blockly.Field');
goog.require('Blockly.FieldAngle');
goog.require('Blockly.FieldCheckbox');
goog.require('Blockly.FieldColour');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldLabel');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Flyout');
goog.require('Blockly.Generator');
goog.require('Blockly.Icon');
goog.require('Blockly.Input');
goog.require('Blockly.Msg');
goog.require('Blockly.Mutator');
goog.require('Blockly.Names');
goog.require('Blockly.Procedures');
goog.require('Blockly.Scrollbar');
goog.require('Blockly.ScrollbarPair');
goog.require('Blockly.Toolbox');
goog.require('Blockly.Tooltip');
goog.require('Blockly.Trashcan');
goog.require('Blockly.Variables');
goog.require('Blockly.Warning');
goog.require('Blockly.WidgetDiv');
goog.require('Blockly.Workspace');
goog.require('Blockly.WorkspaceSvg');
goog.require('Blockly.Xml');
goog.require('Blockly.ZoomControls');
goog.require('Blockly.inject');
goog.require('Blockly.utils');


var workspace;
var mcu_console;
var is_preparing = false;
var has_changed = false;
var ui;


var OutputConsole = function (output_element) {
    this.write = function(data) {
        var safe_data = goog.string.htmlEscape(data);
        safe_data = goog.string.newLineToBr(safe_data);
        output_element.append(output_element, safe_data);
    };

    this.writeLine = function(line) {
        this.write(line + '\n')
    };

    this.writeLine('Console initialised');
};


function prepare_blockly_workspace() {
    var blocklyArea = document.getElementById('blocklyArea');
    var blocklyDiv = document.getElementById('blocklyDiv');
    workspace = Blockly.inject(blocklyDiv,
      {toolbox: goog.dom.$('toolbox'), media: "blockly-nodemcu/media/" });
    var onresize = function(e) {
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

/**
 * Upload the file as init.lua.
 *
 * Later: Implement choosing the filename, and dofile.
 *
 * @param mcu
 */
function _upload_as_init(mcu) {
    var filename="init.lua";
    var code = Blockly.Lua.workspaceToCode(workspace);
    mcu.send_as_file(code, filename, function() {
        mcu_console.writeLine("Completed upload");
    });
}

function export_document() {
    var xml = Blockly.Xml.workspaceToDom(workspace);

    var xml_text = Blockly.Xml.domToPrettyText(xml);
    return xml_text;
}


function load_document(text) {
    is_preparing = true;
    var xml = Blockly.Xml.textToDom(text);
    Blockly.Xml.domToWorkspace(workspace, xml);
}

function new_document() {
    is_preparing = true;
    Blockly.mainWorkspace.clear();
}


/**
 * Short cut for button clicks
 * @param element - Either a dom element, or name of a dom element.
 * @param handler - function call on click.
 * @private
 */
function _when_clicked(element, handler) {
    if( typeof(element) == "string") {
        element = goog.dom.getElement(element);
    }
    goog.events.listen(element,
        goog.events.EventType.CLICK, handler);
}

function BounceUI() {
    var toolbar, runButton, stopButton, saveButton, saveAsButton;
    var currentMcu;
    var connectMenu, fileMenu;
    var _ui = this;
    var _currentFileEntry;
    var _modified = False;

    /**
     * Open a file from the filesystem. Load into blockly workspace.
     *
     * @private
     */
    function _open_file() {
        var accepts = [{
            mimeTypes: ['text/*'],
            extensions: ['xml', 'node']
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
                    new_document();
                    load_document(e.target.result);
                };
                reader.readAsText(file);
            });
            _currentFileEntry = theEntry;
        });
    }

    function _save() {
        _currentFileEntry.createWriter(function(writer) {
            writer.onwriteend = function(e) {
                console.log('write complete');
            };
            writer.write(new Blob([export_document()], {type: 'text/plain'}));
        })
    }

    function _save_as() {
        var accepts = [{
            mimeTypes: ['text/*'],
            extensions: ['xml', 'node']
        }];
        chrome.fileSystem.chooseEntry({type: 'saveFile', accepts:accepts}, function(writableFileEntry) {
            _currentFileEntry = writableFileEntry;
            _save();
        });
    }

    toolbar = new goog.ui.Toolbar();
    toolbar.decorate(goog.dom.getElement('toolbar'));
    connectMenu = new goog.ui.Menu();
    connectMenu.decorate(goog.dom.getElement('connect_menu'));

    fileMenu = new goog.ui.Menu();
    fileMenu.decorate(goog.dom.getElement('file_menu'));
    saveAsButton = goog.dom.getElement("saveas_button");
    saveButton = goog.dom.getElement("save_button");
    runButton = goog.dom.getElement("run_button");

    _when_clicked(runButton, function(e) {
        run(currentMcu);
    });

    _when_clicked("open_button", _open_file);
    _when_clicked(saveAsButton, _save_as);
    _when_clicked(saveButton, _save);
    _when_clicked("upload_as_init", function() {_upload_as_init(currentMcu);});
    // Callback to add found items to the menu.
    var found_item = function(mcu) {
        mcu_console.writeLine('Adding found item...');
        var connectItem = new goog.ui.MenuItem(mcu.port);
        connectItem.setCheckable(true);
        connectMenu.addItem(connectItem);

        goog.events.listen(connectItem.getContentElement(),
            goog.events.EventType.CLICK,
            function(e) {
                _connect_menu_item_clicked(connectItem, mcu);
            }
        );
    };

    // When the scanButton is clicked, scan for mcu's to add.
    _when_clicked("scan_button", function(e) {
        bounce.Nodemcu.scan(mcu_console, found_item);
    });

    /**
     *
     * @param connectItem Menu item that was clicked
     * @param mcu The associated NodeMCU device
     * @private
     */
    function _connect_menu_item_clicked(connectItem, mcu) {
        mcu.connect(function() {
            // We've now connected the mcu. Update the UI
            mcu_console.writeLine("Connected");
            currentMcu = mcu;
            _ui.currentMcu = mcu;
            // Add a tick (Check) to the connection menu item
            connectItem.setChecked(true);
            // disconnect any others
            // Enable the run menu
            runButton.setEnabled(true);
            /* stopButton.setEnabled(true); */
        });
    }

    this.changed = function () {
        console.log("Workspace changed");
        if (is_preparing) {
            is_preparing = false;
        } else {
            fileMenu.getChild("saveas_button").setEnabled(true);
            //$(saveAsButton).removeClass('goog-menuitem-disabled');
            if (_currentFileEntry) {
                fileMenu.getChild("save_button").setEnabled(true);
                //
                //$(saveButton).removeClass('goog-menuitem-disabled');
            }
        }
    }
}

$(function () {
    prepare_blockly_workspace();

    mcu_console = new OutputConsole($('#output'));
    ui = new BounceUI();
    workspace.addChangeListener(ui.changed);
});
