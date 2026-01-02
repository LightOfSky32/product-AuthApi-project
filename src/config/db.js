const mongoose = require("mongoose");
require("dotenv").config();

const mongo_url = process.env.mongo_url

const connectDatabase = async () => {
    try {
        await mongoose.connect(mongo_url);
        console.log("Connected to the database")
    } catch (error) {
        console.error("Mongodb connection failure", error);
        process.exit(1)
    }
};

module.exports = connectDatabase;