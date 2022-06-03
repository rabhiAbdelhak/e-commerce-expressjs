



const createUserToken = (user) => {
    const {_id:id, name, email, role} = user;
   return {id, name, email, role};
}

module.exports = createUserToken;