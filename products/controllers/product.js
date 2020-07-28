const Product = require('../models/product');
const shortid = require('shortid');

const addoreditproduct = async(req,res,next) => {
    const productdata = req.body || ''
    try {
        if(!productdata){
            res.json({
                message: 'please provide product details'
            })
        }
        let ProductId = shortid.generate()
        const productdetail = await Product.findOneAndUpdate(
            { ProductName: productdata.ProductName },
            {
                $set: {
                    ProductId: ProductId,
                    ProductDescription: productdata.ProductDescription,
                    ProductPrice: productdata.ProductPrice,
                    ProductQuantity:productdata.ProductQuantity,
                    IsAvailable: productdata.IsAvailable
                }
            }, 
            {
                upsert: true, new:true
            }
        )
        if(!productdetail) {
            res.json({message: "cannot update product details", status: false})
        } else {
            res.json({productdetail, message: "product updated successfully", status: true})
        }
    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    addoreditproduct
}