const {
    createReview,
    getAllReviews,
    getSingleReview,
    updatereview,
    deleteReview,
  } = require('../controllers/reviewController');
const router = require('express').Router();


router.route('/').get(getAllReviews).post(createReview);
router.route('/:id').get(getSingleReview).patch(updatereview).delete(deleteReview);



module.exports = router;