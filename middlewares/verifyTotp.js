import speakeasy from 'speakeasy';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken'

export const verifyTotp = async (req, res, next) => {
  try {

    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ message: "Email and TOTP token are required" });

    const user = await User.findOne({ email });
    if (!user || !user.isTotpEnabled) return res.status(401).json({ message: "Unauthorized" });

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!verified) return res.status(401).json({ message: "Invalid TOTP code" });

    // Generate JWT on successful verification
    const jwtToken = jwt.sign({ sub: user._id, userEmail: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
    return res.cookie('access_token', jwtToken, { httpOnly: true }).json({ message: "Login successful", token: jwtToken });

  } catch (err) {
    next(err);
  }
}