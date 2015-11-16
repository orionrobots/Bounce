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
});

function make_toolbar() {
    var tb = new goog.ui.Toolbar();
    tb.decorate(goog.dom.$('toolbar'));
}