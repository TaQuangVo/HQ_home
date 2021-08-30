const multer = require("multer")
const path = require("path")
const crypto = require("crypto")


const storage = multer.diskStorage({
    destination: (req, file ,cb) => {
        const saveFolder = path.join(__dirname, "..", "/media/post-images")

        cb(null, saveFolder)
    },
    filename: (req, file , cb) => {
        const ext = path.extname(file.originalname)
        const randomBite = crypto.randomBytes(16).toString("hex")
        const finalName = randomBite + ext

        cb(null, finalName)
    }
})

const handlePostMediaUpload = multer({storage:storage})


module.exports = {
    handlePostMediaUpload
}