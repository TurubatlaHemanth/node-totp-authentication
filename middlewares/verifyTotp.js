import speakeasy from 'speakeasy';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken'

export const verifyTotp = async (req, res, next) => {
  try {

    console.log("Reached verifyTotp")

    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ message: "Email and TOTP token are required" });

    const user = await User.findOne({ email });
    const verifyToken = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
      window: 1
    });
    if (verifyToken && !user.isTotpEnabled){
        user.isTotpEnabled=true;
        user.active=true;
        user.save();
    }

  console.log("Verifying the token",verifyToken)
  if (!verifyToken) return res.status(401).json({ message: "Invalid TOTP code" });

  if(verifyToken && !user.isActive) return res.status(400).json({message:"User is InActive"})
  
        const access_token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          isVerified: user.isVerified
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );
      
  return res.cookie(`access_token`,access_token,{
      httpOnly:true,
      secure:true
    }).status(200).json({message: "Login successfully."})


    // // Generate JWT on successful verification
    // const jwtToken = jwt.sign({ sub: user._id, userEmail: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
    // return res.cookie('access_token', jwtToken, { httpOnly: true }).json({ message: "Login successful", jwt_token: jwtToken });

  } catch (err) {
    next(err);
  }
}