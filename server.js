require("dotenv").config();
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
// const path = require('path');

// MongoDB Connection
connectDB();

// Initialize App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// //Static files access
// app.use(express.static(path.join(--dirname, './client/build')))

// app.get('*', function(req,res){
//   res.sendFile(path.join(__dirname,"./client/build/index.html"));
// });

// Server Port
const PORT = process.env.PORT || 8080;

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server Running on port ${PORT}`.bgCyan.white);
});
