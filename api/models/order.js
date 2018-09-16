const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    productId : {type : mongoose.Schema.Types.ObjectId , ref : "Product" , required : true},
    qty : {type : Number , required : true}
});

module.exports = mongoose.model("Order" , orderSchema);