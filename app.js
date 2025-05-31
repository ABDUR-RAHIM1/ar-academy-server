
import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';

import accountRouter from "./routes/account/account.route.js";
import categorieRouter from "./routes/categories/categorie.route.js";
import subCategorieRouter from "./routes/sub-categories/sub-categories.route.js";
import chapterRouter from "./routes/chapters/chapters.route.js";
import questionsRouter from "./routes/questions/questions.route.js";
import resultsRouter from "./routes/results/results.route.js";
import commentRouter from "./routes/comments/comments.route.js";
import purchaseRouter from "./routes/purchasePlan/purchasePlan.js";
import utilsRouter from "./routes/utils/utils.route.js";
import planRouter from "./routes/plan/plan.route.js";

export const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config()

// Create rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 15 মিনিটে প্রতি IP তে 100 টি request allowed
    message: "Too many requests, please try again later.",
});

// Apply rate limiter to all requests
app.use(limiter);
app.use(cookieParser());


app.use("/api/account", accountRouter)

app.use("/api/categories", categorieRouter)
app.use("/api/sub-categories", subCategorieRouter)
app.use("/api/chapters", chapterRouter)
app.use("/api/questions", questionsRouter)
app.use("/api/results", resultsRouter)
app.use("/api/comment", commentRouter)
app.use("/api/plan", planRouter)
app.use("/api/purchase", purchaseRouter)


app.use("/api/utils", utilsRouter)

app.get('/', (req, res) => {
    res.send('Welcome to the AR AcademyBD API!');
});

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        error: true,
        message: "The requested route does not exist on the server.",
    });
});