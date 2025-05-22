import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import contactsRouter from "./routes/contacts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // parse JSON bodies
app.use("/api/contacts", contactsRouter);
const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`;

// mongoose.connect("mongodb://localhost:27017/Portfolio")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));
// mongoose.connect(uri)
//   .then(() => {
//     console.log("✅ Connected to MongoDB via Compass");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("❌ Failed to connect to MongoDB:", error);
//   });
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

