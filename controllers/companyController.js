const Company = require('../models/Company');
const {StatusCodes} = require('http-status-codes');
const { NotFoundError } = require('../errors');


//create category
const createCompany = async (req, res) => {
  const company = await  Company.create({...req.body, createdBy: req.user.id});
  res.status(StatusCodes.CREATED).json({company});
};

//get all categories
const getAllCompanies = async (req, res) => {
  const companies = await Company.find();
  res.status(StatusCodes.OK).json(companies);
};

//get  single category
const getSingleCompany = async (req, res) => {
  const {id} = req.params
  const company = await Company.findOne({_id : id}).populate({path: 'createdBy', select: ['name', 'email', 'adress']});
  if(!company){
      throw new NotFoundError('No item found with id :'+ id)
  }
  res.status(StatusCodes.OK).json(company);
};

//update category
const updateCompany = async (req, res) => {
    const {id} = req.params
    const company = await Company.findOneAndUpdate({_id : id}, req.body, {
        new: true,
        runValidator: true
    });
    if(!company){
        throw new NotFoundError('No item found with id :'+ id)
    }
    res.status(StatusCodes.OK).json(company);
};

//delate Category
const deleteCompany = async (req, res) => {
    const {id} = req.params
    const company = await Company.findOneAndDelete({_id : id});
    if(!company){
        throw new NotFoundError('No item found with id :'+ id);
    }
    res.status(StatusCodes.OK).json(company);
};

module.exports = {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
};
