import { catchAsyncError } from "../Middlewares/CatchAsyncError.js";
import { CourseSchema } from "../Models/CourseModel.js";
import getDataUri from "../Utils/DataUri.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import cloudinary from "cloudinary";

export const getAllCourses = catchAsyncError(async (req, res, next) => {
    const courses = await CourseSchema.find().select("-lectures"); // for subscription purpose

    res.status(200).json({
        success: true,
        courses,
    });
});

export const createCourse = catchAsyncError(async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    if (!title || !description || !category || !createdBy)
        return next(new ErrorHandler("Please fill up all fields", 400));

    await CourseSchema.create({
        title,
        description,
        category,
        createdBy,
        poster: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "Course created SUCCESSFULLY. You can add lectures now.",
    });
});
