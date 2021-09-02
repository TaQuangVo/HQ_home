const mongoose = require("mongoose")
const dbConnection = require("../index")

const messageSchemma = mongoose.Schema({
    message:String,
    authorId:String,
    authorName:String,
    room:String,
},{
    timestamps:true
})

const messageModel = dbConnection.model("message", messageSchemma)

module.exports = messageModel