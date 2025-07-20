import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: String,
});

const permissions = mongoose.model("permissions", permissionSchema);
export default permissions;
