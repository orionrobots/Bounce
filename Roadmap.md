Roadmap for Bounce

0.1.1 Upload to NodeMCU as a file.
0.1.1 As init.lua
0.2. Big red STOP button to stop all timers.
0.3. Linux port. Get basic run from tarball - likely scripted, so no installer.
0.4. Mac/OSX port. May be not a huge leap from linux - but usb driver has been troublesome.
0.5. Smaller build output - minify stuff, but keep custom blocks hackable.
0.6. First stage windows installer - put the files somewhere tidy and a start menu entry.
0.7. Second stage windows installer - prepare the .net libraries needed if they arent there.
0.8. Third stage - bundle the serial/usb driver install for common node mcu boards.
0.9. Export Lua code to file
1.0 Polish, bug fixes, CI to build/release all flavours, all visible blocks work.
* Try to turn Linux version into Ubuntu acceptable deb.
* Try to turn mac version into a mac package
* Windows should be a simple install wizard - MSI type thing, and standalone zip still supported for those unable to install new packages.

Blocks To add

0. Fully test/bugfix ws2812 block - may need a better name.
0.1 Test analog read block.
1. Esp12e motor board block.
1.1 Generic PWM output block.
2. Motor encoder/opto-interrupter block.
3. ON input pin state change event block.

Future (Speculative)

1. Discovery of esp8266 devices without NodeMCU software - with help on flashing it.
2. Ability to flash a recent NodeMCU firmware on it.
3. Plans for Wifi/Networking abilities.
4. Possible low power modes.
