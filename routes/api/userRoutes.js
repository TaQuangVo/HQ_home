const {Router} = require("express")
const userModel = require("../../database/models/userModel")
const {hashPwdWithSalt, issueToken} = require("../../util/auth_func")


const userRouters = Router()

userRouters.post("/register", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    userModel
    .findOne({username:username})
    .then((user) => {
        if(user){
            res.status(400).json({
                success:false,
                msg:"User already exit"
            })
        }
        else{
            const {hashedPwd, salt } = hashPwdWithSalt(password)

            const newUser = new userModel({
                username:username,
                hashedPwd:hashedPwd,
                salt:salt
            })

            newUser
            .save()
            .then((user)=>{
                const token = issueToken(user)

                res.status(201).json({
                    success: true,
                    msg:"User created successfully",
                    user:{
                        _id : user._id,
                        username:user.username
                    },
                    credential:token
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    success:false,
                    msg:"Something went wrong"
                })
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            success:false,
            msg:"Something went wrong"
        })
    })
})

module.exports = userRouters