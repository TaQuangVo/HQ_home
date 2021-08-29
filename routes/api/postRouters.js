const {Router} = require("express")
const {Authorization} = require("../../middlewares/auth")


const postRouters = Router();


postRouters.post("/", Authorization, (req,res)=>{
    res.json(req.credential)
})

module.exports = postRouters