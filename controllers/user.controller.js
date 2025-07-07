import { mongoose } from 'mongoose';
import User from '../models/userSchema.js';

export const signUpUser   =  async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
            if (!userName || !email || !password) {
                return res.status(400).json({ message: "Username, email and password are required" });
            }

            if (await User.findOne({ email })) {
                return res.status(400).json({ message: "User already exists" });
            }

            const newUser = new User({ userName, email, password });
            const savedUser = await newUser.save();

            const userResponse = savedUser.toObject();
            delete userResponse.password;

            res.status(201).json({
                message: "User created successfully",
                user: userResponse
            });
    } catch (err) {
            next(err);
  }
};

export const fetchUser    =  async (req, res, next) => {
    try {
        
        const { email, id } = req.query;
        const lookupField = email ? 'email' : id ? '_id' : null ;
        const lookUpValue = email ? email : id;

        if(!lookupField === '_id' && !mongoose.Types.objectId.isValid(lookUpValue)){
            return res.status.status(400).json({message: 'Invalid Id Format'});
        }

        const found = await User.findOne({[lookupField] : lookUpValue }).select('-password');
        if (!found) return res.status(404).json({ message: 'User not found' });
            res.json(found);
    } catch (err) {
        next(err);
    }
};

export const deleteUser   =  async (req, res, next) => {

        try {
        
            const { email, id } = req.query;
            const lookupField = email ? 'email' : id ? '_id' : null ;
            const lookUpValue = email ? email : id;

            if(!lookupField === '_id' && !mongoose.Types.objectId.isValid(lookUpValue)){
                return res.status.status(400).json({message: 'Invalid Id Format'});
            }

        const found = await User.deleteOne({[lookupField] : lookUpValue }).select('-password');
        if (!found) return res.status(404).json({ message: 'User not found' });
            res.json(found);

        } catch (err) {
            next(err);
        }

};

export const updateUser   =  async (req, res, next) => {
  try {
        const { id, email } = req.query;
        const { ...updates } = req.body;
        const lookup = id ? { _id: id } : email ? { email } : null;

         if (!lookup) {
            return res.status(400).json({ message: 'Provide either id or email.' });
        }
        if (lookup._id && !mongoose.Types.ObjectId.isValid(lookup._id)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }

        const updated = await User.findOneAndUpdate(
            lookup,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }
            return res.json(updated);
        } catch (err) {
            next(err);
        }
};

export const fetchAllUser = async (req, res, next) => {
    try {
        const allUsers = await User.find({}).select('-password'); 
        if (!allUsers || allUsers.length === 0) { 
            return res.status(404).json({ message: 'No Users' });
        }
        return res.status(200).json(allUsers); 
    } catch (err) {
        next(err); 
    }
};