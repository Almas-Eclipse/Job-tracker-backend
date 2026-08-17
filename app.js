const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();


const app = express();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/job-tracker";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API is running!" });
});


const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");

app.use("/auth", authRoutes);
app.use("/api/jobs", jobRoutes);


app.use((err, req, res, next) => {
  console.error("ERROR →", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});


const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));