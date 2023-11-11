import express from "express";
import { config } from "dotenv";
import courseRoute from "./Routes/CourseRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import ErrorMiddleware from "./Middlewares/Error.js";
import cookieParser from "cookie-parser";

config({
    path: "./Config/config.env",
});

const app = express();

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server is running perfectly🔥🔥🔥");
});

// using routes

app.use("/api/v1", courseRoute);
app.use("/api/v1", UserRoutes);

export default app;

app.use(ErrorMiddleware);
