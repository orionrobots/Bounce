Archived: This repository is archived. Since Micropython and Arduino tools are mature for the ESP8266 I recommend using Blockly based tools like EduBlocks (for micropython) or Adrublockly and similar for the Arduino ecosystem.

[![Stories in Ready](https://badge.waffle.io/orionrobots/Bounce.png?label=ready&title=Ready)](https://waffle.io/orionrobots/Bounce)
# Bounce

[![Build status](https://ci.appveyor.com/api/projects/status/sba8kmdkd240njh6/branch/master?svg=true)](https://ci.appveyor.com/project/dannystaple/bounce/branch/master)

Bounce is a visual language using Google Blockly- somewhat like Scratch.
It is designed for the esp8266/NodeMCu using the LUA NodeMCU firmware.

Download the release zip file for your platform from <https://github.com/orionrobots/Bounce/releases>, unzip and you should be able to run it.

See this video for an introduction to it:

https://www.youtube.com/watch?v=I6fKbf_1KuI

![Screenshot of Bounce with Demo Code](/BounceScreenCapture.PNG)

To use this with your esp8266/NodeMCU:

* First you will need to have a serial/USB driver to connect the esp to Windows - connect the ESP8266 and windows should prompt for this.
* Then use the NodeMCUFlasher software to put NodeMCU on your ESP8266 if it doesn't already have this.https://github.com/nodemcu/nodemcu-firmware
* Start up Bounce.
* The ESP should be connected by this point. Click the "Find Nodes" button. 
* The right hand side is the serial console - showing interactions with nodes, it should list those it has tried, and their responses.
* The drop down above this allows you to select a serial port where a NodeMCU has been detected. Select yours here.
* Now click the connect button.
* You can now start code on the NodeMCU with the Run button.
