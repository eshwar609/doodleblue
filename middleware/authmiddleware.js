const jwt = require('jsonwebtoken')
const config = require('../config/default')

const authentication = async(req,res,next) => {
    try {
    let token = req.headers['x-access-token'];
    if(!token) {
        res.status(401).json({error: "invalid token"})
    }

    // get user details from token
    const DecodedAccount = jwt.verify(token, config.jwtSecret)

    // check for user account
    if(!DecodedAccount) {
        res.json({error: "authentication failed"})
    }
    req.user = DecodedAccount.UserId
    next();

    } catch(error) {
        console.log(error)
    }
}
module.exports = authentication