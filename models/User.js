const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const adressSchema = mongoose.Schema({
    country: {
        type: String,
        required: [true, 'please enter your country']
      },
      city: {
          type: String,
          required: [true, 'please enter your country']
      },
      street : {
          type: String,
          required: [true, 'please enter your country']
      }
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please prodide a name !"],
      maxlength: [30, "The name must be less then 30 caracters !"],
    },
    email: {
      type: String,
      required: [true, "Please prodide an email !"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email !",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please prodvide a password"],
      minlength: [6, "the password must be more then 6 caracters !"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    adresses: [adressSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    const salt = bcrypt.genSalt(10);
    this.password = bcrypt.hashSync(this.password);
  }
});

userSchema.methods.createToken = function () {
  const { id, name, email, role } = this;
  const token = jwt.sign(
    { user: { id, name, email, role } },
    process.env.JWT_SECRET
  );
  return token;
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
