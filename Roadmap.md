# Roadmap for Bounce

* 0.1.1 Upload to NodeMCU As init.lua
* 0.1.2 Upload to NodeMCU as a file. Needs DoFile and NodeMCU FileBrowser tool. - done
* 0.2. Big red STOP button to stop all timers. - done
* 0.2.1 - Add temp sensor blocks
* 0.3. Third stage - bundle the serial/usb driver install for common node mcu boards.
* 0.7. Export Lua code to file
* 1.0 Polish, bug fixes, CI to build/release, all visible blocks work.  

# Blocks To add

1. Fully test/bugfix ws2812 block - may need a better name.
2 Test analog read block.
3. Esp12e motor board block.
4. Generic PWM output block.
5. Motor encoder/opto-interrupter block.
6. ON input pin state change event block.

# Future (Speculative)

1. Discovery of esp8266 devices without NodeMCU software - with help on flashing it.
2. Ability to flash a recent NodeMCU firmware on it.
3. Plans for Wifi/Networking abilities.
4. Possible low power modes.
