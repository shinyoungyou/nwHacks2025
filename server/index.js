const express = require("express");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { InfluxDB, Point } = require("@influxdata/influxdb-client");

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
    parser.on('data', async (data) => {
        console.log('Received data:', data);
        
        const token = process.env.INFLUXDB_TOKEN;
        const url = "http://localhost:8086";

        const client = new InfluxDB({ url, token });

        let org = `SSGD`;
        let bucket = `slouchii`;

        let queryClient = client.getWriteApi(org, bucket);

        const coords = data.split("|").map(c => Number(c));
        const dataPoint = new Point("testing")
            .tag("version", "v0")
            .floatField("x", coords[0])
            .floatField("y", coords[1])
            .floatField("z", coords[2]);

        queryClient.writePoint(dataPoint);
        await queryClient.flush();
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

initSerialPort().then(sp => {
    app.get("/", (req, res) => {
        console.log("index page");
        res.send("WElcome");
    });
    
    app.get("/logs", async (req, res) => {
        // res.send(`you requested:\n - ${req.query["num_logs"]} log entries!`);

        const token = process.env.INFLUXDB_TOKEN;
        const url = "http://localhost:8086";

        const client = new InfluxDB({ url, token });

        let org = `SSGD`;
        let bucket = `slouchii`;

        let queryClient = client.getQueryApi(org);

        let fluxQuery = `from(bucket: "slouchii")
        |> range(start: -30d) 
        |> filter(fn: (r) => r["_measurement"] == "testing")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: ${req.query["num_logs"]})`;

        const rows = await new Promise((resolve, reject) => {
            let result = {};
            queryClient.queryRows(fluxQuery, {
                next: (row, tableMeta) => {
                    const obj = tableMeta.toObject(row);
                    if (!(obj._time in result)) {
                        result[obj._time] = {};
                    }
                    result[obj._time][obj._field] = obj._value;
                },
                error: reject,
                complete: () => {
                    console.log(result);
                    resolve(result);
                },
            });
        });
        
        res.json(rows);
    });

    app.post("/calibrate", (req, res) => {
        // issue "calibration" command to arduino
        /*
        
        will aggregate query data from the last ~10s
        decide on recording threshold with everyone
        
        
        */
        res.send("ya");
    })
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})

