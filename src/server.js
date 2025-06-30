import express from "express";
import { connectDB } from "./config/mongoDb.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const port = 5000;

app.use(express.json());

connectDB()
  .then(val => console.log('MongoDB connected:', val))
  .catch(err => console.error('MongoDB failed to connect:', err));

app.get("/", (req, res) => res.send("Hello Hemanth"));

/* *************** ROUTES *************** */

app.use('/api', userRouter);  // Routes useRoute ...!
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal error' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));