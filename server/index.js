import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import { DB_NAME, conf } from "./config.js";
import kpiRouter from "./routes/kpi.js";
import productRouter from "./routes/product.js";
import transactionRouter from "./routes/transaction.js";
import { kpis, products, transactions } from "./data/data.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";

/* CONFIGURATIONS */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use("/kpi", kpiRouter);
app.use("/product", productRouter);
app.use("/transaction", transactionRouter);

const PORT = process.env.PORT || 9000;

const DB_CONNECT = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${conf.mongoURI}/${DB_NAME}`
    );
    console.log("DB_CONNECT :: MongoDB connected successfully!");
    console.log(`\n DB HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("ERROR :: DB_CONNECT :: MongoDB connection failed!");
    process.exit(1);
  }
};

DB_CONNECT()
  .then(() => {
    const port = process.env.PORT || 3400;
    app.listen(port, () => {
      console.log("Database connected successfully");
      console.log("Server running on port -->", port);
    });
  })
  .then(async () => {
    /* ADD DATA ONE TIME ONLY OR AS NEEDED */
    try {
      /* //! Dont uncomment these added data and run them */
      //! await mongoose.connection.dropDatabase()
      //! await KPI.insertMany(kpis);
      //! await Product.insertMany(products);
      //! await Transaction.insertMany(transactions);
    } catch (error) {
      console.log("drop and insertion error",error);
    }
  })
  .catch((error) => {
    console.log("ERROR :: DB_CONNECT catch :: MongoDB connection failed!");
  });
