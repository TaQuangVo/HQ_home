const {Router} = require("express")
const {Authorization} = require("../../middlewares/auth")
const postModel = require("../../database/models/postModel")
const blogModel = require("../../database/models/blogModel")
const fs = require("fs")

const mediaRouters = Router()


mediaRouters.get("/post-images/:imageName", Authorization, (req, res) => {
    const imageName = req.params.imageName

    postModel.findOne({imageName:imageName})
    .then(post => {
        if(!post){
            res.status(404).json({
                success:false,
                msg:"Found no post associate to the image!"
            })
            return
        }
        else if(post.isPublic === true){
            const readStream = fs.createReadStream("/app/media/post-images/" + blog.imageName)
            readStream.on("error", (err) => {
                if(err.code === "ENOENT"){
                    res.status(500).json({
                        success:false,
                        msg:"No image found",
                        err:err
                    })
                    return
                }
                res.status(500).json({
                    success:false,
                    msg:"Something gone wrong (code: 1)",
                    err:err
                })
                return
            })
            readStream.on("open", () => {
                readStream.pipe(res)
                return
            })
        }else{
            res.status(401).json({
                success:false,
                msg:"Image is private, no access"
            })
            return
        }
    }).catch(err => {
        res.status(500).json({
            success:false,
            msg:"Some thing gone wrong (code: 2)",
            err:err
        })
    })
})

mediaRouters.get("/blog-images/:imageName", Authorization, (req, res) => {
    const imageName = req.params.imageName

    blogModel.findOne({imageName:imageName})
    .then(blog => {
        if(!blog){
            res.status(404).json({
                success:false,
                msg:"Found no blog associate to the image!"
            })
            return
        }
        else if(blog.isPublic === true){
            const readStream = fs.createReadStream("/app/media/blog-images/" + blog.imageName)
            readStream.on("error", (err) => {
                if(err.code === "ENOENT"){
                    res.status(500).json({
                        success:false,
                        msg:"No image found",
                        err:err
                    })
                    return
                }
                res.status(500).json({
                    success:false,
                    msg:"Something gone wrong (code: 1)",
                    err:err
                })
                return
            })
            readStream.on("open", () => {
                readStream.pipe(res)
                return
            })
        }else{
            res.status(401).json({
                success:false,
                msg:"Image private, no access"
            })
            return
        }
    }).catch(err => {
        res.status(500).json({
            success:false,
            msg:"Some thing gone wrong (code: 2)",
            err:err
        })
    })
})

module.exports = mediaRouters