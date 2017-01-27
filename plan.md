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
* Try getting node serialport up to scratch like above again INSIDE an electron app. - done
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

Now from the app root do these things (https://github.com/EmergingTechnologyAdvisors/node-serialport#electron):

    npm install --save-dev electron-rebuild
    npm install && npm start

The app should start

## Packaging

* Try and package up
* Start with App creation - http://electron.atom.io/docs/tutorial/application-distribution/
* Then move on to the "ASAR" thingie - get it to run on my surface.

## App creation

* Downloaded the electron zip.
* Copy my main.js, package.json, index.html and node-modules files right in there. (may be able to strip it back again later...)
OUCH - destination too long.
* Retry further up - a path closer to the root. It may yet mean using a tool to flatten that tree.
* ARG - Dialog stole focus - as I was typing. what did it do?
* I double clicked and it ran. I've zipped up the folder - the zip is 115Mb. Some trimming/optimizing to do. Lets transfer it. - done
* Try NPM prune in my source dir. - does that still run? Yes.

* Try running my transferred file on the surface (serial port may need to change) - other than the serial port needing changing - that worked!

* Try going to my "out" folder and running "npm prune --production". Saved 2mb - 
* Ok - out3 - try a "dedupe". Another -2mb - this is 111mb. Not quite worth it. 
* How big is VSCode? 34Mb.... Hmmm.
* Can I remove the electron bits from the node-modules dir in that out3 to make out4? Yes - it still lives. Zip it up. 60.42Mb - HALVED IT!

* NExt step automating this - the main concern here is that path length - tomorrow - try and do that path length unlimit, or work closer to root.
