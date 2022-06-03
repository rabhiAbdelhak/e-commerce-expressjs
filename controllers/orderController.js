const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Sku = require("../models/Sku");
const Order = require('../models/Order');
const { checkPermissions } = require("../utils");
const { find } = require("../models/Sku");


//Fake Stripe Api
const FakeStripeApi = ({ amount, currency }) => {
  const client_secret =
    "a fake client secret to use it as the given secret for a stripe payment";
  return { client_secret, amount };
};

//create order
const createOrder = async (req, res) => {
  const { items: CartItems, tax, shippingFee } = req.body;
  if (CartItems.length < 1) {
    throw new BadRequestError("No Cart items Provided !");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("Please provide Tax And Shipping fee");
  }
  let orderItems = [];
  let subTotal = 0;
  for (item of CartItems) {
    const sku = await Sku.findOne({ _id: item.sku });
    if (!sku) {
      throw new NotFoundError("No Sku with ID : " + item.sku);
    }
    const { name, image, price, _id } = sku;
    //create a d=single rder item
    const SingleOrderItem = {
      amount: item.amount,
      name,
      image,
      price,
      sku: _id,
    };

    //add the item to orderitems
    orderItems = [...orderItems, SingleOrderItem];
    subTotal += price * item.amount;
  }

  //calculate total
  const total = tax + shippingFee + subTotal;
  //calculate client secret for stripe payment
  const paymentIntent = FakeStripeApi({
    amount: total,
    currency: "usd",
  });

  //create the order 
  const order = await Order.create({
    orderItems,
    tax,
    shippingFee,
    subTotal,
    total,
    clientSecret: paymentIntent.client_secret,
    user: req.user.id,
  });
  res.status(StatusCodes.CREATED).json({order});
};

//get All orders
const getAllOrders = async (req, res) => {
    const orders = await Order.find().select('total');
    res.status(StatusCodes.OK).json({orders, count: orders.length})
};
  

//get single order
const getSingleOrder = async (req, res) => {
  const {id: orderID} = req.params
  const order = await Order.findOne({_id: orderID});
  if(!order){
      throw new NotFoundError('No prder ith ID: '+ orderID);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({order})};

//get current user orders
const getCurrentUserOrders = async (req, res) => {
    const {id : userID} = req.user
    const orders = await Order.find({user: userID});
    res.status(StatusCodes.OK).json({orders, count: orders.length});
};

//update order
const updateOrder = async (req, res) => {
    const {id: orderID} = req.params
    const {paymentIntentId} = req.body;
    const order = await Order.findOne({_id: orderID});
    if(!order){
        throw new NotFoundError('No prder ith ID: '+ orderID);
    }
    checkPermissions(req.user, order.user);
    order.status = 'paid'
    order.paymentId = paymentIntentId;
    await order.save();
    res.status(StatusCodes.OK).json({order});
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrentUserOrders,
};
