const mongoose = require("mongoose")






const dbUrl = "mongodb://mongod/app"
const dbConnection = mongoose.createConnection(dbUrl)

dbConnection.on("connected", () => {
    console.log("connected to DB successfully")
})






module.exports = dbConnection