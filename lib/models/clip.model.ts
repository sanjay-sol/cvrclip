import mongoose from "mongoose";

const ClipSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    text: { type: String },
    url: { type: String },
    password: { type: String },

});

const Clip = mongoose.models.Clip || mongoose.model("Clip", ClipSchema);

// const Clip = mongoose.model("Clip", ClipSchema);

export default Clip;