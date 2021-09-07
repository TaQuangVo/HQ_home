const mongoose = require("mongoose")
const dbConnection = require("../index")

const blogSchema = mongoose.Schema({
    authorId: String,
    authorName: String,
    imageUrl: String,
    isPublic:Boolean,
    imageName:String,
    title:String,
    shortDiscription: String,
    body: String,
    likeCount: Number,
},{
    timestamps:true
})

const blogModel = dbConnection.model("blogs", blogSchema)

module.exports = blogModel
