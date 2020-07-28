const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet')
const cors = require('cors');
const user = require('./users/routes/user')
const product = require('./products/routes/product')
const order = require('./orders/routes/order')

const app = express();

app.use(helmet())

app.use(cors());

app.use((req,res,next) => {
    bodyParser.json({
        limit:'50mb',
        verify: (req,res,buf,encoding) => {
            req.rawBody = buf.toString();
        }
    })(req,res,err => {
        if(err) {
            res.status(400).send('bad body request');
            return
        }
        next();
    })
})

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended:true
}));

// mongo db connection
mongoose
    .connect("mongodb+srv://doodleblue:doodle@cluster0.jweal.mongodb.net/test", {
    useNewUrlParser: true , useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true, })
    .then(() => console.log("mongodb connected"))
    .catch(err => console.log(err));     

app.use('/api', user)
app.use('/api', product)
app.use('/api', order)

module.exports = app