
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
//goog.require('goog.ui.ToolbarButton');
//goog.require('goog.ui.ToolbarMenuButton');

// Core Bockly.
goog.require('Blockly');
// Choose a language.
goog.require('Blockly.Msg.en');

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

function changed() {
    console.log("Workspace changed");
    if (is_preparing) {
        is_preparing = false;
    } else {
        blocklyLua.notifyDocumentChanged();
    }
}
var data_from_file;

$(function () {
    blocklyDiv = goog.dom.$('blocklyDiv');
    // Load other toolbar xml here

    workspace = Blockly.inject(blocklyDiv,
        { toolbox: goog.dom.$('toolbox') });
    workspace.addChangeListener(changed);
    make_toolbar();
    $('#load_file').click(function () {
        var reader = new FileReader();
        var fd = goog.dom.$('test_file').files[0];
        reader.onload = function (evt) {
            new_document();
            load_document(evt.target.result);
        };
        reader.readAsText(fd);
    });
    scan_serial();
});

function scan_serial() {
    // Scan all the serial devices, output to output window.
    var onGetDevices = function(ports) {
        for (var i = 0; i < ports.length; i++) {
            $('#output').append(ports[i].path+ "/n");
            //console.log(ports[i].path);
        }
    };
    chrome.serial.getDevices(onGetDevices);
}

function make_toolbar() {
    var tb = new goog.ui.Toolbar();
    tb.decorate(goog.dom.$('toolbar'));
    tb.addChild(new goog.ui.ToolbarButton('Button'), true);
    tb.getChildAt(0).setTooltip('This is a tooltip for a button');
    tb.render(goog.dom.getElement('toolBar'));
}
