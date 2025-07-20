import express from 'express';
import tasks from '../models/taskSchema.js';

/** ###################################### Task EndPoints ###################################### **/

/** Create Task */
export const createTask    = async (req, res, next) => {
    try{
            const taskBody = req.body
            const { taskName } = req.body;
            if (!taskName) {
                return res.status(400).json({ message: " Invalid taskName." });
            }
            if (await tasks.findOne({ taskName  })) {
                return res.status(400).json({ message: "User already exists" });
            }
            const newTask = new tasks( taskBody );
            const savedTask = await newTask.save();

            const userResponse = savedTask.toObject()

            res.status(201).json({ message: "Task created successfully", user: userResponse });
    }catch (err) {
            next(err);
    }
}

/** Find Task */
export const findTask      = async (req, res, next) => {

    try{

        const { taskName, id } = req.query;
        const lookupField = taskName ? 'taskName' : id ? '_id' : null ;
        const lookUpValue = taskName ? taskName : id;

        if(!lookupField === '_id' && !mongoose.Types.objectId.isValid(lookUpValue)){
            return res.status.status(400).json({message: 'Invalid Id Format'});
        }

        const found = await tasks.findOne({[lookupField] : lookUpValue }).select('-description');
        if (!found) return res.status(404).json({ message: 'User not found' });
            res.json(found);

    }catch(error){
        next(error)
    }
}

/** Delete Task */
export const deleteTask    = async (req, res, next) => {
    try{
        const { taskName, id } = req.query;
        const lookupField = taskName ? 'taskName' : id ? '_id' : null ;
        const lookUpValue = taskName ? taskName : id;

        if(!lookupField === '_id' && !mongoose.Types.objectId.isValid(lookUpValue)){
            return res.status.status(400).json({message: 'Invalid Id Format'});
        }

        const found = await tasks.deleteOne({[lookupField] : lookUpValue }).select('-description');
        if (!found.deletedCount) return res.status(404).json({ message: 'Task not found' });
            res.json(found);

    }catch(error){
        next(error)
    }
}

/** Fetch All Tasks */
export const fetchAllTasks = async (req, res, next) =>  {
    try {
        const allTasks = await tasks.find({}); 
        if (!allTasks || allTasks.length === 0) { 
            return res.status(404).json({ message: 'No Tasks' });
        }
        return res.status(200).json(allTasks); 
    } catch (err) {
        next(err); 
    }
};