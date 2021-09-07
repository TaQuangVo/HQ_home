const {Router} = require("express");
const multer = require("multer");
const {Authorization} = require("../../middlewares/auth")
const {handlePostMediaUpload} = require("../../middlewares/post")
const postModel = require("../../database/models/postModel");

const postRouters = Router();



postRouters.post("/", Authorization, (req,res)=>{

    handlePostMediaUpload.single("image")(req,res, (err) => {
        console.log(req.body)
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
            imageUrl: (req.file ? `/api/media/post-images/${req.file.filename}` : ""),
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
    const userRole = req.credential.role

    postModel.find(userRole == "guest" && {isPublic:true})
    .sort({createdAt:"desc"})
    .limit(5)
    .then(posts => {
        if(posts.length == 0){
            res.status(404).json({
                success:false,
                msg: "No post found",
            })
            return
        }
        res.status(200).json({
            success:true,
            msg: "Posts fetched successfully",
            posts: posts
        })
    }).catch(err => {
        res.status(500).json({
            success:false,
            msg: "Something gone wrong while fetching posts",
            err: err
        })
    })
})

postRouters.delete("/:id", Authorization, (req,res) => {
    const postId = req.params.id

    postModel.findById(postId)
    .then(post => {
        if(!post){
            res.status(404).json({
                success:false,
                msg:`No post with Id ${postId} found!`,
            })
            return
        }
        else if (post.author !== req.credential.sub){
            res.status(401).json({
                success:false,
                msg:`Unauthorized to perform the action`,
            })
            return
        }
        post.delete()
        .then(result => {
            res.status(401).json({
                success:true,
                msg:`Post with Id ${postId} deleted successfully`,
            })
            return
        }).catch(err => {
            res.status(500).json({
                success:false,
                msg:`Something gone wrong`,
                err: err
            })
            return
        })
    })

})

postRouters.put("/:id", Authorization, (req, res) => {
    const postId = req.params.id
    let newDescripton

    if(!req.body.description){
        res.status(400).json({
            success:false,
            msg:`New description to post is required`,
        })
        return
    }else {
        newDescripton = req.body.description
    }

    postModel.findById(postId)
    .then(post => {
        if(!post){
            res.status(404).json({
                success:false,
                msg:`No post with Id ${postId} found!`,
            })
            return
        }
        else if (post.author !== req.credential.sub){
            res.status(401).json({
                success:false,
                msg:`Unauthorized to perform the action`,
            })
            return
        }

        post.description = newDescripton
        post.save()
        .then(result => {
            res.status(401).json({
                success:true,
                msg:`Post edited successfully`,
                post:result
            })
            return
        }).catch(err => {
            res.status(500).json({
                success:false,
                msg:`Something gone wrong`,
                err: err
            })
            return
        })
    })
})

module.exports = postRouters