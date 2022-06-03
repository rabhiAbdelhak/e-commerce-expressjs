const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  addAdress,
  updateUser,
  deleteUser,
  updateUserPassword,
  deleteAdress
} = require("../controllers/userController");
const {
  authorizedRoles,
  authenticationMiddleware,
} = require("../middleware/authentication");

router.route("/").get(authorizedRoles("admin"), getAllUsers);
router.route("/current").get(showCurrentUser);
router.route("/addAdresses").post(addAdress);
router.route('/deleteAdress/:id').delete(deleteAdress);
router.route("/updatePassword").patch(updateUserPassword);
router
  .route("/:id")
  .get(getSingleUser)
  .patch(updateUser)
  .delete(authorizedRoles("admin"), deleteUser);

module.exports = router;
