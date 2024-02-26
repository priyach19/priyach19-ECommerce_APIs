const {Router}=require('express')
const router=Router();
const tokenRequired=require('../config/authMiddleware')
const productsController=require('../controllers/productsController')
const categoriesController=require('../controllers/categoriesController')
const cartController=require('../controllers/cartController')
const orderController=require('../controllers/ordersController')

//__________________Route for categories___________________________________________________

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get a list of categories
 *     description: Retrieve a list of categories from the database
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Category 1
 *               - id: 2
 *                 name: Category 2
 *       500:
 *         description: Internal Server Error
 */
router.get('/categories',categoriesController.getcategories)
//router.post('/products',productsController.createproducts)


//___________________________Routes for product management___________________________________________________________
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management routes
 */


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: Show all products
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: Product 1
 *                 price: 10.99
 *                 description: Description of Product 1
 *                 availability: true
 *                 category_id: 1
 *               - id: 2
 *                 title: Product 2
 *                 price: 19.99
 *                 description: Description of Product 2
 *                 availability: false
 *                 category_id: 2
 *       500:
 *         description: Internal Server Error
 */
router.get('/products',productsController.getproducts)

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get product deatils by its ID
 *     description: Retrieve details of a product by its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: Product 1
 *               price: 10.99
 *               description: Description of Product 1
 *               availability: true
 *               category_id: 1
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 * 
 * */
router.get('/products/:productId',productsController.getproductbyId)


/**
 * @swagger
 * /api/productsbycategories/{categoryId}:
 *   get:
 *     summary: Get products by category ID
 *     description: Retrieve a list of products based on the specified category ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: Product 1
 *                 price: 10.99
 *                 description: Description of Product 1
 *                 availability: true
 *               - id: 2
 *                 title: Product 2
 *                 price: 19.99
 *                 description: Description of Product 2
 *                 availability: false
 *       404:
 *         description: No products found for the specified category
 *       500:
 *         description: Internal Server Error
 */
router.get('/productsbycategories/:categoryId',productsController.getProductByCategoryID)


// router.put('/products/:productId',productsController.updateproduct)
// router.delete('/products/:productId',productsController.deleteproduct)


//_________________________________Routes for managing cart_____________________________________________________________

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management routes
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to the user's cart with the specified quantity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart 
 *       401:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/cart/add',tokenRequired,cartController.addToCart)

/**
 * @swagger
 * /api/cart/view:
 *   get:
 *     summary: View items in cart
 *     description: Retrieve the user's cart items along with product details
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - productId: 1
 *                 title: Product 1
 *                 price: 10.99
 *                 quantity: 2
 *               - productId: 2
 *                 title: Product 2
 *                 price: 19.99
 *                 quantity: 1
 *       500:
 *         description: Internal Server Error
 */

router.get('/cart',tokenRequired,cartController.viewCart)


/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update item quantity in cart
 *     description: Update the quantity of a product in the user's cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       404:
 *         description: Product not found in the cart
 *       500:
 *         description: Internal Server Error
 */
router.put('/cart/update',tokenRequired,cartController.updateCart)


/**
 * @swagger
 * /api/cart/delete:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a product from the user's cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Product not found in the cart
 *       500:
 *         description: Internal Server Error
 */
router.delete('/cart/remove',tokenRequired,cartController.deleteCart)


//________________________________Routes for order management__________________________________________________

/**
 * @swagger
 * tags:
 *   name: Order Management
 *   description: APIs for managing orders
 */


/**
 * @swagger
 * /api/orders/place:
 *   post:
 *     summary: Place an order
 *     description: Place an order using the items in the user's cart
 *     responses:
 *       200:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example:
 *               order_id: 1
 *               order_date: "2024-02-24T12:00:00Z"
 *       400:
 *         description: Cart is empty. Add products to your cart before placing an order.
 *       500:
 *         description: Internal Server Error
 */
router.post('/orders/place',tokenRequired,orderController.placeOrder)

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     description: Retrieve details of a specific order by its ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               order_id: 1
 *               user_id: 1
 *               order_date: "2024-02-24T12:00:00Z"
 *               items:
 *                 - product_id: 1
 *                   title: Product 1
 *                   price: 10.99
 *                   quantity: 2
 *       404:
 *         description: Order not found or does not belong to the authenticated user
 *       500:
 *         description: Internal Server Error
 */
router.get('/orders/:orderId',tokenRequired,orderController.orderDetails)


/**
 * @swagger
 * /api/orders/history:
 *   get:
 *     summary: Get order history
 *     description: Retrieve the order history for the authenticated user
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - order_id: 1
 *                 order_date: "2024-02-24T12:00:00Z"
 *                 items:
 *                   - title: Product 1
 *                     price: 10.99
 *                     quantity: 2
 *               - order_id: 2
 *                 order_date: "2024-02-25T12:00:00Z"
 *                 items:
 *                   - title: Product 2
 *                     price: 19.99
 *                     quantity: 1
 *       500:
 *         description: Internal Server Error
 */
router.get('/orderhistory',tokenRequired,orderController.ordersHistory)


module.exports=router