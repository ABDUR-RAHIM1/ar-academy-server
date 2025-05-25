
import jwt from "jsonwebtoken";
import { secretKey } from "../config/constans.js";

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded; // user info set করে দিচ্ছি
        } catch (err) {
            req.user = null; // invalid token হলে user থাকবে না
        }
    } else {
        req.user = null; // token ই না থাকলে
    }

    next();
};
