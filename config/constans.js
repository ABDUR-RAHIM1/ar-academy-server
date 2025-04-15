import dotenv from "dotenv"
dotenv.config()

export const secretKey = "abdur17rahim@2024"
export const adminSecretKey = "abdur17rahim@2024admin"

export const port = process.env.PORT || 5000;
export const mongoUrl = process.env.MONGO_URL
