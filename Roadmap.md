# Roadmap For Bounce

## 0.6

* Fix new button not prompting - done
* Make blocks lists default to open - the top two. - done
* Fill the black blocks in or remove them. - done
* PWM LED Block. - done
  * PWM init - pin

    pwm.setup(pin, clock, duty) 
    clock - pwm frequency
    duty - duty cycle max 1023.
    pwm.start()

  * PWM Set value (0-1023?)

  * PWM stop
    pwm.stop()

* Servo blocks
  * Servo init - pin
  * Servo set angle -
  * servo detach
* Fix or hide the Ws2812 lights blocks. (hidden for now)
    
* Fix comments not regenerating

## 0.7

* File Browser tab
  * List, upload, delete, go (switching to main tab)
* Traffic lights example
* Tutorial Backgrounds in examples.
* Help link to Github.

# Linux

Show linux help - you need to add your user to the Dialout group or run as root.

# Blocks To add

* Test analog read block.
* Generic PWM output block.
* Motor encoder/opto-interrupter block.
* ON input pin state change event block. Trigger on input.
* Servo motor block.
* Esp12e/H-Bridge motor board block.

# Future (Speculative)

1. Discovery of esp8266 devices without NodeMCU software - with help on flashing it.
2. Ability to flash a recent NodeMCU firmware on it.
3. Plans for Wifi/Networking abilities.
  * Uploading code via WiFi 
  * Set up wifi event handlers - probably sticking to a simple http + named trigger, perhaps JSON. 
  * Send a variable (set of variables) via JSON and HTTP to a URL.
  * A block for setting up a Lua Table (as dict), and for setting/getting members.
4. Possible low power modes.
