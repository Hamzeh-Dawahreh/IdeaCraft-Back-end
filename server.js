const express = require("express");
const app = express();
const mongoose = require("mongoose");
const user = require("./model/user");
const cors = require("cors");
const { jwtGenerator } = require("./utilities/JWTgenerator");
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

app.post("/register", (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  // Create a new Mongoose model for the user
  const newUser = new user({
    firstname,
    lastname,
    username,
    email,
    password,
  });

  // Save the user to the database
  newUser
    .save()
    .then(() => {
      const token = jwtGenerator(newUser);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error registering user");
    });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
