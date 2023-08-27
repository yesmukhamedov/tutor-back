import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Lesson', LessonSchema);