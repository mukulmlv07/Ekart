const express = require("express");
const { config } = require("dotenv");
config();
const app = express();

const bodyParser = require("body-parser");
const morgan = require("morgan");
const productRout = require("./api/Routes/products");
const orderRout = require("./api/Routes/orders");
const userRout = require("./api/Routes/users");
const mongoose = require("mongoose")
// console.log(process.env.PASSWORD);
mongoose
  .connect(
    `mongodb+srv://mukulmalviya:${process.env.PASSWORD}@cluster0-biwhb.mongodb.net/Shopping_Cart`
  )
  .then(() => {
    console.log("Successfully Connectetd");
  })
  .catch(() => {
    console.log("Failed to Connect");
  });

app.use(morgan("dev"));

app.use(express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.mathod === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
  }
});

app.use("/products", productRout);
app.use("/orders", orderRout);
app.use("/users", userRout);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    err: {
      message: err.message,
    },
  });
});
