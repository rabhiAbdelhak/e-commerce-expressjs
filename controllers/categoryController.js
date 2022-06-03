const Category = require('../models/Category');
const {StatusCodes} = require('http-status-codes');
const { NotFoundError } = require('../errors');


//create category
const createCategory = async (req, res) => {
  console.log(req.user);
  const category = await  Category.create({...req.body, createdBy: req.user.id});
  res.status(StatusCodes.CREATED).json({category});
};

//get all categories
const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(StatusCodes.OK).json(categories);
};

//get  single category
const getSinglecategory = async (req, res) => {
  const {id} = req.params
  const category = await Category.findOne({_id : id});
  if(!category){
      throw new NotFoundError('No item found with id :'+{id})
  }
  res.status(StatusCodes.OK).json(category);
};

//update category
const updatecategory = async (req, res) => {
    const {id} = req.params
    const category = await Category.findOneAndUpdate({_id : id}, req.body, {
        new: true,
        runValidator: true
    });
    if(!category){
        throw new NotFoundError('No item found with id :'+{id})
    }
    res.status(StatusCodes.OK).json(category);
};

//delate Category
const deleteCategory = async (req, res) => {
    const {id} = req.params
    const category = await Category.findOneAndDelete({_id : id});
    if(!category){
        throw new NotFoundError('No item found with id :'+{id});
    }
    res.status(StatusCodes.OK).json(category);
};

module.exports = {
  createCategory,
  getAllCategories,
  getSinglecategory,
  updatecategory,
  deleteCategory,
};
