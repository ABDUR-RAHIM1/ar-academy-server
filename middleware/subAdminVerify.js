import jwt from "jsonwebtoken";
import { secretKey } from "../config/constans.js";

export const subAdminVerify = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;


        // header নেই
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "লগইন করুন, অনুমতি নেই।" });
        }

        const token = authHeader.split(" ")[1];
     
        // token missing
        if (!token) {
            return res.status(401).json({ message: "লগইন করুন, টোকেন নেই।" });
        }

        // token verify
        const decoded = jwt.verify(token, secretKey);
        req.subAdmin = decoded;
        next();

    } catch (error) {
        console.error("Token verification failed:", error.message);

        // token invalid বা expired হলে
        return res.status(401).json({ message: "টোকেন অবৈধ বা মেয়াদ শেষ, লগইন করুন।" });
    }
};

