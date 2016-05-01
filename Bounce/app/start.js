var workspace;
var mcu_console;
var is_preparing = false;
var ui;

/**
 * Create a console to output data in visible in the UI.
 * @param output_element A DOM element to use for output.
 * @constructor
 */
var OutputConsole = function (output_element) {
    /**
     * Write some data to the output. HTML is escaped.
     * @param data Data to write.
     */
    this.write = function(data) {
        var safe_data = goog.string.htmlEscape(data);
        safe_data = goog.string.newLineToBr(safe_data);
        output_element.append(output_element, safe_data);
    };

    /**
     * Write a line of data.
     * @param line
     */
    this.writeLine = function(line) {
        this.write(line + '\n')
    };

    this.writeLine('Console initialised');
};


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
    Blockly.Xml.domToWorkspace(workspace, xml);
}

function new_document() {
    is_preparing = true;
    Blockly.mainWorkspace.clear();
}

function BounceUI() {
    var toolbar;
    var currentMcu;
    var connectMenu, fileMenu;
    var _ui = this;
    var _currentFileEntry;
    var _modified = false;

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

    function _upload(mcu) {
        var fndlg = new AskForFilename();
        fndlg.display(function(filename) {
            var code = Blockly.Lua.workspaceToCode(workspace);
            mcu.send_as_file(code, filename, function() {
                mcu_console.writeLine("Completed upload");
            });
        });
    }

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

    $("#run_button").click(function() { run(currentMcu); });
    $("#open_button").click(_open_file);
    $("#saveas_button").click(_save_as);
    $("#save_button").click(_save);
    $("#upload_as_init").click(function() { _upload_as_init(currentMcu); });
    $("#upload").click(function() { _upload(currentMcu); });
    // Callback to add found items to the menu.
    var found_item = function(mcu) {
        mcu_console.writeLine('Adding found item...');
        var connectItem = new goog.ui.MenuItem(mcu.port);
        connectItem.setCheckable(true);
        connectMenu.addItem(connectItem);

        $(connectItem.getContentElement()).click(function() {
            _connect_menu_item_clicked(connectItem, mcu);
        });
    };

    // When the scanButton is clicked, scan for mcu's to add.
    $("#scan_button").click(function() {
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
            toolbar.getChild("run_button").setEnabled(true);
            toolbar.getChild("upload").setEnabled(true);
            toolbar.getChild("upload_as_init").setEnabled(true);

            /* stopButton.setEnabled(true); */
        });
    }

    this.changed = function () {
        console.log("Workspace changed");
        if (is_preparing) {
            is_preparing = false;
            _modified = true;
        } else {
            fileMenu.getChild("saveas_button").setEnabled(true);
            if (_currentFileEntry) {
                fileMenu.getChild("save_button").setEnabled(true);
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

