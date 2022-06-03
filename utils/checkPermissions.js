const { UnauthenticatedError, UnauthorizedError } = require("../errors");


const checkPermissions = (reqUser, userIdRequest) => {
    //the admin can access to all users data.
    if(reqUser.role === 'admin') return;
    //the current user can fetch and see his data.
    if(reqUser.id === userIdRequest.toString()) return;
    //if the user neither admin nor the current user. 
    throw new UnauthorizedError('you are not authorized for this action');
}

module.exports = checkPermissions