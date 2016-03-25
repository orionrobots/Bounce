
goog.provide('bounce.start');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.style');
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
var blocklyDiv;

function export_document() {
    var xml = Blockly.Xml.workspaceToDom(workspace);

    var xml_text = Blockly.Xml.domToPrettyText(xml);
    return xml_text;
}
var is_preparing = false;

function load_document(text) {
    is_preparing = true;
    var xml = Blockly.Xml.textToDom(text);
    Blockly.Xml.domToWorkspace(workspace, xml);
}

function new_document() {
    is_preparing = true;
    Blockly.mainWorkspace.clear();
}

//function changed() {
//    console.log("Workspace changed");
//    if (is_preparing) {
//        is_preparing = false;
//    } else {
//        blocklyLua.notifyDocumentChanged();
//    }
//}
var data_from_file;


var OutputConsole = function (output_element) {
    this.write = function(data) {
        output_element.append(output_element, data);
    };

    this.writeLine = function(line) {
        this.write(line + '\n')
    };
};

var console;

$(function () {
    blocklyDiv = goog.dom.$('blocklyDiv');
    // Load other toolbar xml here
    workspace = Blockly.inject(blocklyDiv,
        { toolbox: goog.dom.$('toolbox'), media: "blockly-nodemcu/media/" });
    //workspace.addChangeListener(changed);

    console = new OutputConsole($('#output'));
    console.writeLine('Output console initialised');
    var ui = new BounceUI();
    ui.make_toolbar();

    //$('#load_file').click(function () {
    //    var reader = new FileReader();
    //    var fd = goog.dom.$('test_file').files[0];
    //    reader.onload = function (evt) {
    //        new_document();
    //        load_document(evt.target.result);
    //    };
    //    reader.readAsText(fd);
    //});
});

/**
 * Send the code directly to the mcu repl.
 * @param mcu
 */
function run(mcu) {
    var code = Blockly.Lua.workspaceToCode(workspace);
    // make a work list of lines..
    var lines = code.split("\n");
    var current_line = 0;
    var last_timer;
    // Send each one, with the sent callback priming the next.
    function _send_next() {
        if (current_line < lines.length) {
            mcu.send_data(lines[current_line++] + "\n", function() {
                // Calling send next, but not immediately.
                // First - so node has time to respond.
                // Second - to prevent very large stack recursion.
                last_timer = goog.async.Delay(_send_next, 100);
                last_timer.start();
            });
        }
    }

    _send_next();
}

function BounceUI() {
    var toolbar, runButton, stopButton;
    var currentMcu;

    // Save, Save As, Load, Export Lua, Print?
    function _add_file_menu() {
        var fileMenu = new goog.ui.Menu();
        var newButton = new goog.ui.MenuItem("New");
        fileMenu.addItem(newButton);
        var openButton = new goog.ui.MenuItem("Open");
        fileMenu.addItem(openButton);
        var saveButton = new goog.ui.MenuItem("Save");
        fileMenu.addItem(saveButton);
        var saveAsButton = new goog.ui.MenuItem("Save As...");
        saveAsButton.setEnabled(false);
        fileMenu.addItem(saveAsButton);

        toolbar.addChild(new goog.ui.ToolbarMenuButton('File', fileMenu), true);
    }

    function _add_run_buttons() {
        // Run (make startup, send as file..., upload_file...) - only show if connected
        runButton = new goog.ui.ToolbarButton("Run");
        toolbar.addChild(runButton, true);

        // STOP (big red stop) - only show if connected
        stopButton = new goog.ui.ToolbarButton("Stop");
        toolbar.addChild(stopButton, true);

        goog.events.listen(runButton.getContentElement(),
            goog.events.EventType.CLICK,
            function(e) {
                run(currentMcu);
        });
    }

    /**
     *
     * @param connectItem Menu item that was clicked
     * @param mcu The associated NodeMCU device
     * @private
     */
    function _connect_menu_item_clicked(connectItem, mcu) {
        mcu.connect(function() {
            // We've now connected the mcu. Update the UI
            console.writeLine("Connected");
            currentMcu = mcu;
            // Add a tick (Check) to the connection menu item
            connectItem.setChecked(true);
            // disconnect any others
            // Enable the run menu
            runButton.setEnabled(true);
            stopButton.setEnabled(true);
        });
    }

    function _add_connection_menu() {
        // Connect menu:
        var connectMenu = new goog.ui.Menu();
            // Scan for devices
        var scanButton = new goog.ui.MenuItem("Scan");
        connectMenu.addItem(scanButton);
        connectMenu.addItem(new goog.ui.MenuSeparator());
            // ---

            // device 1... - connect/disconnect
        toolbar.addChild(new goog.ui.ToolbarMenuButton('Connect', connectMenu), true);

        // Callback to add found items to the menu.
        var found_item = function(mcu) {
            console.writeLine('Adding found item...');
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
        goog.events.listen(scanButton.getContentElement(),
            goog.events.EventType.CLICK,
            function(e) {
                bounce.Nodemcu.scan(console, found_item);
        });
    }

    function _add_help_menu() {}

    this.make_toolbar = function () {
        toolbar = new goog.ui.Toolbar();
        toolbar.decorate(goog.dom.$('toolbar'));

        _add_file_menu();
        _add_run_buttons();
        _add_connection_menu();
        _add_help_menu();
    };
}
