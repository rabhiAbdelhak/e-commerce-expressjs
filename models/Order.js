const { string } = require('joi');
const mongoose = require('mongoose');



const SingleOrderitem = mongoose.Schema({
    name: {
      type: String,
      required: true   
    },
    image :{
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
    },
    amount : {
      type: Number,
      required: true
    },
    sku: {
        type: mongoose.Types.ObjectId,
        ref: 'Sku',
        required: true
    }
})


const orderSchema = mongoose.Schema({
    tax: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    subTotal:{
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderitem],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientSecret: {
        type: String,
    },
    paymentId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'delivered', 'canceled', 'paid'],
        default: 'pending',
    }

}, {timestamps: true});


module.exports = mongoose.model('Order', orderSchema);