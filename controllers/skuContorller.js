const Sku = require('../models/Sku');
const {StatusCodes} = require('http-status-codes');
const { NotFoundError } = require('../errors');
const Product = require('../models/Product');
const Review = require('../models/Review');


//create category
const createSku = async (req, res) => {
  const {product: productID} = req.body
  const {id: userID} = req.user
  const isvalidproduct = await Product.findOne({_id: productID});
  if(!isvalidproduct){
      throw new NotFoundError('No Product for ID : ' + productID);
  }
  const sku = await  Sku.create({...req.body, createdBy: userID});
  res.status(StatusCodes.CREATED).json({sku});
};

//get all categories
const getAllSkus = async (req, res) => {
  const skus = await Sku.find().populate({path: 'product', select : 'name desription'}).populate('reviews');
  res.status(StatusCodes.OK).json(skus);
};

//get  single category
const getSingleSku = async (req, res) => {
  const {id} = req.params
  const sku = await Sku.findOne({_id : id}).populate('reviews');
  if(!sku){
      throw new NotFoundError('No item found with id :'+{id})
  }
  res.status(StatusCodes.OK).json(sku);
};

//update category
const updateSku = async (req, res) => {
    const {id} = req.params
    const sku = await Sku.findOneAndUpdate({_id : id}, req.body, {
        new: true,
        runValidator: true
    });
    if(!sku){
        throw new NotFoundError('No item found with id :'+{id})
    }
    res.status(StatusCodes.OK).json(sku);
};

//delete Category
const deleteSku = async (req, res) => {
    const {id} = req.params
    const sku = await Sku.findOne({_id : id});
    if(!sku){
        throw new NotFoundError('No item found with id :'+{id});
    }
    await sku.remove();
    res.status(StatusCodes.OK).json(sku);
};

const uploadImage = (req, res) => {
   res.send('upload image of a sku');
}

//get sinlge skus reviews
const getsingleSkuReviews = async (req, res) => {
  const {id : productID} = req.params;
  const reviews = await Review.find({product : productID}).populate({path: 'user', select: 'name email'});
  res.status(StatusCodes.OK).json({reviews, count: reviews.length});
}
module.exports = {
  createSku,
  getAllSkus,
  deleteSku,
  updateSku,
  getSingleSku,
  uploadImage,
  getsingleSkuReviews
};
