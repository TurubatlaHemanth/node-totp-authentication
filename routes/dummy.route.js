import express from "express";
import getAllItems from "../controllers/dummy.controller.js";
import rateLimit from "express-rate-limit";



const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 1,                 // limit each IP
  message: "Too many requests, please try again later."
});


const dummyRouter = express.Router();


dummyRouter.get('/all', limiter,getAllItems);


export default dummyRouter;