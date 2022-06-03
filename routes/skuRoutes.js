const {
    createSku,
    getAllSkus,
    deleteSku,
    updateSku,
    getSingleSku,
    uploadImage,
    getsingleSkuReviews
} =  require('../controllers/skuContorller');

const {
  authenticationMiddleware,
  authorizedRoles,
} = require("../middleware/authentication");


const router = require('express').Router();

//routes
router
  .route("/")
  .get(getAllSkus)
  .post(authenticationMiddleware, authorizedRoles("admin"), createSku);

router
  .route("/upload-image")
  .post(authenticationMiddleware, authorizedRoles("admin"), uploadImage);

router
  .route("/:id")
  .get(getSingleSku)
  .patch(authenticationMiddleware, authorizedRoles("admin"), updateSku)
  .delete(authenticationMiddleware, authorizedRoles("admin"), deleteSku);

router.route('/:id/reviews').get(getsingleSkuReviews);

//export router
module.exports = router;




