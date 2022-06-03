const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Review = require("../models/Review");
const Sku = require("../models/Sku");
const User = require("../models/User");
const { checkPermissions } = require("../utils");

//create review
const createReview = async (req, res) => {
  const {sku : skuID} = req.body
  const {id : userID} = req.user
  const isvalidSku = await Sku.findOne({_id: skuID});

  if(!isvalidSku){
      throw new NotFoundError('No SKU for ID : ' + skuID);
  }
  const AlreadySubmitted = await Review.findOne({sku : skuID, user: userID});

  if(AlreadySubmitted){
      throw new BadRequestError('Review Already submitted');
  }

  const review = await Review.create({...req.body, user: userID});

  res.status(StatusCodes.CREATED).json(review);
};

//get all reviews
const getAllReviews = async (req, res) => {
    const reviews = await Review.find().populate({path: 'sku', select: 'name description color'});

    res.status(StatusCodes.OK).json(reviews)
};

//get single review
const getSingleReview = async (req, res) => {
    const {id: reviewID} = req.params;

    const review = await Review.findOne({_id: reviewID});
    if(!review) {
        throw new NotFoundError('No Review with ID: '+ reviewID);
    }
    res.status(StatusCodes.OK).json(review);
};

//update review
const updatereview = async (req, res) => {
    const {id: reviewID} = req.params;
    const {id : userID} = req.user;
    const {comment, rating, title} = req.body;
    const review = await Review.findOne({_id: reviewID});
    if(!review) {
        throw new NotFoundError('No review with ID : ' + reviewID);
    }
    checkPermissions(req.user, review.user); 
    review.comment = comment;
    review.rating = rating;
    review.title = title;
    await review.save();
    res.status(StatusCodes.OK).json({review});
};

//delete review
const deleteReview = async (req, res) => {
  const {id: reviewID} = req.params;
  const {id : userID} = req.user;
  const review = await Review.findOne({_id: reviewID})
  if(!review){
      throw new NotFoundError('No review with ID : ' + reviewID);
  }
  checkPermissions(req.user, review.user); 
  await review.remove();
  res.status(StatusCodes.OK).json({msg : 'review removed'});
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updatereview,
  deleteReview,
};
