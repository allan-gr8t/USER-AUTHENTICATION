const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

//Getting all users
app.get("/users", (req, res) => {
  res.json(users);
});

//creating users,bcrypt takes care of the salt
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send("user created");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => (user.name = req.body.name));
  if (user == null) {
    res.send("user not found");
    try {
      if (bcrypt.compare(req.body.password, user.password)) {
        res.send("Success!");
      } else {
        res.send("Not allowed!");
      }
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
});

app.listen(3000);
