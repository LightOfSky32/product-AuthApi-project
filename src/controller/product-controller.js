const mongoose = require("mongoose");
const Product = require("../models/product");

const createProducts = async (req, res) => {
    try {
        const product = await Product.create({...req.body, user: req.user.userId});
        res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const product = await Product.find().populate("user", "name");
        res.status(200).json(product);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const singleProduct = await Product.findById(id);
        if (!singleProduct) {
            return res.status(404).json({
                message: "item not found"
            });
        }
        res.status(200).json(singleProduct);
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const searchByitemTitle = async (req, res) => {
    try {
        const search = req.query.title
            ?.toString()
            .normalize("NFKD")
            .replace(/[\r\n\t]/g, "") // removes %0A, %0D, %09
            .replace(/\s+/g, " ") // collapses extra spaces
            .trim();

        if (!search) {
            return res.status(404).json({
                message: "Item with that name not found."
            });
        }
        const products = await Product.find({ 
            $or: [
                {title: { $regex: search, $options: "i" }},
                { description: { $regex: search, $options: "i" } }
            ]
         }); //helps to search a word in description or title

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const searchByCategory = async (req, res) => {
    try {
        const category = req.query.category
            ?.toString() //added these to stop post man error when sending requests
            .normalize("NFKD")
            .replace(/[\r\n\t]/g, "")
            .replace(/\s+/g, " ") 
            .trim();
        if (!category) {
            return res.status(404).json({
                message: "items in that category not found."
            });
        }
        const products = await Product.find({ category: { $regex: category, $options: "i" } });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Item not found" });
        }
        const isOwner = product.user.toString() === req.user.userId;
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You cannot modify this item"
            });
        };
        Object.assign(product, req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product){
            return res.status(404).json({ message: "Item not found" });
        }
        const isOwner = product.user.toString() === req.user.userId;
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You cannot modify this item"
            });
        };
        await product.deleteOne();
        res.json({ message: "Product succesfully deleted" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    createProducts,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    searchByitemTitle,
    searchByCategory
};
