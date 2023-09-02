import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    queue: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }]
}, {
    timestamps: true,
});

export default mongoose.model('Menu', MenuSchema);