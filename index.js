const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const e = require("express");

const app = express();
dotenv.config();

const port = process.env.PORT || 4000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.35xif.mongodb.net/registrationFormDB`);

// registration Schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Model of Registration Schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/index.html');
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Registration.findOne({email : email});

    // Checking for ExistingUser
    if (!existingUser){
      const registrationData = new Registration({
        name,
        email,
        password
      });
      await registrationData.save();
      res.redirect("/success");
  }
  else{
    console.log("user Alredy Exists");
    res.redirect("/error");
  }

    
   
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
