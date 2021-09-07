const {Router} = require("express")
const {Authorization} = require("../../middlewares/auth")
const blogModel = require("../../database/models/blogModel")
const multer = require("multer")
const {handleBlogMediaUpload} = require("../../middlewares/blog")


const blogRouters = Router()


blogRouters.get("/", Authorization, (req,res) => {
    res.send("blog")
})

blogRouters.post("/", Authorization, (req, res) => {

     if(req.credential.role == "admin"){
         return res.status(403).json({
             success:false,
             msg:"No permission to perform the action"
         })
     }

    handleBlogMediaUpload.single("image")(req, res, (err) => {
        if(err instanceof multer.MulterError){
            console.log(err)
            return res.status(500).json({
                success:false,
                msg:"Failed to upload image (code:1)",
                err:err
            })
        }else if (err){
            return res.status(500).json({
                success:false,
                msg:"Failed to upload image (code:2)",
                err:err
            })
        }

        isRequiredField = !req.body.title || !req.body.body || !req.body.shortDiscription 
        || req.body.title == "" || req.body.body == "" || req.body.shortDiscription == ""
    
        if(isRequiredField){
            return res.status(400).json({
                success:false,
                msg:"All required field have to be filed",
            })
        }
        
        const newBlog = new blogModel({
            authorId:req.credential.sub,
            authorName: req.credential.username,
            isPublic:true,
            imageName: (req.file ? req.file.filename : ""),
            imageUrl:(req.file ? `/api/media/blog-images/${req.file.filename}` : ""),
            title:req.body.title,
            shortDiscription:req.body.shortDiscription,
            body: req.body.body,
            likeCount: 0
        })

        newBlog.save()
        .then(savedBlog => {
            return res.status(201).json({
                success:true,
                msg:"Blog uploaded successfully",
                blog:savedBlog
            })
        }).catch(err => {
            return res.status(500).json({
                success:false,
                msg:"Something gone wrong",
                err:err
            })
        })
    })
})


module.exports = blogRouters