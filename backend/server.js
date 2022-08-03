const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const { getMe, updateMe } = require("./controllers/userController");
const { protect } = require("./middleware/authMiddleware");
const cors = require("cors");
const path = require("path");
const compression = require('compression')

connectDB();

const corsOption = {
  origin: "http://localhost:3000",
};

const app = express();

app.use(compression())

if (process.env.NODE_ENV !== 'production') {
    app.use(cors(corsOption));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/resources", express.static(path.join(__dirname, "./resources")));
app.use(`/resources`, express.static("resources"));
app.use("/api/clinics", require("./routes/clinicRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.route("/api/user/me").get(protect, getMe).put(protect, updateMe)

// Serve frontend

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => {
    res.send("not production");
  });
}

app.listen(port, () => console.log(`server starter on port ${port}`));
