const express = require("express");
const app = express();
const port = 3050;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/", (req, res) => {
    console.log("index page");
    res.send("WElcome");
});
app.get("/logs", (req, res) => {
    console.log(req.query);
    res.json("asdf");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
