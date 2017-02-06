To use this as a developer:
* Clone it from git.
* npm install && npm run
---
Where you can, please stick to https://google.github.io/styleguide/javascriptguide.xml and https://google.github.io/styleguide/htmlcssguide.xml.

Test using the Jasmine test specs - yes there are gaps.
---
UI modifications

This uses jQuery and Bootsrap for it's UI. Note that most parts are expected to be Asynchronous.
---
Quick Overview of App components:
* main.js - electron starting part - sets up a window and hands off to index.html.
* index.html - main page and startup code.
* BounceMenu.js - Generate the menu system in the menu bar.
* lib/board.js - Base class for all board types.
* lib/NodeMCU8266.js - NodeMCU interaction class - expects Lua and Serial.
* BlocklyManager - This manages the blockly workspace - some of the operations performed on it.
* CustomNodeBlocks - Additional blocks specific to the Bounce/NodeMCU system.

Old components - to be ported:

* BounceConfig - Manage/update and store user config preferences - mostly related to serial.
* GeneratedCode - Manages the generated code tab
* OutputConsole - Component for the output tab showing serial output and allowing a user input.
