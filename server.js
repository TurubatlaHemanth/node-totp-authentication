import express from "express";
import { connectDB } from "./config/mongoDb.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const port = 5000;
const rbac = express.Router();
app.use(express.json());

connectDB()
  .then(val => console.log('MongoDB connected:', val))
  .catch(err => console.error('MongoDB failed to connect:', err));

app.get("/", (req, res) => res.send("Hello Hemanth"));
app.listen(port, () => console.log(`Listening on port ${port}`));

/* *************** ROUTES *************** */

const contextPath = "/api/v1";
app.use(contextPath,rbac);

rbac.use('/user', userRouter) // Routes useRoute ...!

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal error' });
});
