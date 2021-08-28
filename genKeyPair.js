const crypto = require("crypto")
const fs = require("fs")

const genKeyPair = () => {

    const { publicKey, privateKey }  = crypto.generateKeyPairSync("rsa",{
        modulusLength: 2048,
        publicKeyEncoding:{
            type: "pkcs1",
		    format: "pem",
        },
        privateKeyEncoding:{
            type: "pkcs1",
		    format: "pem",
        }
    })

    console.log(publicKey)
    console.log(privateKey)

    fs.writeFileSync(__dirname + "/id_rsa_pub.pem", publicKey);
    fs.writeFileSync(__dirname + "/id_rsa_priv.pem", privateKey);
}

genKeyPair()