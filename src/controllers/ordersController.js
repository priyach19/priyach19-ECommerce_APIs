const pool = require("../../db");

//place and order 
module.exports.placeOrder = async (req, res) => {

  const userId = req.user_id;
  try {
    // Create a new order
    const orderResult = await pool.query('INSERT INTO orders (user_id) VALUES ($1) RETURNING id, order_date', [userId]);
    const orderId = orderResult.rows[0].id;

    // Get cart items for the user
    const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);

    // Check if the cart is empty
    if (cartItems.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Add products to your cart before placing an order.' });
    }

    // Move cart items to order_items table
    for (const cartItem of cartItems.rows) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, cartItem.product_id, cartItem.quantity]
      );
    }

    // Clear the user's cart
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.json({ order_id: orderId, order_date: orderResult.rows[0].order_date });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//order details
module.exports.orderDetails=async(req,res)=>{
    const userId = req.user_id;
    const orderId = req.params.orderId;
  
    try {
      // Check if the order belongs to the authenticated user
      const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId]);
  
      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found or does not belong to the authenticated user' });
      }
  
      // Retrieve order details along with product information
      const orderDetails = await pool.query(
        'SELECT oi.product_id, p.title, p.price, oi.quantity FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
        [orderId]
      );
  
      const formattedOrder = {
        order_id: orderResult.rows[0].id,
        user_id: orderResult.rows[0].user_id,
        order_date: orderResult.rows[0].order_date,
        items: orderDetails.rows,
      };
  
      res.json(formattedOrder);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

//orders history
module.exports.ordersHistory=async(req,res)=>{
    const userId = req.user_id;
    // console.log(userId)

  try {
    // Fetch order history for the authenticated user
    const orderHistory = await pool.query(
      'SELECT o.id as order_id, o.order_date, p.title, p.price, oi.quantity FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE o.user_id = $1 ORDER BY o.order_date DESC',
      [userId]
    );

    // Format the order history response
    const formattedOrderHistory = orderHistory.rows.map(order => ({
      order_id: order.order_id,
      order_date: order.order_date,
      items: [
        {
          title: order.title,
          price: order.price,
          quantity: order.quantity,
        },
      ],
    }));

    res.json(formattedOrderHistory);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}