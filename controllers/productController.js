const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");
const path = require("path");
const Sku = require("../models/Sku");

//get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find()
  .populate({ path: "company", select: "name location" })
  .populate({ path: "category" , select: 'name description'})
  .populate('skus');
  res.status(StatusCodes.OK).json(products);
};

//create product
const createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body, createBy: req.user.id });
  res.status(StatusCodes.CREATED).json(product);
};

//get single products
const getSingleProdut = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id })
    .populate({ path: "company", select: "name location" })
    .populate({ path: "category" , select: 'name description'})
    .populate('skus');
  if (!product) {
    throw new NotFoundError("No item found with ID :" + id);
  }
  res.status(StatusCodes.OK).json(product);
};

//update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError("No item found with ID :" + id);
  }
  res.status(StatusCodes.OK).json(product);
};

//delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError("No item found with ID :" + id);
  }
  await product.remove()
  res.status(StatusCodes.OK).json(product);
};

//upload image
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No Image Uploaded !");
  }
  const productImage = req.files.image;
  console.log(productImage);
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("the file uploaded is not image");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + productImage.name
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: "/uploads/" + productImage.name });
};

const getSingleProductSkus = async (req, res) => {
  const {id : productID} = req.params;
  const skus = await Sku.find({product : productID});
  res.status(StatusCodes.OK).json({skus, count: skus.length});
}

module.exports = {
  getAllProducts,
  getSingleProdut,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProductSkus
};
