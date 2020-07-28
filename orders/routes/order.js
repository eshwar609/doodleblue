const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../../middleware/authmiddleware')
const order = require('../controllers/order')

router.post('/user/createorder', AuthMiddleware, order.createorder)
router.put('/user/updateorder/:orderid', AuthMiddleware, order.updateorder)

// cancel order 
router.get('/user/cancelorder/:orderid', AuthMiddleware, order.cancelorder)

// get orders list of each customer
router.get('/user/getorders', AuthMiddleware, order.getorders)

// get orders list of a customer from date 
router.get('/user/orders/productcount/:date', AuthMiddleware, order.getprcounts)

// get customers list from products
router.get('/user/orders/customerlist', order.getcustomersfromproducts)


module.exports = router
