import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  { timestamps: true }
);


const PermissionSchema =  mongoose.model("permissions", permissionSchema);

export default PermissionSchema;