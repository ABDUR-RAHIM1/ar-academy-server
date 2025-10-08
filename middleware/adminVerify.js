import jwt, { decode } from "jsonwebtoken";
import { secretKey } from "../config/constans.js";

export const adminVerify = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized! No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secretKey);

        
        const allowedRoles = ["superAdmin", "moderator"];
        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ message: "Access denied! Admins only." });
        };


        req.admin = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(403).json({ message: "Forbidden! Invalid token" });
    }
};
