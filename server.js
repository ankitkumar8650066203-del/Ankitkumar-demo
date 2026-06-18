require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scamRoutes = require("./routes/scamRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const imageRoutes = require("./routes/imageRoutes");
const imageScanRoutes = require("./routes/imageScanRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const jobRoutes = require("./routes/jobRoutes");
const reportRoutes = require("./routes/reportRoutes");
const resumeMatchRoutes = require("./routes/resumeMatchRoutes");
const atsRoutes = require("./routes/atsRoutes"); // ✅ correct
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/scam", scamRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/image", imageScanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resume", resumeMatchRoutes);
app.use("/api/ats", atsRoutes); // ✅ ATS route

// test route
app.get("/", (req, res) => {
  res.send("Job Scam Detector API Running");
});

// DB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// server start
app.listen(process.env.PORT, () => {
  console.log(`Server Running On Port ${process.env.PORT}`);
});