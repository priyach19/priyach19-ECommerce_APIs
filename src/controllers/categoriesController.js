const pool=require('../../db')

module.exports.getcategories=async(req,res)=>{
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}