import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) return res.status(401).json({ message: "Not authorized, token missing" })

      const decoded = jwt.verify(token, process.env.JWT_TOKEN)

    if (!decoded) return res.status(401).json({ message: "Not authorized, token failed" })

      const user = await User.findById(decoded.userId).select("-password")

    if (!user) return res.status(404).json({ message: "User not found" })
  
    req.user = user
    next()
    } catch (error) {
    console.log("Error in protectRoute middleware", error.message)
    res.status(401).json({ message: "Internal Server Error"})
  }
}