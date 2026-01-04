const express = require("express");
const isAuth = require("../middleware/auth-midware");
const { createProducts, getProducts, getSingleProduct, updateProduct, deleteProduct, searchByitemTitle, searchByCategory } = require("../controller/product-controller");

const router = express.Router();

router.post("/", isAuth, createProducts);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", isAuth, updateProduct);
router.delete("/:id", isAuth, deleteProduct);
router.get("/search/title", searchByitemTitle);
router.get("/search/category", searchByCategory);


module.exports = router;