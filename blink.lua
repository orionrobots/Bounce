gpio.mode(1, gpio.OUTPUT)
led_state = true
tmr.alarm(0,100, 1, function()
  gpio.write(1, led_state and 1 or 0)
  led_state = not led_state

end )
