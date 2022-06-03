const { required } = require('joi');
const mongoose  = require('mongoose');
const Review = require('./Review');




const SkuSchema = mongoose.Schema({
   product : {
     type: mongoose.Types.ObjectId,
     ref: 'Product',
     required: [true , 'please Select the product !']
   },
   code : {
       type: String,
       required: [true, 'make a refference to this SKU by ataching a code to it !']
   },
   name: {
       type: String,
       required: [true , 'please ! provide a name'],
       maxlength: [100 , 'the name must be less then 100 caracter'],
   },
   quantity: {
       type: Number,
       default:0
   },
   decription:{
      type: String,
      maxlength: [100, 'the description must be less then 1000 caracters'],
      default: 'desciption unavailable'
   },
   price : {
       type: Number,
       required: [true, 'please enter the price !'],
       default: 0
   },
   color : {
       type: String,
       required: [true, 'please enter the color !']
   },
   image : {
      type: String,
      default : '/uploads/exemple.js',
   },
   averageRating : {
    type: Number,
    default: 0
   },
   numOfReviews : {
       type: Number,
       default: 0,
   }
}, {tiemstamps: true, toJSON : {virtuals: true} , toObject : {virtuals: true}});

SkuSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'sku',
    justOne: false
})

SkuSchema.pre('deleteMany', async function(){
    const docs = await this.model.find(this.getFilter());
    const skus = docs.map(item => item._id);
    console.log('here we are goonna remove all the reviwes reated ', skus)
    await Review.deleteMany({ sku: { $in: skus } });
})
module.exports = mongoose.model('Sku' , SkuSchema);