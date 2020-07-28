const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderModel  = new Schema({
    UserId: {
        type: String
    },
    // created an array of orderdetails. If user wants to create multiple orders
    OrderDetails: [{
        OrderId: {
            type: String
        },
        ProductDetails: [{
            ProductId: {
                type: String
            },
            ProductName: {
                type: String
            },
            ProductPrice: {
                type: String
            }
        }],
        OrderCancelled: {
            type: Boolean,
            default: false
        },
        OrderedDate: {
            type: String
        }
    }],
    

}, {timestamps: true })
OrderModel.index({ 'metedata': 'text', 'content': 'text' });

module.exports = mongoose.model('Order', OrderModel)
