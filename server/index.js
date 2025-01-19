const express = require("express");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 3050;

app.get("/", (req, res) => {
    console.log("index page");
    res.send("WElcome");
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// First, list available ports to find your Arduino
SerialPort.list().then(ports => {
    ports.forEach(port => {
        console.log(`Found port: ${port.path}`);
    });
});

// Configure the serial port
// Note: You'll need to replace 'COM3' with your actual port name
// Common port names:
// Windows: 'COM3', 'COM4', etc.
// Mac/Linux: '/dev/ttyACM0', '/dev/ttyUSB0', etc.
const serialPort = new SerialPort({
    path: '/dev/tty.usbmodem1301',
    baudRate: 9600,
    autoOpen: false
});

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