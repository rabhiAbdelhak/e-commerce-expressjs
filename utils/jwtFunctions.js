const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (res, user) => {
 const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
 // atach the token to the response in order to save it as a cookie
 attachCookieToResponse(res, token);
 return  token;
}

const isValidToken = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET);
}

const attachCookieToResponse = (res, token) => {
   //calculate one day using the millis
   const oneDay = 1000*60*60*24;

   //save our cookie
   res.cookie('token', token, {
       httpOnly: true,
       expires: new Date(Date.now() + oneDay),
       secure: process.env.NODE_ENV === 'production',
       signed : true,
   })
}

module.exports = {createToken, isValidToken};