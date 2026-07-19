require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
const redirectRoutes = require("./routes/redirectRoutes");
const app = express();
connectDB();
app.use(express.json());
app.use(express.static("public"));
app.use("/api", urlRoutes);
app.use("/", redirectRoutes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("🚀 URL Shortener Server is Running!");
});

app.get("/about", (req, res) => {
    res.send("About Page");
});

app.get("/contact", (req, res) => {
    res.send("Contact Page");
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});