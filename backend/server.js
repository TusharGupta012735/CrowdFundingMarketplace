const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const donationRoutes = require("./routes/donationRoutes");

app=express();
app.use(express.json());
dotenv.config();
app.use(cors());

app.use("/api", donationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});