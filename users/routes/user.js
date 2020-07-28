const express = require('express');
const router = express.Router();

// const AuthMiddleware = require('../../middlewares/authmiddleware')
const auth = require('../controllers/auth')

router.post('/user/signup', auth.usersignup)
router.post('/user/login', auth.userlogin)

module.exports = router
