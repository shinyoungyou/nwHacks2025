const express = require("express");
const app = express();
const port = 3050;

app.get("/", (req, res) => {
    console.log("index page");
    res.send("WElcome");
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
