goog.provide('bocklylua.ide.Code');
goog.provide('bocklylua.ide');
goog.provide('bocklylua');

blocklylua.ide.makeMenu = function () {
    var menu = document.getElementById("menu");
    var saveBtn = goog.dom.createDom('input',
      { 'type': 'button', 'value': 'Save' }, '');
    menu.appendChild(saveBtn);
};
