const mongoose = require('mongoose');



const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required : [true, 'please! Provide a category name'],
        unique: true,
        maxlength: [100, 'the category name must be less then 100 caracter'],
    },
    description: {
        type: String,
        default : 'A product to sell',
        maxlength : [500, 'the description must be less then 500 caracter']
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
   }
}, {timestamps: true});



module.exports = mongoose.model('Category', categorySchema);