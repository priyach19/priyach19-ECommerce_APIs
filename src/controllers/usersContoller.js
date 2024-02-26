const pool=require('../../db')
const jwt = require("jsonwebtoken");
require('dotenv').config()
//const secretKey="ecommerceapis"
//to register doctor 
module.exports.register = async (req, res) => {
    const {name,email,password}= req.body;
  
    try{
        // const hassedPassword=await bcrypt.hash(password,6)
        const inserQuery='INSERT INTO users(name,email,password) VALUES($1,$2,$3)';
        const insertValues=[name,email,password]
        await pool.query(inserQuery,insertValues);
        res.sendStatus(201);

    }catch(err){
        console.error(err)
        res.sendStatus(500)
    }

}

module.exports.login= async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0 || (password!==result.rows[0].password)) {
        return res.status(401).json({ message: 'user not found try again...' });
      }
  
      const token = jwt.sign({ email: result.rows[0].email, id:result.rows[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };