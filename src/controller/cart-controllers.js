const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product");

const addToCart  = async (req, res) => {
    try {
        const productId = req.body.productId
            ?.toString()
            .replace(/[\r\n\t]/g, "")
            .trim();

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.exists({ _id: productId });
        if (!productExists) {
            return res.status(404).json({ message: "Product does not exist" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const itemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1, });
        }

        await user.save();
        res.status(200).json({ message: "Product added to cart", cart: user.cart });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getitemsinCart = async (req, res) => {
    try {

        const user = await User.findById(req.user.userId).populate("cart.product", "title price");
        if (!user.cart || user.cart.length === 0) {
            return res.status(200).json({ message: "Cart is empty", cart: [] });
        }
        
        const total = user.cart.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        res.status(201).json(user.cart, total);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const removeItemsFromCart = async (req, res) => {
    try {
        const productId = req.params.productId
            ?.toString()
            .replace(/[\r\n\t]/g, "")
            .trim();

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart = user.cart.filter(
            item => item.product.toString() !== productId
        );

        await user.save();
        res.status(200).json({ message: "Item removed from cart" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updateQuantity = async (req, res) => {
    const productId = req.body.productId
        ?.toString()
        .replace(/[\r\n\t]/g, "")
        .trim();

    const quantity = Number(req.body.quantity);


    if (!mongoose.Types.ObjectId.isValid(productId) || !!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Product ID and valid quantity required" });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        cartItem.quantity = quantity;
        await user.save();

        return res.status(200).json({ message: "Quantity updated", cart: user.cart });
    } catch (error) {
        console.error("Error updating quantity:", error);
        return res.status(500).json({ 
            message: "Internal server error"
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart = [];
        await user.save();

        return res.status(200).json({ message: "Cart emptied successfully", cart: user.cart });
        
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    addToCart,
    getitemsinCart,
    removeItemsFromCart,
    updateQuantity,
    clearCart
}