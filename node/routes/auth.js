const express = require('express')
const router = express.Router();
const authcontroller = require('../controllers/auth')



router.post('/register', authcontroller.register)
router.post('/login', authcontroller.login)


module.exports=router;