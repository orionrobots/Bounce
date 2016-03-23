First some simple requirements:

* It needs to work on windows since the teaching groups I have intended for only have access to this.
* It needs to have support for the serial port-  the Node is connected via serial (USB). For now - flashing a telnet/wifi repl is outside scope.

The main UI design has 4 components:

* A menu bar - with file operations and the hidden debug menu (hint - it's just browser dev tools)
* A toolbar - for operations like uploading/running code and finding the boards.
* The coding pane - where blockly/lua/bounce actually runs.
* The output pane - where console output from the Node, and other messages for the user are shown.

The menu bar could be folded into the toolbar - since that has drop down items too.
The UI parts could all be put into a single HTML5 app, with the UI rendered there. This may need more clojure familiarity (resisting the pull to use bootstrap js - easy, but being aware of too many dependancies and potential interactions).

The single html5 app then just needs some back end for the serial and maybe file operations.  This will make ports for different OS backends far simpler. Inverting the embedded CEF (chrome embedded framework) into a service stub that spawns a browser tab back at it may work - but that port operation (listen) may be blocked in education environments.

Pull reqests unifying more of the interface into the web app (and still working) will be gladly accepted.

This might be the right direction:
https://developer.chrome.com/apps/serial

Creating a chrome extension/app is cross platform, may be mostly html5/js. Time for an experimental branch.
