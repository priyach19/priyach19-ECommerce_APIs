const {Router}=require('express')
const router=Router();
const userController=require('../controllers/usersContoller')

router.post('/register',userController.register)

router.post('/login',userController.login)



module.exports=router;