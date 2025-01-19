const express = require("express");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// First, list available ports to find your Arduino
// SerialPort.list().then(ports => {
//     ports.forEach(port => {
//         console.log(`Found port: ${port.path}`);
//         if (port.path.includes("usbmodem")) {
//             serialPort = new SerialPort({
//                 path: port.path,
//                 baudRate: 9600,
//                 autoOpen: false,
//             });
//         }
//     });
// });

async function initSerialPort() {
    const allPorts = await SerialPort.list();
    let serialPort;
    for (const port of allPorts) {
        if (port.path.includes("usbmodem")) {
            serialPort = new SerialPort({
                path: port.path,
                baudRate: 9600,
                autoOpen: false,
            });
        }
    }

    // Create a parser to read lines
    const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    // Handle port opening
    serialPort.open((err) => {
        if (err) {
            return console.error('Error opening port:', err.message);
        }
        console.log('Serial port opened successfully!');
    });

    // Handle incoming data
    // push data to influxDB
    // circular buffer of data
    // when buffer is full, push to DB (batching to reduce DB writes)
    // then we restart from beginning of buffer
    parser.on('data', (data) => {
        console.log('Received data:', data);
        // Here you can process the data as needed
        // For example, parse JSON, convert to numbers, etc.
    });

    // Handle errors
    serialPort.on('error', (err) => {
        console.error('Serial port error:', err.message);
    });

    // Clean up on application exit
    process.on('SIGINT', () => {
        console.log('Closing serial port...');
        serialPort.close(() => {
            console.log('Serial port closed');
            process.exit();
        });
    });

    return serialPort;
}

// Configure the serial port
// Note: You'll need to replace 'COM3' with your actual port name
// Common port names:
// Windows: 'COM3', 'COM4', etc.
// Mac/Linux: '/dev/ttyACM0', '/dev/ttyUSB0', etc.
// const serialPort = new SerialPort({
//     path: '/dev/tty.usbmodem1301',
//     baudRate: 9600,
//     autoOpen: false
// });

const app = express();
const port = 3050;

initSerialPort.then(sp => {
    app.get("/", (req, res) => {
        console.log("index page");
        res.send("WElcome");
    });
    
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})

