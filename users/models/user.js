const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    UserId: {
        type: String
    },
    Name: {
        type: String
    },
    Email:{
        type: String,
        unique: true
    },
    Password: {
        type: String
    },
    MobileNumber: {
        type: String,
        unique:true
    },
    SignUpSuccess : {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true });

 
module.exports = mongoose.model('user', UserSchema);
