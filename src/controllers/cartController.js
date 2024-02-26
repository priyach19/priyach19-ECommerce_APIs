const pool=require('../../db')

//add item to cart
module.exports.addToCart=async(req,res)=>{
    const {productId,quantity,userId}=req.body;
   
    try{
        //check if product exist
        const product=await pool.query('SELECT * FROM products WHERE id=$1',[productId])

        if(product.rows.length===0){
            return res.status(401).json({error:"product not found"})
        }
        //check if product alredy present in cart
        const productInCart=await pool.query('SELECT * FROM cart WHERE user_id=$1 AND product_id=$2',[userId,productId])

        if(productInCart.rows.length>0){
            //update quantity
            await pool.query('UPDATE cart SET quantity=quantity+$1 WHERE user_id=$2 AND product_id=$3',[quantity,userId,productId])
            res.status(201).json("Update product as present in cart")

        }else{
            //if not present add to cart
            await pool.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, productId, quantity]
              );
        }
        res.sendStatus(200).jason("product added in cart")

    }catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


//view the item in cart
module.exports.viewCart=async(req,res)=>{
    const userId = req.user_id;

  try {
    // Get the user's cart items along with product details
    const cartItems = await pool.query(
      'SELECT c.product_id, p.title, p.price, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
      [userId]
    );

    res.json(cartItems.rows);
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//update the item quantity
module.exports.updateCart=async(req,res)=>{
    const { productId, quantity } = req.body;
  const userId = req.user_id;

  try {
    // Check if the product is in the user's cart
    const existingCartItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingCartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Update the quantity
    await pool.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
      [quantity, userId, productId]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//remove item from cart
module.exports.deleteCart=async(req,res)=>{
    const { productId } = req.body;
  const userId = req.user_id;

  try {
    // Check if the product is in the user's cart
    const existingCartItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingCartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Remove the item from the cart
    await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}