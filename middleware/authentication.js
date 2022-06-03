const jwt = require('jsonwebtoken');
require('dotenv').config();
const {UnauthenticatedError, UnauthorizedError} = require('../errors');
const { isValidToken } = require('../utils');


const authenticationMiddleware = (req, res, next) => {
    const {token} = req.signedCookies;

    if(!token) {
      throw new UnauthenticatedError('Authentication invalid !');
    }
    try{
       const payload = isValidToken(token);
       req.user = payload.user;
       next();
    }catch(err){
        throw new UnauthenticatedError('Authentication invalid !')
    }
}

const authorizedRoles = (...roles) => {
    
    return (req, res, next) => {
        if(roles.includes(req.user.role)){
            return next()
        }
        throw new UnauthorizedError('You Can\'t access this route' )
    }
    
}


module.exports = {authenticationMiddleware,authorizedRoles}