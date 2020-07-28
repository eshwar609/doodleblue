const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema  = new Schema({
    ProductId: {
        type: String
    },
    ProductName: {
        type: String,
        trim: true
    },
    ProductDescription:{
        type: String
    },
    ProductPrice:{
        type: Number
    },
    ProductQuantity: {
        type: Number
    },
    IsAvailable: {
        type: Boolean,
        default: false
    }
}, {timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)
