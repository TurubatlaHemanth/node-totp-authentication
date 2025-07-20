import express from "express";
import { connectDB } from "./config/mongoDb.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/tasks.routes.js";
import cookieParser from 'cookie-parser';
import roleRouter from "./routes/role.route.js";

const app = express();
const port = 5000;
const rbac = express.Router();
app.use(express.json());
app.use(cookieParser())

connectDB()
  .then(val => console.log('MongoDB connected:', val))
  .catch(err => console.error('MongoDB failed to connect:', err));

app.get("/", (req, res) => res.send("Hello Hemanth"));
app.listen(port, () => console.log(`Listening on port ${port}`));

/* *************** ROUTES *************** */

const contextPath = "/api/v1";
app.use(contextPath,rbac);

rbac.use('/user', userRouter) // User Route ...!
rbac.use('/task', taskRouter) // Tasks Route ...!
// rbac.use('/role', roleRouter) // Roles Route ...!

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal error' });
});
