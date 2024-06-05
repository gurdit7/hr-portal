import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    festival: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    }
    
  },
  { timestamps: true }
);

export default mongoose.models.Holidays ||
  mongoose.model("Holidays", userSchema);
