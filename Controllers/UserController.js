import { catchAsyncError } from "../Middlewares/CatchAsyncError.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { UserSchema } from "../Models/UserModel.js";
import { sendToken } from "../Utils/SendToken.js";
import { sendEmail } from "../Utils/SendEmail.js";
import crypto from "crypto";
import { CourseSchema } from "../Models/CourseModel.js";

export const allUsers = catchAsyncError(async (req, res, next) => {
    const users = await UserSchema.find();

    res.status(200).json({
        message: true,
        users,
    });
});

export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    // const file = req.file;

    if (!name || !email || !password)
        return next(new ErrorHandler("Please fill up all fields !", 400));

    let user = await UserSchema.findOne({ email });

    if (user) return next(new ErrorHandler("User already Exists !", 409));

    //  Upload file on cloudinary

    user = await UserSchema.create({
        name,
        email,
        password,
        avatar: {
            public_id: "temp",
            url: "temp",
        },
    });

    sendToken(res, user, "Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // const file = req.file;

    if (!email || !password)
        return next(new ErrorHandler("Please fill up all fields !", 400));

    const user = await UserSchema.findOne({ email }).select("+password");

    if (!user)
        return next(new ErrorHandler("Incorrect Email or Password !", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Email or Password !", 401));

    sendToken(res, user, `Welcome, ${user.name}`, 201);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            // secure: true,
            sameSite: "none",
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
        });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await UserSchema.findById(req.user._id);
    res.status(200).json({
        user,
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("Please fill up all fields !", 400));

    const user = await UserSchema.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Old Password !", 400));

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully.",
    });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;

    const user = await UserSchema.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
    });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Profile Picture Updated Successfully.",
    });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    const user = await UserSchema.findOne({ email });

    if (!user) return next(new ErrorHandler("User Not Found !", 400));

    const resetToken = user.getResetToken();
    // send token via email

    await user.save();

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `Click on the link below to reset your password. ${url}. If not requested by you, Please ignore this Email.`;

    await sendEmail(user.email, "CourseBundler Reset Password", message);
    res.status(200).json({
        success: true,
        message: `Reset token has been sent to ${user.email}`,
    });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await UserSchema.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });

    if (!user) return next(new ErrorHandler("Token is invalid or expired !"));

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save();

    res.status(200).json({
        success: true,
        message: "Password changed.",
    });
});

export const addToPlaylist = catchAsyncError(async (req, res, next) => {
    const user = await UserSchema.findById(req.user._id);

    const course = await CourseSchema.findById(req.body.id);

    if (!course)
        return next(new ErrorHandler("Course not found or Invalid!", 404));

    const itemExist = user.playlist.find((item) => {
        if (item.course.toString() === course._id.toString()) return true;
    });

    if (itemExist) return next(new ErrorHandler("Item already exist", 409));

    user.playlist.push({
        course: course._id,
        poster: course.poster.url,
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: "Added to Playlist",
    });
});

export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
    const user = await UserSchema.findById(req.user._id);

    const course = await CourseSchema.findById(req.query.id);

    if (!course)
        return next(new ErrorHandler("Course not found or Invalid!", 404));

    const newPlaylist = await user.playlist.filter((item) => {
        if (item.course.toString() !== course._id.toString()) return item;
    });

    user.playlist = newPlaylist;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Removed from Playlist",
    });
});

export const getCourseLectures = catchAsyncError(async (req, res, next) => {
    const course = await CourseSchema.findById(req.params.id);

    if (!course) return next(new ErrorHandler("Course Not Found !", 404));

    course.views += 1;

    await course.save();

    res.status(200).json({
        success: true,
        lectures: course.lectures,
    });
});

export const addLecture = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { title, description } = req.body;
    // const file = req.file;

    const course = await CourseSchema.findById(id);

    if (!course) return next(new ErrorHandler("Course Not Found !", 404));

    // upload file here
    course.lectures.push({
        title,
        description,
        video: {
            public_id: "url",
            url: "temp",
        },
    });

    course.numOfVideos = course.lectures.length;

    await course.save();

    res.status(200).json({
        success: true,
        lectures: course.lectures,
    });
});
