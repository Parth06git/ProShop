import User from "../models/UserModel.js";
import AppError from "../utils/appError.mjs";
import catchAsync from "../utils/catchAsync.mjs";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const createToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const sendToken = (user, statusCode, res) => {
  const token = createToken(user._id);

  // sending token as Cookie
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  };
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  // This works like it change password to undefined but this action doesn't save in db because we haven't use user.save()

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

const userController = {
  // @desc    Auth token and get token
  // @route   POST /api/users/login
  // @access  Public
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Email and Password exist
    if (!email || !password) {
      return next(new AppError("Please Enter Email and Password", 400));
    }

    // 2) User exist && password is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.matchPassword(password, user.password))) {
      return next(new AppError("Invalid Email or Password", 401));
    }

    // 3) if everything is ok, send token to client
    sendToken(user, 200, res);
  }),

  // @desc    Register a user
  // @route   POST /api/users/signup
  // @access  Public
  signUp: catchAsync(async (req, res) => {
    const newUser = await User.create(req.body);
    sendToken(newUser, 201, res);
  }),

  // @desc    LogOut user
  // @route   Get /api/users/logout
  // @access  Private
  logOut: catchAsync(async (req, res) => {
    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  }),

  // @desc    Is login or not
  // @route   middleware
  // @access  Private
  protect: catchAsync(async (req, res, next) => {
    // 1) get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("You are not logged in! Please log in to get access", 401));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exists
    const freshUser = await User.findById(decoded._id);
    if (!freshUser) {
      next(new AppError("The user belonging to this user does no longer exist", 401));
    }

    // 4) check user change password after token was issued
    if (freshUser.changePasswordAfter(decoded.iat)) {
      next(new AppError("Password is changed! Please login again.", 401));
    }

    req.user = freshUser;
    res.locals.user = freshUser;
    next();
  }),

  // @desc    Get user profile
  // @route   Get /api/users/profile
  // @access  Private
  getUserProfile: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("No user found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  }),

  // @desc    Update user profile
  // @route   PATCH /api/users/profile
  // @access  Private
  updateUserProfile: catchAsync(async (req, res, next) => {
    // 1) error if user try to update password
    if (req.body.password) {
      return next(
        new AppError("This route is not for password update! Please user /updateMyPassword", 400)
      );
    }
    // We can't use save() so we will use findByIdAndUpdate

    // 2) Filtered Out unwanted object
    const filteredBody = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) update user document
    const updateUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updateUser,
      },
    });
  }),

  // @desc    Update user password
  // @route   Patch /api/users/profile/password
  // @access  Private
  updateUserPassword: catchAsync(async (req, res, next) => {
    // 1) Get user
    const user = await User.findById(req.user._id).select("+password");

    // 2) check if posted current password is correct
    if (!(await user.matchPassword(req.body.currentPassword, user.password))) {
      return next(new AppError("Current password is incorrect", 400));
    }

    // 3) update password
    user.password = req.body.newPassword;
    await user.save();

    // 4) Log user in
    sendToken(user, 200, res);
  }),

  // @desc    Delete user profile
  // @route   DELETE /api/users/profile
  // @access  Private
  deleteUserProfile: catchAsync(async (req, res, next) => {
    // 1) Get user
    const user = await User.findById(req.user._id).select("+password");

    // 2) check if posted current password is correct
    if (!(await user.matchPassword(req.body.currentPassword, user.password))) {
      return next(new AppError("Current password is incorrect", 400));
    }

    // 3) update password
    await User.findByIdAndDelete(req.user._id);
    res.status(204).json({ data: null });
  }),

  // @desc    Get all users
  // @route   Get /api/users
  // @access  Private (admin)
  getAllUsers: catchAsync(async (req, res, next) => {
    if (req.user.isAdmin) {
      const users = await User.find();

      res.status(200).json(users);
    } else {
      return next(new AppError("You are not allowed to perform this action!", 403));
    }
  }),

  // @desc    Get a users
  // @route   Get /api/users/:id
  // @access  Private (admin)
  getUser: catchAsync(async (req, res, next) => {
    if (req.user.isAdmin) {
      const user = await User.findById(req.params.id);
      if (!user) return next(new AppError("User not found with this id", 404));
      res.status(200).json(user);
    } else {
      return next(new AppError("You are not allowed to perform this action!", 403));
    }
  }),

  // @desc    update a users
  // @route   PATCH /api/users/:id
  // @access  Private (admin)
  updateUser: catchAsync(async (req, res) => {
    if (req.user.isAdmin) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).json(user);
    } else {
      return next(new AppError("You are not allowed to perform this action!", 403));
    }
  }),

  // @desc    Delete a user
  // @route   Delete /api/users/:id
  // @access  Private (admin)
  deleteUser: catchAsync(async (req, res) => {
    if (req.user.isAdmin) {
      await User.findByIdAndDelete(req.params.id);

      res.status(204).json({ data: null });
    } else {
      return next(new AppError("You are not allowed to perform this action!", 403));
    }
  }),
};

export default userController;
