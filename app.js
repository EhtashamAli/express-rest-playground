const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//routes
const productsRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');

const app = express();

mongoose.connect("mongodb+srv://ehtasham:"+ (process.env.MONGO_ATLAS_PW || "98909890" )+"@cluster0-wadqa.mongodb.net/test?retryWrites=true" ,
    { useNewUrlParser: true }).then( () => {
      console.log("Mongoose Connected...");
}).catch(err => {
  console.log(err);
});

//logs
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin" , "*");
  res.header("Access-Control-Allow-Headers" ,
             "Origin , X-Requested-With , Content-Type , Accept , Authorization"
  );
  if(req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods" , 'PUT , POST , PATCH , DELETE , GET');
    return res.status(200).json({});
  }
  next();
});
//Routes
app.use('/products' , productsRouter);
app.use('/orders' , ordersRouter);


//Error Handlers
app.use((req , res , next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error);
});

app.use((error , req , res , next) => {
    res.status(error.status || 500);
    res.json({
      Error: {
        message: error.message
      }
    });
});

module.exports = app;
