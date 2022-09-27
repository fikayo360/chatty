const jwt = require("jsonwebtoken")


const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json("no token! access denied")
    }
    const token = authHeader.split(' ')[1]
    console.log(token)
   
    try{
        const decoded = jwt.verify(token,process.env.SECRET)
        console.log(decoded)
        req.id = decoded.id
        next()
    }
    catch(err){
        return res.status(500).json("could not verify ")
    }
}

module.exports = {verifyToken}