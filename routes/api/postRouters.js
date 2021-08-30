const {Router} = require("express");
const multer = require("multer");
const {Authorization} = require("../../middlewares/auth")
const {handlePostMediaUpload} = require("../../middlewares/post")
const postModel = require("../../database/models/postModel");

const postRouters = Router();



postRouters.post("/", Authorization, (req,res)=>{

    handlePostMediaUpload.single("image")(req,res, (err) => {

        if(!req.body.description){
            res.status(400).json({
                success: false,
                msg:"Description field is required"
            })
            return
        }

        if(err instanceof multer.MulterError){
            console.log(err)
            res.status(500).json({
                success: false,
                msg:"Failed to upload image (code:1)"
            })
            return
        }else if (err){
            console.log(err)
            res.status(500).json({
                success: false,
                msg:"Failed to upload image (code:2)"
            })
            return
        }

        const newPost = new postModel({
            author:req.credential.sub,
            isPublic: true,
            description: req.body.description,
            imageUrl: (req.file ? req.file.destination : ""),
            imageName: (req.file ? req.file.filename : ""),
            likeCount: 0,
        })

        newPost.save().then(post => {
            console.log(post)
            res.status(200).json({
                success:true,
                msg: "Post uploaded successfully",
                post:post
            })
            return
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                success:false,
                msg:"Failed to upload post"
            })
            return
        })
    })
})

postRouters.get("/", Authorization, (req, res) => {
    res.send("this route will return 5 most resent post associate to the signed in user")
})

module.exports = postRouters