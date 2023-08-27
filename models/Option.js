import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    truth: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Option', OptionSchema);