import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
    permissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }
  ],
  description:{
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);
export default Role;