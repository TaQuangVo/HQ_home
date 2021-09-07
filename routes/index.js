const { Router } = require("express");
const userRoutes = require("./api/userRoutes")
const postRouters = require("./api/postRouters")
const mediaRouters = require("./api/mediaRouters")
const messageRouters = require("./api/dmRouter")
const blogRouters = require("./api/blogRouters")

const apiRoutes = Router()


apiRoutes.use("/user", userRoutes)
apiRoutes.use("/post", postRouters)
apiRoutes.use("/media", mediaRouters)
apiRoutes.use("/message", messageRouters)
apiRoutes.use("/blog", blogRouters)


module.exports = apiRoutes