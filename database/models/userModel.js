const mongoose = require("mongoose")
const dbConnection = require("../index")







const userSchemma = mongoose.Schema({
    username: String,
    hashedPwd: String,
    salt:String,
})
const userModel = dbConnection.model("users", userSchemma)






module.exports = userModel