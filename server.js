const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

try {
  mongoose.connect(process.env.DB, {
    tlsCAFile: "rds-combined-ca-bundle.pem",
    tls: true,
  });
  console.log("MongoDB Connected...");
} catch (err) {
  console.error(err.message);
  // Exit process with failure
  process.exit(1);
}

app.use(cors());
app.use(express.json({ extended: false }));

app.use("/api/thoughts", require("./routes/api/thoughts"));

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
