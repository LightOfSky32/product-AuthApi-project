const express = require("express");
const isAuth = require("../middleware/auth-midware");
const { addToCart, getitemsinCart, removeItemsFromCart, updateQuantity, clearCart } = require("../controller/cart-controllers");

const router = express.Router();

router.post("/", isAuth, addToCart);
router.get("/", isAuth, getitemsinCart);
router.delete("/:productId", isAuth, removeItemsFromCart);
router.put("/quantity", isAuth, updateQuantity);
router.delete("/", isAuth, clearCart);

module.exports = router;