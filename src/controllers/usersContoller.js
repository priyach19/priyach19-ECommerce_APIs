const pool=require('../../db')
const jwt = require("jsonwebtoken");
require('dotenv').config()



// register user
module.exports.register = async (req, res) => {
    const {name,email,password}= req.body;
  
    try{
        //check if user exists
        const existUser=await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if(existUser.rows.length>0){
          return res.status(400).json({ error: 'User with this email already exists' });
        }
        //if not present create user
        const inserQuery='INSERT INTO users(name,email,password) VALUES($1,$2,$3)';
        const insertValues=[name,email,password]
        await pool.query(inserQuery,insertValues);
        res.status(200).json({ message: 'User registered successfully' });

    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }

}

//login user
module.exports.login= async (req, res) => {
    const { email, password } = req.body;
  
    try {
      //check if user exist
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0 || (password!==result.rows[0].password)) {
        return res.status(401).json({ message: 'user not found' });
      }
     //if exist generate token for authentication
      const token = jwt.sign({ email: result.rows[0].email, id:result.rows[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };