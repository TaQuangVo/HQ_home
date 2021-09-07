const mongoose = require("mongoose")
const dbConnection = require("../index")


const postSchema = mongoose.Schema({
    author: String,
    isPublic: Boolean,
    description: String,
    imageUrl:String,
    imageName:String,
    likeCount: Number
},{
    timestamps:true
})



const postModel = dbConnection.model("posts", postSchema)

module.exports = postModel
