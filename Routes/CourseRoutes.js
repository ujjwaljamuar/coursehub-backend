import express from "express";
import {
    createCourse,
    getAllCourses,
} from "../Controllers/CourseController.js";
import singleUpload from "../Middlewares/Multer.js";
import {
    addLecture,
    getCourseLectures,
} from "../Controllers/UserController.js";

const router = express.Router();

// get all courses without lectures
router.route("/courses").get(getAllCourses);

// add new course admin only
router.route("/createcourse").post(singleUpload, createCourse);

router
    .route("/course/:id")
    .get(getCourseLectures)
    .post(singleUpload, addLecture);

export default router;
