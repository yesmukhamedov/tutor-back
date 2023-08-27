import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    queue: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    value: {
        type: URL,
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