const router = require('express').Router();
const {
    authenticationMiddleware,
    authorizedRoles,
  } = require("../middleware/authentication");
  
const {
    createCategory,
    getAllCategories,
    getSinglecategory,
    updatecategory,
    deleteCategory,
  } = require('../controllers/categoryController');


  router.route('/').get(getAllCategories).post(authenticationMiddleware,authorizedRoles('admin'),createCategory);
  router.route('/:id').get(getSinglecategory).patch(authenticationMiddleware,authorizedRoles('admin'),updatecategory).delete(authenticationMiddleware,authorizedRoles('admin'),deleteCategory);



  module.exports = router