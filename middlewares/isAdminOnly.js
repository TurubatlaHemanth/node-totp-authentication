import express from "express";

const isAdminOnly = (req, res, next) => {
  console.log("reached request body",req.body)
  try {
    if (req.user.role === "admin") {
      next();
    }
  } catch (err) {
    res.status(403).json({ message: "Admin Only can Access" });
  }
};

export default isAdminOnly;
