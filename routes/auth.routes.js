const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/auth.middleware");


router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    
    res.status(201).json({
      message: "User created successfully",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});


router.get("/verify", isAuthenticated, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});

module.exports = router;