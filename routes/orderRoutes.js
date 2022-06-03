const { getAllOrders, createOrder, getSingleOrder, updateOrder, getCurrentUserOrders } = require('../controllers/orderController');
const {
    authorizedRoles,
} = require("../middleware/authentication");
const router = require('express').Router();


router.route('/').get(authorizedRoles('admin'), getAllOrders).post(createOrder);
router.route('/currentUserOrders').get(getCurrentUserOrders);
router.route('/:id').get(getSingleOrder).patch(updateOrder)







module.exports = router;