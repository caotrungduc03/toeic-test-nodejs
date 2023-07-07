const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');
const { lessonController } = require('../controllers');

const lessonRouter = express.Router();

lessonRouter.use(authMiddleware);

lessonRouter
    .route('/')
    .get(roleMiddleware(['user', 'admin']), lessonController.getLessons)
    .post(roleMiddleware(['admin']), lessonController.createLesson);

lessonRouter
    .route('/:lessonId')
    .get(roleMiddleware(['user', 'admin']), lessonController.getLesson)
    .put(roleMiddleware(['admin']), lessonController.updateLesson)
    .delete(roleMiddleware(['admin']), lessonController.deleteLesson);

module.exports = lessonRouter;
