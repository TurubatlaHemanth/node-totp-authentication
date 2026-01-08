import User from "../models/userSchema.js";

const activateUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    if (user.isActive) {
      return res.status(400).json({ message: "User is already active" });
    }
    user.isActive = true;
    await user.save();
    return res.status(200).json({ message: "User activated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default activateUser;
