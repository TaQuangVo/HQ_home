const {Router} = require("express")
const {Authorization} = require("../../middlewares/auth")
const messageModel = require("../../database/models/messageModle")

const messageRouters = Router()


messageRouters.get("/guest-room", Authorization, (req, res) => {
    messageModel.find({room:"guest-room"})
    .limit(10)
    .sort({createdAt:"desc"})
    .then(messages => {
        if(messages.length == 0){
            return res.status(404).json({
                success:false,
                msg:"No messages found"
            })
        }else{
            return res.status(200).json({
                success:true,
                msg:"Messages fetched succsessfully",
                messages:messages
            })
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            success:false,
            msg:"Something gone wrong"
        })
    })
})

messageRouters.get("/admin-room", Authorization, (req, res) => {
    if(req.credential.role == "guest"){
        return res.status(403).json({
            success:false,
            msg:"No permission to perform the action"
        })
    }
    messageModel.find({room:"guest-rum"})
    .limit(10)
    .sort({createdAt:"desc"})
    .then(messages => {
        if(messages.length == 0){
            return res.status(404).json({
                success:false,
                msg:"No messages found"
            })
        }else{
            return res.status(200).json({
                success:true,
                msg:"Messages fetched succsessfully",
                messages:messages
            })
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            success:false,
            msg:"Something gone wrong"
        })
    })
})

messageRouters.post("/guest-room", Authorization, (req,res) => {
    if(!req.body.message || req.body.message === ""){
        return res.status(400).json({
            success:false,
            msg:"Message body required"
        })
    }
    const msg = req.body.message
    const authorId = req.credential.sub
    const authorName = req.credential.username

    const newMessage = new messageModel({
        message:msg,
        authorId:authorId,
        authorName:authorName,
        room:"guest-room"
    })

    newMessage.save()
    .then(msgSaved => {
        console.log(msgSaved)
        return res.status(201).json({
            success: true,
            msg:"Msg created successfully",
            data:msgSaved
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({
            success:false,
            msg:"Something gone wrong",
            err:err
        })
    })
})

messageRouters.post("/admin-room", Authorization, (req,res) => {
    if(req.credential.role === "guest"){
        return res.status(403).json({
            success:false,
            msg:"No permission to perform this action"
        })
    }
    
    if(!req.body.message || req.body.message === ""){
        return res.status(400).json({
            success:false,
            msg:"Message body required"
        })
    }
    const msg = req.body.message
    const authorId = req.credential.sub
    const authorName = req.credential.username

    const newMessage = new messageModel({
        message:msg,
        authorId:authorId,
        authorName:authorName,
        room:"admin-room"
    })

    newMessage.save()
    .then(msgSaved => {
        console.log(msgSaved)
        return res.status(201).json({
            success: true,
            msg:"Msg created successfully",
            data:msgSaved
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({
            success:false,
            msg:"Something gone wrong",
            err:err
        })
    })
})

module.exports = messageRouters