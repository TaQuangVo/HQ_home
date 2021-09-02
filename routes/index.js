const { Router } = require("express");
const userRoutes = require("./api/userRoutes")
const postRouters = require("./api/postRouters")
const mediaRouters = require("./api/mediaRouters")
const messageRouters = require("./api/dmRouter")

const apiRoutes = Router()


apiRoutes.use("/user", userRoutes)
apiRoutes.use("/post", postRouters)
apiRoutes.use("/media", mediaRouters)
apiRoutes.use("/message", messageRouters)


module.exports = apiRoutes