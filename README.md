# Bounce

Bounce is a visual language using Google Blockly- somewhat like Scratch.
It is designed for the esp8266/NodeMCu using the LUA NodeMCU firmware.

The core of it is HTML5 in a windows C# wrapper.

See this video for an introduction to it:

https://www.youtube.com/watch?v=I6fKbf_1KuI

![Screenshot of Bounce with Demo Code](/BounceScreenCapture.PNG)
---

This is the Chrome App Branch.
To run this:
* Clone it from git.
* Under the Bounce subdirectory, clone the closure-library from https://github.com/google/closure-library.
* Download the closure-builder.jar - extract under compiler-latest.

* You can now either use bounce_window_debug.html in a browser when modifying blockly and UI only.
* To actually use with serial you need the following:

* Run the build.bat/build.sh script

You will need to load this in chrome as a developer extension. Later the intent is to make a self contained app for that.

Launch the app this way: 
https://developer.chrome.com/apps/first_app#five - pointing it at the Bounce directory.


To use this with your esp8266/NodeMCU:

* First you will need to have a serial/USB driver to connect the esp to Windows (TODO: Installer to set this up with the app).
* Then use the NodeMCUFlasher software to put NodeMCU on your ESP8266 if it doesn't already have this.https://github.com/nodemcu/nodemcu-firmware
* Start up Bounce. The steps below this are also shown in the video.
* The ESP should be connected by this point. Click the "Find Nodes" button. 
* The right hand side is the serial console - showing interactions with nodes, it should list those it has tried, and their responses.
* The drop down above this allows you to select a serial port where a NodeMCU has been detected. Select yours here.
* Now click the connect button.
* You can now start code on the NodeMCU with the Run button.
---

Building - node

https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md

With visual studio installed - use the visual studio command line.
  
