Install Node + NPM on my windowss box.

* Get Node= NPM going - done.

* Create simple arduino tool.
    * Prompt "CMD>"
    * LED ON - Turn on the LED, Respond "LED is now ON"
    * LED OFF - Turn off the LED, respond "LED is now OFF"
    * SAY lksjjhgdfkljghd - "lkjhfslkjfhs"
    (Partially done - LED ON and LED OFF is enough. Forget the other bit.)
* Get the serial native extension to work - documenting how. 
    (NPM install works for plain node.)
    - Use an arduino with simple known 9600 code first - we can get more elaborate later. - this just works. Done.
* Start following this: http://electron.atom.io/docs/tutorial/quick-start/ - done
* Get a simple app to run.- done
* Try getting node serialport up to scratch like above again INSIDE an electron app.
* Get this to work on a VM runing linux.
* Get this to work on Carol's mac.
* Keep the results documented and source controlled.
* Try to use gulp/grunt tasks for the build processes - 
so it can be automated as much as possible.
* Get the windows AppVeyor demo version running.
* Get linux travis and osx travis working.
* Use this to reboot bounce.


## Setup:

First install node.js. Then microsoft npm build tools (https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#prerequisites)
In windows - launch powershell as admin. Type the following:

    npm install -g windows-build-tools

Now from the app root do these things:

    npm install --save-dev electron-rebuild
    npm install && npm start

The app should start
