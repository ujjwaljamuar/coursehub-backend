import mongoose, { Schema } from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter Title"],
        minLenth: [4, "Title must be atleast 4 characters"],
        minLenth: [80, "Title can't exceed 80 characters"],
    },

    description: {
        type: String,
        required: [true, "Please enter Description"],
        minLenth: [20, "Title must be atleast 20 characters"],
    },

    lectures: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            video: {
                public_id: {
                    type: String,
                    required: true,
                },

                url: {
                    type: String,
                    required: true,
                },
            },
        },
    ],

    poster: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    views: {
        type: Number,
        default: 0,
    },

    numOfVideos: {
        type: Number,
        default: 0,
    },

    category: {
        type: String,
        required: true,
    },

    createdBy: {
        type: String,
        required: [true, "Enter Creator's Name"],
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const CourseSchema = mongoose.model("Course", schema);
