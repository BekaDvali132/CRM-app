const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/api/clinics", require("./routes/clinicRoutes"));

app.listen(port, () => console.log(`server starter on port ${port}`));
