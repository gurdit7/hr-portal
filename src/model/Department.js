import mongoose from "mongoose";

const { Schema } = mongoose;
const departmentSchema = new Schema(
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

export default mongoose.models.Departments ||
  mongoose.model("Departments", departmentSchema);
