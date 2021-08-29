const { Router } = require("express");
const userRoutes = require("./api/userRoutes")
const postRouters = require("./api/postRouters")

const apiRoutes = Router()


apiRoutes.use("/user", userRoutes)
apiRoutes.use("/post", postRouters)


module.exports = apiRoutes