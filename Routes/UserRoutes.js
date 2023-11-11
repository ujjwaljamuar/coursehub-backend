import express from "express";
import {
    addLecture,
    addToPlaylist,
    allUsers,
    changePassword,
    forgetPassword,
    getCourseLectures,
    getMyProfile,
    login,
    logout,
    register,
    removeFromPlaylist,
    resetPassword,
    updateProfile,
    updateProfilePicture,
} from "../Controllers/UserController.js";
import { isAuthenticated } from "../Middlewares/Auth.js";

const router = express.Router();

router.route("/allusers").get(allUsers);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/changepassword").put(isAuthenticated, changePassword);

router.route("/updateprofile").put(isAuthenticated, updateProfile);

router
    .route("/updateprofilepicture")
    .put(isAuthenticated, updateProfilePicture);

router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword/:token").put(resetPassword);

router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);

router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);


export default router;
