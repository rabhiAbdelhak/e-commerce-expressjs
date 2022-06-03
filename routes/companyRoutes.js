const router = require("express").Router();
const {
  authenticationMiddleware,
  authorizedRoles,
} = require("../middleware/authentication");
const {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

router
  .route("/")
  .get(getAllCompanies)
  .post(authenticationMiddleware, authorizedRoles("admin"), createCompany);
router
  .route("/:id")
  .get(getSingleCompany)
  .patch(authenticationMiddleware, authorizedRoles("admin"), updateCompany)
  .delete(authenticationMiddleware, authorizedRoles("admin"), deleteCompany);

module.exports = router;
