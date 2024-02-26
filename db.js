const Pool = require('pg').Pool;
require('dotenv').config();

const pool=new Pool({
    user:process.env.USER,
    host:'localhost',
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:5432
})

module.exports=pool;