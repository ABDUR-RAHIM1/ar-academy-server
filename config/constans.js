import dotenv from "dotenv"
dotenv.config();


export const roles = {
    admin: "superAdmin",
    subAdmin: "subAdmin",
    user: "student"
}

export const secretKey = process.env.JWT_SECRET
export const adminSecretKey = process.env.ADMIN_SECRET_KEY

export const port = process.env.PORT || 6000;
export const mongoUrl = process.env.MONGO_URL

export const emailUser = process.env.EMAIL_USER
export const emailPass = process.env.EMAIL_PASS
export const jwtEmailSecret = process.env.JWT_EMAIL_SECRET

export const clientUrl = process.env.CLIENT_URL
export const backendUrl = process.env.BACKEND_URL