const express = require('express');
const { authController } = require('../controllers');

const authRouter = express.Router();

authRouter.route('/register').post(authController.register);

authRouter.route('/login').post(authController.login);

authRouter.route('/forgotPassword').get(authController.forgotPassword);

authRouter.route('/resetPassword').put(authController.resetPassword);

module.exports = authRouter;
