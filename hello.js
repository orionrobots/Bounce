var SerialPort = require("serialport");

var port = new SerialPort("COM4", {
  parser: SerialPort.parsers.readline('>')
});

// port.on("open", function() {
    
// })

// open errors will be emitted as an error event 
port.on('error', function(err) {
  console.log('Error: ', err.message);
});

port.on('data', function (data) {
    console.log('Data: ' + data + '>');
    if(data.indexOf("Experiment ready") > -1 || data.indexOf('is now OFF') > -1) {
        // console.log("Sending LED on...\n");
        port.write("LED ON\n", function(err) {
            // console.log("LED should be on\n");
        });
    }
    if(data.indexOf('LED is now ON') > -1) {
        // console.log("Sending LED off...\n");
        port.write("LED OFF\n", function(err) {
            // console.log("LED should be OFF\n");
        });
    }
});
