const {Router} = require("express")
const {Authorization} = require("../../middlewares/auth")

const messageRouters = Router()


messageRouters.get("/", Authorization, (req, res) => {
    res.send("This is message route")
})

module.exports = messageRouters