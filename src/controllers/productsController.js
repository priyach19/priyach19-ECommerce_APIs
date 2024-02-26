const pool=require('../../db')
//CREATE
module.exports.createproducts=async(req,res)=>{
    const { title, price, description, availability, category_id } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (title, price, description, availability, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, price, description, availability, category_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

//VIEW
module.exports.getproducts=async(req,res)=>{
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
      } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

//VIEW BY ID
module.exports.getproductbyId=async(req,res)=>{
    const productId = req.params.productId;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//UPDATE product BY ID
module.exports.updateproduct=async(req,res)=>{
    const productId = req.params.productId;
  const { title, price, description, availability, category_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET title = $1, price = $2, description = $3, availability = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [title, price, description, availability, category_id, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//DELETE product by ID
module.exports.deleteproduct=async(req,res)=>{
    const productId = req.params.productId;

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}