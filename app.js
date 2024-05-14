import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import RazorPay from "razorpay";

config({
    path: "./config/config.env",
});
const app = express();

export const instance = new RazorPay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

// Using Middlewares

// using headers for cache control
app.use((req, res, next) => {
    res.setHeader(
        "Cache-Control",
        "no-cache, no-store, max-age=0, must-revalidate"
    );
    next();
});
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "50mb",
    })
);

app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// Importing & Using Routes
import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";
import payment from "./routes/paymentRoutes.js";
import other from "./routes/otherRoutes.js";

app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);

app.get("/", (req, res) =>
    res.send(
        `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
    )
);

app.use(ErrorMiddleware);

export default app;
