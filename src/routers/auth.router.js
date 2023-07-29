const express = require('express');
const { authController, progressController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');

const authRouter = express.Router();

authRouter.route('/register').post(authController.register);

authRouter.route('/login').post(authController.login);

authRouter.route('/forgotPassword').get(authController.forgotPassword);

authRouter.route('/resetPassword').put(authController.resetPassword);

authRouter.use(authMiddleware);
authRouter.use(roleMiddleware(['user', 'admin']));

authRouter
    .route('/me/progress/courses')
    .get(progressController.getProgressCourses);

authRouter
    .route('/me/progress/lesson')
    .put(progressController.updateProgressLesson);

module.exports = authRouter;
