const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const app = express();

const port = config.get("port") || 5000;

try {
  mongoose.connect(config.get("db"), {
    useNewUrlParser: true,
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

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
