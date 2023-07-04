const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');
const { topicController } = require('../controllers');

const topicRouter = express.Router();

topicRouter.use(authMiddleware);

topicRouter
    .route('/')
    .get(roleMiddleware(['user', 'admin']), topicController.getTopics)
    .post(roleMiddleware(['admin']), topicController.createTopic);

topicRouter
    .route('/:topicId')
    .get(roleMiddleware(['user', 'admin']), topicController.getTopic)
    .put(roleMiddleware(['admin']), topicController.updateTopic)
    .delete(roleMiddleware(['admin']), topicController.deleteTopic);

module.exports = topicRouter;
