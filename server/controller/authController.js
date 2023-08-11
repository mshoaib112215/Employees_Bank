const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");
const { default: mongoose } = require("mongoose");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async register(req, res, next) {
    // 1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      role: Joi.string().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const { username, name, email, password, role } = req.body;

    try {
      const emailInUse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email!",
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username not available, choose another username!",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 4. password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db
    let accessToken;
    let refreshToken;

    let user;

    try {
      const userToRegister = new User({
        username,
        email,
        name,
        role,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // 6. response send

    const userDto = new UserDTO(user);

    return res.status(201).json({ user: userDto, auth: true });
  },
  async login(req, res, next) {
    // 1. validate user input
    // 2. if validation error, return error
    // 3. match username and password
    // 4. return response

    // we expect input data to be in such shape
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    // const username = req.body.username
    // const password = req.body.password

    let user;

    try {
      // match username
      user = await User.findOne({ username: username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };

        return next(error);
      }

      // match password
      // req.body.password -> hash -> match

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
  async getUsers(req, res, next) {
    // Get all users for DB
    try{
      const users = await User.find({});
      console.log(users);
      let newUsers = []
      users.map((user)=>{
        return newUsers.push(new UserDTO(user))
      })
    }
    catch(error){
      return next(error);
    }

    // Send Users data
    return res.status(200).json({ users: newUsers });
  },
  async deleteUser(req, res, next) {
    // 1. delete refresh token from db
    const employeeId = req.params.id;
    const {id} = req.body;

    // Get User Info
    const userInfo = await User.findOne({_id: id})

    if(userInfo.role !== 'admin'){
      const error = {
        status: 403,
        message: "Contact Administrator to Delete this user!",
      }
      return next(error);
    }
    JWTService.deleteRefreshToken(employeeId)

    // delete cookies
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
    }
    catch (error) {
      console.log(error)
    }
    let response;
    // Delete user form DB
    try {
      response = await User.deleteOne({ _id: employeeId })
    }
    catch (error) {
      return next(error);
    }

    // response
    res.status(200).json({ deletedCount: response.deletedCount });
  },
  async updateUser(req, res, next) {
    
    // Validating the req data using Joi

    const newData = Joi.object({
      email: Joi.string(),
      name: Joi.string(),
      role: Joi.string(),
      password: Joi.string().pattern(passwordPattern),
      confirmPassword: Joi.string().when('password', {
        is: Joi.exist(), // Check if password exists (not undefined or null)
        then: Joi.valid(Joi.ref('password')).required(),
        otherwise: Joi.optional(),
      
      }),
      id: Joi.string()
    })
    const {error}  = newData.validate(req.body)

    if(error){
      return next(error);
    }

    // 1. update user
    const userId = req.params.id;

    const { id } = req.body; // target user's id
    const { email, password, name, role, confirmPassword } = req.body

    // Checing for Admin to update it
    const userInfo = await User.findOne({ _id: userId })

    if (userInfo.role !== 'admin') {
      const error = {
        status: 403,
        message: "Contact Administrator to Edit this user!",
      }
      return next(error);
    }

    let response;
    try {
      response = await User.updateOne(
        {
          _id: id
        },
        {
          email: email,
          password: password,
          name: name,
          role: role
        });
    }
    catch (error) {
      return next(error);
    }
    // 2. response
    res.status(200).json({ modifiedCount: response.modifiedCount })

  },
  async logout(req, res, next) {
    // 1. delete refresh token from db
    const { refreshToken } = req.cookies;

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },
  async refresh(req, res, next) {
    // 1. get refreshToken from cookies
    // 2. verify refreshToken
    // 3. generate new tokens
    // 4. update db, return response

    const originalRefreshToken = req.cookies.refreshToken;

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");

      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },


};

module.exports = authController;
