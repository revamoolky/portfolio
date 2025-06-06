
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import contactsRouter from "./routes/contacts";
import fs from "node:fs/promises";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define static directory - pointing to the app folder at the same level as server
const staticDir = path.join(__dirname, '../../app'); // Go up two levels, then into app

app.use(express.json()); // parse JSON bodies
app.use("/api/contacts", contactsRouter);

// Serve static files from the app directory
app.use(express.static(staticDir));

// Also serve the app directory contents under specific paths if needed
app.use('/public', express.static(path.join(staticDir, 'public')));
app.use('/src', express.static(path.join(staticDir, 'src')));

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`;

// Route handler for serving HTML
app.get("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  res.sendFile(indexHtml);
});

// Root route redirect
app.get("/", (req: Request, res: Response) => {
  res.redirect("/app");
});

// Connect to MongoDB and start server
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

// v2
// import express, { Request, Response } from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import contactsRouter from "./routes/contacts";
// import fs from "node:fs/promises";
// import path from "path";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Define static directory - pointing to the app folder at the same level as server
// const staticDir = path.join(__dirname, '../../app'); // Go up two levels, then into app

// app.use(express.json()); // parse JSON bodies
// app.use("/api/contacts", contactsRouter);

// const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
// const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`;

// // Route handler for serving HTML
// app.use("/app", async (req: Request, res: Response) => {
//   try {
//     const indexHtml = path.resolve(staticDir, "index.html");
//     const html = await fs.readFile(indexHtml, { encoding: "utf8" });
//     res.send(html);
//   } catch (error) {
//     console.error('Error reading index.html:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Root route redirect
// app.get("/", (req: Request, res: Response) => {
//   res.redirect("/app");
// });

// // Connect to MongoDB and start server
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("✅ Connected to MongoDB Atlas");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });

// V1
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import contactsRouter from "./routes/contacts";
// import fs from "node:fs/promises";
// import path from "path";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json()); // parse JSON bodies
// app.use("/api/contacts", contactsRouter);
// const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
// const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`;

// // mongoose.connect("mongodb://localhost:27017/Portfolio")
// //   .then(() => console.log("MongoDB connected"))
// //   .catch((err) => console.error(err));
// // mongoose.connect(uri)
// //   .then(() => {
// //     console.log("✅ Connected to MongoDB via Compass");
// //     app.listen(PORT, () => {
// //       console.log(`🚀 Server running at http://localhost:${PORT}`);
// //     });
// //   })
// //   .catch((error) => {
// //     console.error("❌ Failed to connect to MongoDB:", error);
// //   });
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("✅ Connected to MongoDB Atlas");
//     app.use("/app", async (req: Request, res: Response) => {
//       try {
//           const indexHtml = path.resolve(staticDir, "index.html");
//           const html = await fs.readFile(indexHtml, { encoding: "utf8" });
//           res.send(html);
//       } catch (error) {
//           console.error('Error reading index.html:', error);
//           res.status(500).send('Internal Server Error');
//       }
//   });
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });

// // Start server
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// // });

