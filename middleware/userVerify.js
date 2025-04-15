import jwt from "jsonwebtoken";
import { secretKey } from "../config/constans.js";

export const userVerify = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized! No token provided" });
        }

        const token = authHeader.split(" ")[1];
        
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(403).json({ message: "Forbidden! Invalid token" });
    }
};
