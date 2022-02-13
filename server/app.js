const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const errMiddleware = require("./middleWare/error");

//middlewares
app.use(express.json());
app.use(cookieParser());

//middleware for error
app.use(errMiddleware);

//route impots
const products = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");
const orderRoutes = require("./routes/orderRoute");

app.use("/api/v1", products);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

module.exports = app;
