import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    options: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true,
    }],
}, {
    timestamps: true,
});

export default mongoose.model('Question', QuestionSchema);