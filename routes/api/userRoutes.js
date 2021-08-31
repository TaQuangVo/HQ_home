const {Router} = require("express")
const userModel = require("../../database/models/userModel")
const {hashPwdWithSalt, issueToken, validatePassword} = require("../../util/auth_func")
const {Authorization} = require("../../middlewares/auth")


const userRouters = Router()

userRouters.get("/protected-route", Authorization, (req, res) => {
    console.log(req.credential)
    res.send("Your have access to this protected route")
})

userRouters.post ("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if(!username || !password || username=="" || password==""){
        res.status(400).json({
            success:false,
            msg:"Username and password required"
        })
        return
    }

    userModel.findOne({username:username})
    .then(user => {
        if(!user){
            res.status(404).json({
                success:false,
                msg:"User not found"
            })
            return
        }

        const isPasswordValid = validatePassword(password, user.hashedPwd, user.salt)
        if(!isPasswordValid){
            res.status(400).json({
                success:false,
                msg: "Unvalid password"
            })
            return
        }

        const token = issueToken(user)
        res.status(200).json({
            success:true,
            msg:"Log in successfully",
            user:{
                _id : user._id,
                username:user.username,
                role: user.role
            },
            credential:token,
        })

    }).catch(err => {
        console.log(err)
        res.status(500).json({
            success:false,
            msg:"Something gone wrong"
        })
    })
})

userRouters.post("/register", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password || username=="" || password==""){
        res.status(400).json({
            success:false,
            msg:"Username and password required"
        })
        return
    }

    userModel
    .findOne({username:username})
    .then((user) => {
        if(user){
            res.status(400).json({
                success:false,
                msg:"User already exit"
            })
            return
        }

        const {hashedPwd, salt } = hashPwdWithSalt(password)

        const newUser = new userModel({
            username:username,
            hashedPwd:hashedPwd,
            salt:salt,
            role:"guest"
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
                    username:user.username,
                    role: user.role
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

    }).catch(err => {
        console.log(err)
        res.status(500).json({
            success:false,
            msg:"Something went wrong"
        })
    })
})

module.exports = userRouters