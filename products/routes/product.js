const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product')

router.post('/doodle_admin/addproduct', ProductController.addoreditproduct)

module.exports = router
