import jwt from 'jsonwebtoken';
import UserService from '../services/UserService.js';
import { config } from '../config/config.js';

async function isAuthenticated(req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.status(400);
      return next(new Error('Invalid Authorization Header'));
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(400);
      return next(new Error('Invalid Authorization Header'));
    }

    const isRefreshTokenRoute = req.originalUrl === '/auth/refresh-token'
    const refreshSecret = isRefreshTokenRoute ? config.JWT_REFRESH_KEY : config.JWT_ACCESS_KEY
    const payload = jwt.verify(token, refreshSecret)

    // let payload;
    // if (req.originalUrl === '/auth/refresh-token') {
    //   payload =  jwt.verify(token, config.JWT_REFRESH_KEY);
    // } else {

    // }

    const user = await new UserService().getUserById(payload.userId);

    if (!user) {
      return next(new Error('Invalid Token'));
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
    next(err);
  }
}

export default isAuthenticated;
