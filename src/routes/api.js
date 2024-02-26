const {Router}=require('express')
const router=Router();
const tokenRequired=require('../config/authMiddleware')
const productsController=require('../controllers/productsController')
const categoriesController=require('../controllers/categoriesController')
const cartController=require('../controllers/cartController')
const orderController=require('../controllers/ordersController')

//routes for products and categories
router.get('/categories',categoriesController.getcategories)
router.post('/products',productsController.createproducts)
router.get('/products',productsController.getproducts)
router.get('/products/:productId',productsController.getproductbyId)
router.put('/products/:productId',productsController.updateproduct)
router.delete('/products/:productId',productsController.deleteproduct)

//routes for managing cart
router.post('/cart/add',tokenRequired,cartController.addToCart)
router.get('/cart',tokenRequired,cartController.viewCart)
router.put('/cart/update',tokenRequired,cartController.updateCart)
router.delete('/cart/remove',tokenRequired,cartController.deleteCart)

//routes for managing orders
router.post('/orders/place',tokenRequired,orderController.placeOrder)
router.get('/orders/:orderId',tokenRequired,orderController.orderDetails)
router.get('/orderhistory',tokenRequired,orderController.ordersHistory)
module.exports=router