const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');
const { courseController } = require('../controllers');

const courseRouter = express.Router();

courseRouter.use(authMiddleware);

courseRouter
    .route('/')
    .get(roleMiddleware(['user', 'admin']), courseController.getCourses)
    .post(roleMiddleware(['admin']), courseController.createCourse);

courseRouter
    .route('/:courseId')
    .get(roleMiddleware(['user', 'admin']), courseController.getCourse)
    .put(roleMiddleware(['admin']), courseController.updateCourse)
    .delete(roleMiddleware(['admin']), courseController.deleteCourse);

module.exports = courseRouter;
