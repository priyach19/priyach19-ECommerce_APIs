const {Router}=require('express')
const router=Router();

console.log("router loaded");

router.get('/', (req, res) => {
    res.send('Everything is ok :) check API by PostMan');
})

// ś
router.use('/users',require('./users'))
router.use('/api',require('./api'))
module.exports=router;