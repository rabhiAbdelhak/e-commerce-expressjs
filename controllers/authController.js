const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request");
const { createToken, createUserToken } = require("../utils");

//register
const register = async (req, res) => {
  //make the role always 'user' in order to avoid all tentatives of admin creation
  const firstUser = (await User.countDocuments()) === 0;
  console.log(firstUser);
  const role = firstUser ? "admin" : "user";
  const user = await User.create({ ...req.body, role });
  const token = createToken(res , createUserToken(user));
  const oneHour = 1000 * 60 * 60;
  res.status(StatusCodes.CREATED).json({ user, token });
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please! provide  email and  password");
  }
  //find the user with his email
  const user = await User.findOne({ email });
  if (user) {
    //compare passwords using the method added to userSchema
    if (user.comparePassword(password)) {
      const token = createToken(res, createUserToken(user));
      //save the token as a cookie
      res.status(StatusCodes.OK).json({ user, token });
    } else {
      //generate a bad request error if the password is wrong
      throw new BadRequestError("Wrong Password !");
    }
  } else {
    //generate a bad request error if the email does not exist in the database.
    throw new BadRequestError("This User does not exist !");
  }
};

//logout
const logout = (req, res) => {
  res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now() + 5*1000),
  });
  res.json({msg: 'User logged out !'});
};


module.exports = { register, login, logout };
