import mongoose from "mongoose";

const { Schema } = mongoose;
const DesignationSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
        type: String
      },
      prevName: {
        type: String
      }
  },
  { timestamps: true }
);

export default mongoose.models.Designation ||
  mongoose.model("Designation", DesignationSchema);
