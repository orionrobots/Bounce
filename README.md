[![Stories in Ready](https://badge.waffle.io/orionrobots/Bounce.png?label=ready&title=Ready)](https://waffle.io/orionrobots/Bounce)
# Bounce

Bounce is a visual language using Google Blockly- somewhat like Scratch.
It is designed for the esp8266/NodeMCu using the LUA NodeMCU firmware.

The system is currently a chrome app - you can download it at https://github.com/orionrobots/Bounce/releases/tag/r0.1.1, download then install the CRX using the instructions there.

See this video for an introduction to it:

https://www.youtube.com/watch?v=I6fKbf_1KuI

![Screenshot of Bounce with Demo Code](/BounceScreenCapture.PNG)

To use this with your esp8266/NodeMCU:

* First you will need to have a serial/USB driver to connect the esp to Windows - connect the ESP8266 and windows should prompt for this.
* Then use the NodeMCUFlasher software to put NodeMCU on your ESP8266 if it doesn't already have this.https://github.com/nodemcu/nodemcu-firmware
* Start up Bounce - by going to "Apps" -> "Bounce!" in Chrome.
* The ESP should be connected by this point. Click the "Find Nodes" button. 
* The right hand side is the serial console - showing interactions with nodes, it should list those it has tried, and their responses.
* The drop down above this allows you to select a serial port where a NodeMCU has been detected. Select yours here.
* Now click the connect button.
* You can now start code on the NodeMCU with the Run button.
