const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const SerialPort = require("serialport");

let win;

var port = new SerialPort.SerialPort("COM4", {
  parser: SerialPort.parsers.readline('>')
});

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  port.on('data', function (data) {
      console.log('Data: ' + data + '>');
      if(data.indexOf("Experiment ready") > -1 || data.indexOf('is now OFF') > -1) {
          // console.log("Sending LED on...\n");
          port.write("LED ON\n", function(err) {
              // console.log("LED should be on\n");
          });
      }
      // if(data.indexOf('LED is now ON') > -1) {
      //     // console.log("Sending LED off...\n");
      //     port.write("LED OFF\n", function(err) {
      //         // console.log("LED should be OFF\n");
      //     });
      // }
  });

  port.on('error', function(err) {
    console.log('Error: ', err.message);
  });  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
