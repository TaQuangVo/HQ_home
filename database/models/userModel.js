const mongoose = require("mongoose")
const dbConnection = require("../index")



const userSchemma = mongoose.Schema({
    username: String,
    hashedPwd: String,
    salt:String,
    role: String,
},{
    timestamps:true
})
const userModel = dbConnection.model("users", userSchemma)






module.exports = userModel