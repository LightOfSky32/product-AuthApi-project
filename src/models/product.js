const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, /* handles relationships between user.js and product.js */
        ref: "User",
        required: true
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;