const mongoose = require('mongoose');



const companySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please ! Provide the company name'],
        maxlength: [30 , 'the company name must be less then 30 caracter']
    },
    location: {
        type: String,
        required: [true, 'please ! provide the comapny location'],
        default: 'city'
    },
    description: {
        type: String,
        default: 'it is a company',
        maxlength :[1000 , 'the company description must be less then 1000 caracter']
    },
    createdBy : {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps : true})



module.exports = mongoose.model('Company', companySchema);