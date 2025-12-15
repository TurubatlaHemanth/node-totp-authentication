import express from "express";
import getAllItems from "../controllers/dummy.controller.js";



const dummyRouter = express.Router();


dummyRouter.get('/all',getAllItems);


export default dummyRouter;