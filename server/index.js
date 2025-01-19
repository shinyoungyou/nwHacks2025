const express = require("express");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
require("dotenv").config();

async function initSerialPort() {
    const allPorts = await SerialPort.list();
    let serialPort;
    for (const port of allPorts) {
        // Common port names:
        // Windows: 'COM3', 'COM4', etc.
        // Mac/Linux: '/dev/ttyACM0', '/dev/ttyUSB0', etc.
        if (port.path.includes("usbmodem")) {
            serialPort = new SerialPort({
                path: port.path,
                baudRate: 9600,
                autoOpen: false,
            });
        }
    }

    if (!serialPort) return null;

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

        const writeToDb = async () => {
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
        };
        
        if (data[0] !== ">") {
            await writeToDb();
        }
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

const app = express();
const port = 3050;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

initSerialPort().then(sp => {
    app.get("/logs", async (req, res) => {
        const token = process.env.INFLUXDB_TOKEN;
        const url = "http://localhost:8086";

        const client = new InfluxDB({ url, token });

        let org = `SSGD`;
        let bucket = `slouchii`;
        let queryClient = client.getQueryApi(org);

        let fluxQuery = `from(bucket: "${bucket}")
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

    app.post("/calibrate", async (req, res) => {
        // issue "calibration" command to arduino
        /*
        
        will aggregate query data from the last ~10s
        decide on recording threshold with everyone
        
        timeout for 10s?

        threshold calculation based on calibration
        */
        const token = process.env.INFLUXDB_TOKEN;
        const url = "http://localhost:8086";

        const client = new InfluxDB({ url, token });

        let org = `SSGD`;
        let bucket = `slouchii`;

        const recordingTime = (process.env.NODE_ENV === "dev") ? "-10d" : "-10d";

        let queryClient = client.getQueryApi(org);
        let fluxQuery = `from(bucket: "${bucket}")
        |> range(start: ${recordingTime}) 
        |> filter(fn: (r) => r["_measurement"] == "testing")
        |> mean()`;

        const mean = await new Promise((resolve, reject) => {
            let result = {};
            queryClient.queryRows(fluxQuery, {
                next: (row, tableMeta) => {
                    const obj = tableMeta.toObject(row);
                    result[obj._field] = obj._value;
                },
                error: reject,
                complete: () => {
                    resolve(result);
                },
            });
        });
        console.log("mean", mean);

        if (sp) {
            sp.write(`${mean.x}|${mean.y}|${mean.z}\n`, "ascii");
            sp.drain();
        }
        res.json({ calibration: mean });
    });

    app.post("/settings", async (req, res) => {
        const toggledOn = req.query["buzzer_on"];
        
        if (toggledOn !== "1" || toggledOn !== "0") {
            res.status(400);
            res.json({ "error": "query param must be binary" });
        } else {
            if (sp) {
                sp.write(`B|${toggledOn}`, "ascii");
                sp.drain();
            }
    
            res.send();
        }
    });
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
