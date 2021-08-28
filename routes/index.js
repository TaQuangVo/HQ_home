const { Router } = require("express");
const userRoutes = require("./api/userRoutes")

const apiRoutes = Router()


apiRoutes.use("/user", userRoutes)


module.exports = apiRoutes