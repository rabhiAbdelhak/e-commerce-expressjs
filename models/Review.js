const mongoose = require("mongoose");
const Sku = require("./Sku");

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      max: 5,
      min: 1,
      required: [true, "Please rate the product"],
    },
    title: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      maxlength: [1000, "comments must be less then 1000 caracters"],
      minlegth: [3, "comments must be more then 3 caracters"],
      required: [true, "please ! fill the comment area"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sku: {
      type: mongoose.Types.ObjectId,
      ref: "Sku",
      required: [true, "Please provide a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ sku: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function(skuID){

  const result = await this.aggregate([
    { $match: { sku: skuID } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try{
    const {averageRating, numOfReviews} = result[0];
    await this.model('Sku').findOneAndUpdate({_id: skuID}, {averageRating, numOfReviews})
  }catch(error){
      console.log(error.message)
  }
  console.log(result, 'from there');
};

reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.sku);
  });

reviewSchema.pre("remove", async function () {
    await this.constructor.calculateAverageRating(this.sku);
});

module.exports = mongoose.model("Review", reviewSchema);
