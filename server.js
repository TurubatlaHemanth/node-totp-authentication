import express from "express";
import { connectDB } from "./config/mongoDb.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/tasks.routes.js";
import dummyRouter from "./routes/dummy.route.js";
import cookieParser from 'cookie-parser';
import roleRouter from "./routes/role.route.js";
import rateLimit from "express-rate-limit";
import getAllItems from './controllers/dummy.controller.js'
import cors from "cors";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 6,                 // limit each IP
  message: "Too many requests, please try again later."
});


const app  = express();
const port = 5000;
const rbac = express.Router();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
// app.use(limiter)  implements for the all the endpoints in the server.

connectDB()
  .then(val => console.log('MongoDB connected:', val))
  .catch(err => console.error('MongoDB failed to connect:', err));

app.get("/", limiter, (req, res) => res.send("Hello Hemanth"));
app.listen(port, () => console.log(`Listening on port ${port}`));

/* *************** ROUTES *************** */

const contextPath = "/api/v1";
app.use(contextPath,rbac);

rbac.use('/user', userRouter ) // User Route ...!
rbac.use('/task', taskRouter ) // Tasks Route ...!
rbac.use('/role', roleRouter ) // Roles Route ...!
rbac.use('/pagination',dummyRouter)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal error' });
});
