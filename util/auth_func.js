const crypto = require("crypto")
const jsonwebtoken = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

const publicKeyPath = path.join(__dirname, "..", "/id_rsa_pub.pem")
const privateKeyPath = path.join(__dirname, "..", "/id_rsa_priv.pem")

const PRIV_KEY = fs.readFileSync(privateKeyPath, "utf8");
const PUB_KEY = fs.readFileSync(publicKeyPath, "utf8");

const hashPwdWithSalt = (password) => {
    const salt = crypto.randomBytes(32).toString("hex")

    const hashedPwd = crypto.pbkdf2Sync(password,salt,10000,64,"sha512").toString("hex")

    return { hashedPwd, salt}
}

const validatePassword = (password, hashedPassword, salt) => {

    const passwordValidate = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")

    if(hashedPassword == passwordValidate){
        return true
    }else{
        return false
    }
}

const issueToken = (user) => {
    const userId = user._id
    const expiresIn = "1d"

    const payload = {
        sub:userId,
        role:user.role,
        iat:Date.now()
    }

    const signOptions = {
        expiresIn:expiresIn,
        algorithm:"RS256"
    }

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, signOptions)

    return {
        token:"Bearer " + signedToken,
        expiresIn:expiresIn
    }
}

const validateToken = (token) => {
    try {
        const tokenData = jsonwebtoken.verify(token,PUB_KEY,{algorithms:"RS256"})
        return tokenData
    } catch(err) {
        return(false)
    }


}


module.exports = {
    issueToken,
    hashPwdWithSalt,
    validatePassword,
    validateToken
}