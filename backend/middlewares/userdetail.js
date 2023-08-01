const jwt = require('jsonwebtoken');
const JWT_SECRET = "ThisisaJWTtokenwhichwillsigneveryhting";

const userdetail = async (req, res, next)=>{
    //get the user from the jwt token and add the id to req object

    const token = req.header('auth-token');
    if (!token){
        res.status(401).send({err:"Please authenticate with a valid token"});
    }

    try {
        const data =  await jwt.verify(token, JWT_SECRET);
        // console.log('1');
        req.user = data.user;
        // console.log(req.user);
        // console.log('2');
        next();        
    } catch (error) {
        res.status(401).send({err:"Please authenticate with a valid token"});
    }
};

module.exports = userdetail;