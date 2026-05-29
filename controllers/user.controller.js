import { mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import { authenticator } from "otplib";
import qrCode from "qrcode";
import jwt from 'jsonwebtoken';

/** ###################################### User EndPoints ###################################### **/

/** SignUp User */
import { sendMail } from '../utils/mailer.js';

export const signUpUser = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    if (password.length < 6 || password.length > 15) {
      return res.status(400).json({ message: 'Password must be between 6–15 characters.' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      isTotpEnabled: false,
      isActive: false,
    });

    await newUser.save();

    // Send welcome email (fire-and-forget)
    sendMail({
      to: email,
      subject: 'Welcome to Our App!',
      html: `<h1>Hi ${userName},</h1><p>Thanks for signing up. We're glad to have you!</p>`,
    }).catch((err) => console.error('Failed to send welcome email:', err));

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
};


/** Login User */
export const loginUser   = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    if(!user.isTotpEnabled){
      const secret = authenticator.generateSecret();
      user.totpSecret = secret;
      user.save();
      
      const otpauthUrl = authenticator.keyuri(email, "RBACAuth", secret);
      const qrCodeDataUrl = await qrCode.toDataURL(otpauthUrl);

      return res.status(200).json({message:"Created user successfully ",qrImage:qrCodeDataUrl})
    }

    
      const adminExists = await User.findOneAndUpdate({
          role: "admin",
          isVerified: true
        });
        
        if(!adminExists){
          user.role = "admin"; // 👑 FIRST ADMIN
        };

      await user.save();

    return res.status(200).json({message:"Continue with totp verfication"})

  } catch (err) {
    next(err);
  }
};

/** Fetch User */
export const fetchUser   = async (req, res, next) => {
  try {
    const { email, id } = req.query;
    const lookupField = email ? "email" : id ? "_id" : null;
    const lookUpValue = email ? email : id;
    if (
      !lookupField === "_id" && !mongoose.Types.objectId.isValid(lookUpValue)
    ) {
      return res.status.status(400).json({ message: "Invalid Id Format" });
    }

    const found = await User.findOne({ [lookupField]: lookUpValue }).select("-password");
    if (!found) return res.status(404).json({ message: "User not found" });
    res.json(found);
  } catch (err) {
    next(err);
  }
};

/** Delete User */
export const deleteUser  = async (req, res, next) => {
  try {
    const { email, id } = req.query;
    const lookupField = email ? "email" : id ? "_id" : null;
    const lookUpValue = email ? email : id;

    if (!lookupField === "_id" && !mongoose.Types.objectId.isValid(lookUpValue)) {
      return res.status.status(400).json({ message: "Invalid Id Format" });
    }

    const found = await User.deleteOne({ [lookupField]: lookUpValue }).select("-password");
    if (!found) return res.status(404).json({ message: "User not found" });
    res.json(found);
  } catch (err) {
    next(err);
  }
};

/** Update User */
export const updateUser  = async (req, res, next) => {
  try {
    const { id, email } = req.query;
    const { ...updates } = req.body;
    const lookup = id ? { _id: id } : email ? { email } : null;

    if (!lookup) {
      return res.status(400).json({ message: "Provide either id or email." });
    }
    if (lookup._id && !mongoose.Types.ObjectId.isValid(lookup._id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const updated = await User.findOneAndUpdate(
      lookup,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

/** Fetch All Users */
export const fetchAllUser = async (req, res, next) => {
  try {
    const allUsers = await User.find({}).select("-password");
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ message: "No Users" });
    }
    return res.status(200).json(allUsers);
  } catch (err) {
    next(err);
  }
};