require("dotenv").config();
const express = require("express");
const cors = require("cors");
// -- Import des packages necessaire pour utiliser Mailgun
const formData = require("form-data");
const Mailgun = require("mailgun.js");

// -- Utilisation de Mailgun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Gwen",
  key: process.env.MAILGUN_API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    console.log("Is working 🔥");
    res.status(200).json("Is working 🔥");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/form", async (req, res) => {
  try {
    // console.log(req.body);
    const { firstname, lastname, email, subject, message } = req.body;
    const messageData = {
      from: `${firstname}  ${lastname} ${email}`,
      to: "robin.socie@gmail.com",
      subject: subject,
      text: message,
    };
    // console.log(messageData);

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Cette route n'existe pas");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server started on port 💡 " + PORT);
});
