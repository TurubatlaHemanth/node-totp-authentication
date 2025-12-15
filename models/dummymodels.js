import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,   // Using Number since your example had _id: 1
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Create model
const Item = mongoose.model("Item", itemSchema,"dummydata");

// ✅ Export as default (ESM style)
export default Item;