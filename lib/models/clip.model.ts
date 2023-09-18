import { timeStamp } from "console";
import mongoose from "mongoose";



const ClipSchema2 = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    text:
    {
        type: String
    },
    url: {
        type: String
    },
    password: {
        type: String
    },
    expirationTime: {
        type: Number, // Store expiration time as a date
      },
    //   viewed: {
    //     type: Boolean,
    //     default: false,
    //   },
},{
    timestamps: true
}
);

const Clip2 = mongoose.models.Clip2 || mongoose.model("Clip2", ClipSchema2);

export default Clip2;