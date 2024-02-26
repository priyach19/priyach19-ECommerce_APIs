// Authentication Middleware
const jwt=require('jsonwebtoken');
require('dotenv').config()


const tokenRequired = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is invalid' });
      }
  
      req.user_id = decoded.id;
    //   console.log(decoded.id)
      next();
    });
  };
  module.exports=tokenRequired;

