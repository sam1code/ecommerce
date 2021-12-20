import express from "express";
import { PORT, MONGO_URL } from "./config.js";
import productRoute from "./routers/productRoute.js";
import mongoose from "mongoose";
import { error } from "./middlewares/Error.js";
// import { asyncErr } from "./middlewares/CatchAsyncErrors.js";

//handeling unquote exception
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  process.exit(1);
});

const app = express();
app.use(express.json());
app.use("/api", productRoute);
app.use(error);
// app.use(asyncErr);
mongoose
  .connect(MONGO_URL)
  .then((data) => {
    console.log(`mongodb connected with server: ${data.connection.host}`);
    app.listen(PORT, () => {
      console.log(`listening on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`err: ${err.message}`);
    process.exit(1);
  });
