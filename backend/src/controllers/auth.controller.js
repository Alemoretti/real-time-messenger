import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "User already exists" })
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()

      res.status(201).json({ 
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })

    } else {
      res.status(400).json({ message: "User could not be created" })
    }

  } catch (error) {
    console.log("Error in signup controller", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const login = (req, res) => {
  res.send("Login route")
}

export const logout = (req, res) => {
  res.send("Logout route")
}