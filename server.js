const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./src/config/db");
const morgan = require("morgan");
dotenv.config();
connectDatabase();

const authRoutes = require("./src/routes/auth-routes");
const productRoutes = require("./src/routes/product-routes");
const cartRoutes = require("./src/routes/cart-routes");
const tempRoutes = require("./src/routes/temp-routes");// front end kind of view routes
const port = process.env.PORT

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true})); /* */

app.set("view engine", "ejs"); //explains how to render ejs files
app.set("views", "./template");

app.get("/", (req, res) => {
    res.send("Welcome here");
});

app.use("/api/auth", authRoutes);
app.use("/", tempRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(port, () => {
    console.log(`Server is  running on port ${port}`);
});