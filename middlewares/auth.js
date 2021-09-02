const {validateToken} = require("../util/auth_func")



const Authorization = (req, res, next) => {
    const authHeader = req.headers.authorization

    //validate auth header
    if(!authHeader){
        res.status(400).json({
            success:false,
            msg:"Log in failed, token required, (code: -1)",
        })
        return
    }

    const tokenParts = authHeader.split(" ")
    if(tokenParts.length !== 2){
        res.status(400).json({
            success:false,
            msg:"Log in failed, invalid token, (code: 0)",
        })
        return
    }

    //validate token syntax
    const bearer = tokenParts[0]
    const token = tokenParts[1]
    const JWS_REGEX = "^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$";

    if( bearer != "Bearer" && tokenParts[1].match(JWS_REGEX) != null ){
        res.status(400).json({
            success:false,
            msg:"Log in failed, invalid token, (code: 1)",
        })
        return
    }

    //validate Token
    const verifyToken = validateToken(token)
    if(!verifyToken){      
        res.status(400).json({
            success:false,
            msg: "Log in failed, invalid token (code: 2)"
        })
        return 
    }
    
    //validate exp date
    if(verifyToken.exp < Date.now()){
        console.log(verifyToken.exp)
        console.log(Date.now())
        res.status(400).json({
            success:false,
            msg:"Log in failed, invalid token, (code: 3)",
        })
        return
    }

    req.credential = verifyToken
    next()
}

module.exports = {
    Authorization
}