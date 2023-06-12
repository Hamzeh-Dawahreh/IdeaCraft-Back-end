const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 3500;
app.use(cors());
app.use(express.json());
const connectionURL =
  "mongodb+srv://hmzhdawahreh:admin@cluster0.judqrme.mongodb.net/";
// Connect to the MongoDB database using Mongoose
mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.use("/register", require("./routes/register"));
app.use("/authentication", require("./routes/auth"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
