const mongoose = require('mongoose');




const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide a product name'],
        maxlength: [100, 'the product name must less then 100 caracter ']
    },
    description: {
        type: String,
        required : [true, 'Write a brief description for our product'],
        maxlength: [1000, 'description must be less then 1000 caracter']
    },
    image: {
        type: String,
        default: '/uploads/exemple.jpg',
    },
    category : {
         type: mongoose.Types.ObjectId,
         ref: 'Category',
         required: [true , 'please ! Provide the product category']
    },
    company : {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: [true , 'please ! Provide the product company']
   },
   featured : {
       type: Boolean,
       default: false,
   },
    createdBy:{
         type: mongoose.Types.ObjectId,
         ref: 'User',
    },
    
}, {timestamps: true , toJSON: { virtuals: true } , toObject: {virtuals: true}});

productSchema.virtual('skus', {
    ref: 'Sku',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});

productSchema.pre('remove', async function(){
    console.log('we gonna remove the skus')
    await this.model('Sku').deleteMany({product: this._id});
});


module.exports = mongoose.model('Product' , productSchema);