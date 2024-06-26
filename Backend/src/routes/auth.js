import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();
import { UserModel } from "../models/User.js";

router.post("/userRegister", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/userLogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) return res.status(404).json({ message: "Invalid Username" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid Password" });
    return res
      .status(200)
      .json({ userID: user._id, message: "Login Successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


export { router as userRouter };
