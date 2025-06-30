import User from '../models/userSchema.js';

export const signUpUser = async (req, res, next) => {
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

export const fetchUser = async (req, res, next) => {
    try {
        const { id } = req.query;
        const found = await User.findById(id).select('-password');
        if (!found) return res.status(404).json({ message: 'User not found' });
            res.json(found);
    } catch (err) {
        next(err);
    }
};