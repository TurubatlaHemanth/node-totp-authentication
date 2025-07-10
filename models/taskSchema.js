import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskName:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const tasks = mongoose.model('tasks', taskSchema);
export default tasks;