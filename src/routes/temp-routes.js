const express = require("express");
const productModel = require("../models/product");
const isAuth = require("../middleware/auth-midware");

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register")
});

router.get("/logIn", (req, res) => {
    res.render("logIn")
});

router.get("/products", /*isAuth*/ async (req, res) => {
    const products = await productModel.find();
    res.render("products", { products });
});


module.exports = router;