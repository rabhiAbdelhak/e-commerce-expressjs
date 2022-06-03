const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { createToken, createUserToken, checkPermissions } = require("../utils");

//get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: "user" } }).select("-password");
  res.status(StatusCodes.OK).json(users);
};

// get single user
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new NotFoundError(`The user with ID  "${id}" does not exist !`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

//show current user
const showCurrentUser = async (req, res) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user is not connected`);
  }
  res.status(StatusCodes.OK).json({ user });
  res.send("yes");
};

//update user
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError("you must provide the email and name");
  }
  const user = await User.findOne({ _id: req.user.id });
  user.name = name;
  user.email = email;
  await user.save();
  createToken(res, createUserToken(user));
  res.status(StatusCodes.OK).json(user);
};

//Update User passord
const updateUserPassword = async (req, res) => {
  const { currentPass, newPass, confirmPass } = req.body;

  if (!currentPass || !newPass || !confirmPass) {
    throw new BadRequestError("You have to provide all the fields");
  }
  const user = await User.findOne({ _id: req.user.id });
  if (user.comparePassword(currentPass)) {
    if (newPass === confirmPass) {
      user.password = newPass;
      await user.save();
      return res
        .status(StatusCodes.OK)
        .json({ msg: "password successfuly updated !" });
    }
    throw new BadRequestError("confirmation Password doesn't match");
  }
  throw new BadRequestError("wrong password");
};

//add adress to our user
const addAdress = async (req, res) => {
  const { counry, city, street } = req.body;
  const user = await User.findOne({ _id: req.user.id });
  user.adresses = [...user.adresses, req.body]
  await user.save();
  res.status(StatusCodes.CREATED).json(user);
};

//delete an adress 
const deleteAdress = async (req, res) => {
    const {id} = req.params;
    const user = await User.findOne({ _id: req.user.id });
    user.adresses = user.adresses.filter(adress => adress.id != id);
    await user.save();
    res.status(StatusCodes.OK).json(user);
}

//delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id }).select("-password");
  if (!user) {
    throw new NotFoundError("No user with id :" + { id });
  }
  res
    .status(StatusCodes.OK)
    .json({ user, msg: "the user has been seccessfuky deleted !" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  addAdress,
  deleteAdress
};
