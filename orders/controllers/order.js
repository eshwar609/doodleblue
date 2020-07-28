// const user = require('../models/');
const Order = require('../models/order');
const shortid = require('shortid');
const moment = require('moment');
const order = require('../models/order');

// create order
const createorder = async(req,res,next) => {
    const orderdetails = req.body || ''
    try {
        if(!orderdetails){
            res.json({
                message: 'please provide order details'
            })
        }
        let userid = req.user
        let OrderId = shortid.generate()
        let orderdate = moment().format('YYYY-MM-DD')
        let updateobj = {
            "OrderId": OrderId,
            "ProductDetails": orderdetails.ProductDetails,
            "OrderedDate": orderdate
        }
        console.log(updateobj)
        const orderdata = await Order.findOneAndUpdate(
            {
                UserId : userid
            },
            {
                $push : {
                    "OrderDetails": updateobj
                    
                }
            }, 
            {
                upsert: true, new: true
            }
            )
            if(!orderdata) {
                res.json({message: "cannot save order details", status: false})
            } else {
                res.json({orderdata,message: "order created successfully", status: true})
            }
       
    } catch(error) {
        console.log(error)
    }
}


// update order
const updateorder = async(req,res,next) => {
    const orderdetails = req.body || ''
    const orderid = req.params.orderid
    try {
        if(!orderdetails){
            res.json({
                message: 'please provide order details'
            })
        }
        let userid = req.user
        const orderdata = await Order.findOneAndUpdate(
            {
                $and : [
                    {UserId : userid},
                    {"OrderDetails.OrderId" : orderid}
                ]
                
            },
            {
                $set : {
                    "OrderDetails.$.ProductDetails": orderdetails.ProductDetails,
                    "OrderDetails.$.OrderedDate": orderdetails.OrderedDate
                    
                }
            }, 
            {
                new: true
            }
            )
            if(!orderdata) {
                res.json({message: "cannot save order details", status: false})
            } else {
                res.json({orderdata,message: "order created successfully", status: true})
            }
       
    } catch(error) {
        console.log(error)
    }
}

// cancel order
const cancelorder = async(req,res,next) => {
    const orderid = req.params.orderid
    try {
        let userid = req.user
        const orderdata = await Order.findOneAndUpdate(
            {
                $and : [
                    {UserId : userid},
                    {"OrderDetails.OrderId" : orderid}
                ]
                
            },
            {
                $set : {
                    "OrderDetails.$.OrderCancelled": true
                    
                }
            }, 
            {
                new: true
            }
            )
            if(!orderdata) {
                res.json({message: "cannot cancel order details", status: false})
            } else {
                res.json({orderdata,message: "order cancelled successfully", status: true})
            }
       
    } catch(error) {
        console.log(error)
    }
}



// get orders list for a customer
const getorders = async(req,res,next) => {
    try {
        let userid = req.user
        const orderdata = await Order.findOne({UserId: userid})
        if(!orderdata) {
            res.json({message: "cannot get order details", status: false})
        } else {
            res.json({orderdata, status: true})
        }
       
    } catch(error) {
        console.log(error)
    }
}


// get products count from a given date
const getprcounts = async(req,res,next) => {
    let specifieddate = req.params.date
    try {
        let userid = req.user
        const orderdata = await Order.aggregate([
            {
                $match : {
                    $and : [
                        { UserId: userid },
                        {"OrderDetails.OrderedDate": specifieddate }
                    ]
                }
                
            },
            { $unwind : "$OrderDetails"},
            {
                $match : {
                    $and : [
                        { UserId: userid },
                        {"OrderDetails.OrderedDate": specifieddate }
                    ]
                }
                
            },
            { 
                $group: { 
                    _id: "$UserId", 
                    'sum': { $sum: { $size : "$OrderDetails.ProductDetails" }} 
                }
            }
                    
            ])
        if(!orderdata) {
            res.json({message: "cannot get count of product details", status: false})
        } else {
            res.json({orderdata, status: true})
        }
       
    } catch(error) {
        console.log(error)
    }
}


// list customers based on product purchased
const getcustomersfromproducts = async(req,res,next) => {
    try {
        const orderdata = await Order.aggregate([
            { 
                $project: { 
                    "OrderDetails.ProductDetails.ProductName": 1,
                    "UserId": 1
                } 
                
            }, 
            { $unwind: '$OrderDetails' },
            {
                $group : {
                    _id:  "$_id",
                    productname: { $addToSet: "$OrderDetails.ProductDetails.ProductName"},
                    UserId: { $first: '$UserId'}
                }
            },
            {$group: {
                _id: {
                    productname: "$productname",
                    UserId: "$UserId"
                },
                count: {$sum: 1}
            }}
                    
            ])
        if(!orderdata) {
            res.json({message: "cannot get count of product details", status: false})
        } else {
            res.json({orderdata, status: true})
        }
       
    } catch(error) {
        console.log(error)
    }
}
module.exports = {
   createorder,
   updateorder,
   cancelorder,
   getorders,
   getprcounts,
   getcustomersfromproducts
}