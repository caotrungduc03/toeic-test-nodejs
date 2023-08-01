const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');
const { progressController } = require('../controllers');

const progressRouter = express.Router();

progressRouter.use(authMiddleware);
progressRouter.use(roleMiddleware(['user', 'admin']));

progressRouter.route('/courses').get(progressController.getProgressCourses);

progressRouter
    .route('/cards/study')
    .get(progressController.getProgressCardsStudy)
    .put(progressController.updateCardStudyStatus);

progressRouter
    .route('/cards/review')
    .get(progressController.getProgressCardsReview)
    .put(progressController.updateCardStudyReview);

progressRouter.route('/lesson').put(progressController.updateLessonStatus);

progressRouter
    .route('/calendar')
    .get(progressController.getCalendarStudy)
    .put(progressController.updateCalendarStudy);

module.exports = progressRouter;
