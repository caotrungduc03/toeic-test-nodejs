const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');
const { progressController } = require('../controllers');

const progressRouter = express.Router();

progressRouter.use(authMiddleware);
progressRouter.use(roleMiddleware(['user', 'admin']));

progressRouter.route('/courses').get(progressController.getProgressCourses);

progressRouter.route('/cards').get(progressController.getProgressCards);

progressRouter.route('/lesson').put(progressController.updateLessonStatus);

progressRouter.route('/card').put(progressController.updateCardStatus);

module.exports = progressRouter;
