const jwt = require('jsonwebtoken');
const user = require('../models/user');
const shortid = require('shortid');
const config  = require('../../config/default')

const usersignup = async(req, res, next) => {
    const signupdetails= req.body || ''
    try {
        if(!signupdetails){
            res.json({
                status: false,
                message: "Invalid Details"
            })
        }
       let UserId = shortid.generate()
       const UserPresent = await user.findOne({MobileNumber : signupdetails.MobileNumber})
        if (UserPresent && UserPresent.SignUpSuccess === true) {
                res.json({
                    message: "User already present",
                    MobileNumber: UserPresent.MobileNumber,
                    SignUpSuccess: true
                })
        }
        else if (UserPresent && UserPresent.SignUpSuccess === false){
            res.json({
                message: 'Sign up failed when you are creating account',
                MobileNumber: UserPresent.MobileNumber,
                SignUpSuccess: false
            })
        }
        else if(!UserPresent) {
            // if new user - save

            let newUser = new user({
                MobileNumber: signupdetails.MobileNumber,
                Name: signupdetails.Name,
                Email: signupdetails.Email,
                Password: signupdetails.Password,
                UserId:UserId,
                SignUpSuccess: true
            }).save()

            if (!newUser) {
                res.json({
                    message: "cannot create user",
                    status: false
                })
            }
            const token = jwt.sign({UserId: UserId},config.jwtSecret, { expiresIn: "10 days"})
            res.json({
                message: 'user created',
                MobileNumber: newUser.MobileNumber,
                SignUpSuccess: true,
                jwttoken: token
            })
        } 
     
    }catch (error) {
        console.log(error)
    }
}
const userlogin = async(req, res, next) => {
    const logindetails= req.body
    try {
       const UserPresent = await user.findOne({ $and : [ { MobileNumber : logindetails.MobileNumber}, {SignUpSuccess: true} ] })
        if (!UserPresent) {
            res.json({
                message:"please create account",
                status: false
            })
        } else {
            const token = jwt.sign({UserId: UserPresent.UserId},config.jwtSecret, { expiresIn: "10 days"})
            res.json({
                userid: UserPresent.UserId,
                jwttoken: token,
                mobilenumber: UserPresent.MobileNumber,
                status: true
            })
        }
     
    }catch (error) {
        console.log(error)
    }
}


module.exports = {
    usersignup, 
    userlogin
}