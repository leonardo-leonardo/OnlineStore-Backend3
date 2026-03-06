import { connectDB } from "../lib/db.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectDB();
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed: " + err.message });
  }
}
