const {
  getAllProducts,
  getSingleProdut,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProductSkus,
} = require("../controllers/productController");
const {
  authenticationMiddleware,
  authorizedRoles,
} = require("../middleware/authentication");

const router = require("express").Router();

//routes
router
  .route("/")
  .get(getAllProducts)
  .post(authenticationMiddleware, authorizedRoles("admin"), createProduct);

router
  .route("/upload-image")
  .post(authenticationMiddleware, authorizedRoles("admin"), uploadImage);

router
  .route('/:id/skus')
  .get(getSingleProductSkus)

router
  .route("/:id")
  .get(getSingleProdut)
  .patch(authenticationMiddleware, authorizedRoles("admin"), updateProduct)
  .delete(authenticationMiddleware, authorizedRoles("admin"), deleteProduct);



//export router
module.exports = router;
