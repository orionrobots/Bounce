# Bounce

Bounce is a visual language using Google Blockly- somewhat like Scratch.
It is designed for the esp8266/NodeMCu using the LUA NodeMCU firmware.

The core of it is HTML5 in a windows C# wrapper.

See this video for an introduction to it:

https://www.youtube.com/watch?v=I6fKbf_1KuI

---
* Currently this requires windows + the DotNet runtime. TODO: Simplify requirements, distribute Mac/Linux versions.

* Release Downloads: Select the most recent Bounce.zip file from https://github.com/orionrobots/Bounce/releases
* Extract the zipfile.
* Run it with bin/x86/Debug/MainUi.exe  (TODO: Make a nice installer - reduce this complexity)

To use this with your esp8266/NodeMCU:

* First you will need to have a serial/USB driver to connect the esp to Windows (TODO: Installer to set this up with the app).
* Then use the NodeMCUFlasher software to put NodeMCU on your ESP8266 if it doesn't already have this.https://github.com/nodemcu/nodemcu-firmware
* Start up Bounce. The steps below this are also shown in the video.
* The ESP should be connected by this point. Click the "Find Nodes" button. 
* The right hand side is the serial console - showing interactions with nodes, it should list those it has tried, and their responses.
* The drop down above this allows you to select a serial port where a NodeMCU has been detected. Select yours here.
* Now click the connect button.
* You can now start code on the NodeMCU with the Run button.
