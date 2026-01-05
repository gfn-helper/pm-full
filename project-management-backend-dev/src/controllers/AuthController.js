import bcrypt from 'bcrypt';
import tokenGenerator from '../utils/tokenGenerator.js';
import { config } from '../config/config.js';
import { sendVerificationMail } from '../services/sendVerificationMail.js';

export default class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  signup = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      let user;

      try {
        user = await this.userService.getUserByEmail(email);

        if (user.verified) {
          return next(new Error('User with the given email already exist'));
        }

        this.userService.updatePassword(email, hashedPassword);
      } catch {
        user = await this.userService.createUser(name, email, hashedPassword);
      }

      const otp = await this.userService.generateOtp(user._id);

      await sendVerificationMail(email, otp);

      res.status(200).json({
        success: true,
        message: 'User successfully registered',
      });
    } catch (err) {
      res.status(400);
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.getUserByEmail(email);
      const userVerified = user.verified;
      const isPasswordVerified = await bcrypt.compare(password, user.password);
      console.log({ user });

      if (!user) {
        return next(new Error('Account not found'));
      }

      if (!userVerified) {
        res.status(400);
        return next(new Error('Account not found'));
      }

      if (!isPasswordVerified) {
        res.status(401);
        return next(new Error('Wrong password'));
      }

      console.log(user);

      res.json({
        success: true,
        message: 'Login successful',
        accessToken: tokenGenerator(
          user._id,
          user.email,
          config.JWT_ACCESS_KEY,
          config.JWT_ACCESS_EXPIRATION,
          { email: user.email }
        ),
        refreshToken: tokenGenerator(
          user._id,
          user.email,
          config.JWT_REFRESH_KEY,
          config.JWT_REFRESH_EXPIRATION
        ),
      });
    } catch (err) {
      res.status(404);
      next(err);
    }
  };

  sendOtp = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await this.userService.getUserByEmail(email);
      const newOtp = await this.userService.generateOtp(user._id);

      await sendVerificationMail(email, newOtp);

      res.json({ success: true, message: 'Otp sent successfully' });
    } catch (err) {
      next(err);
    }
  };

  verify = async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      if (!otp || !email) {
        res.status(400);
        return next(new Error('Email or Otp is missing'));
      }

      await this.userService.verifyUser(email, otp);

      res.json({ success: true, message: 'User Verified' });
    } catch (error) {
      res.status(401);
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const newAccessToken = tokenGenerator(
        req.user._id,
        req.user.email,
        config.JWT_ACCESS_KEY,
        config.JWT_ACCESS_EXPIRATION
      );
      const newRefreshToken = tokenGenerator(
        req.user._id,
        req.user.email,
        config.JWT_REFRESH_KEY,
        config.JWT_REFRESH_EXPIRATION
      );

      console.log({ newAccessToken, newRefreshToken });

      res.json({
        success: true,
        message: 'tokens refreshed',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      res.status(401);
      next(err);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, otp, password } = req.body;

      if (!email || !otp || !password) {
        res.status(400);
        return next(new Error('One or more parameters are missing'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.userService.resetPassword(email, otp, hashedPassword);

      res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
      res.status(404);
      next(err);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const user = req.user;
      const profileImage = req.file ? req.file.filename : null;
      const { name } = req.body;

      if (profileImage) {
        user.profileImage = profileImage;
      }

      if (!name) {
        res.status(400);
        throw new Error('Name cannot be empty');
      }

      user.name = name;
      await user.save();

      res.json({ success: true, message: 'User updated successfully.' });
    } catch (err) {
      next(err);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const user = await this.userService.getUserById(req.user._id);
      const { _id, email, name, profileImage } = user;

      res.json({ success: true, result: { _id, email, name, profileImage } });
    } catch (err) {
      next(err);
    }
  };
}
