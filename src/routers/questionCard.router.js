const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');
const { questionCardController } = require('../controllers');

const questionCardRouter = express.Router();

questionCardRouter.use(authMiddleware);

questionCardRouter
    .route('/')
    .get(
        roleMiddleware(['user', 'admin']),
        questionCardController.getQuestionCards,
    )
    .post(roleMiddleware(['admin']), questionCardController.createQuestionCard);

questionCardRouter
    .route('/:questionCardId')
    .get(
        roleMiddleware(['user', 'admin']),
        questionCardController.getQuestionCard,
    )
    .put(roleMiddleware(['admin']), questionCardController.updateQuestionCard)
    .delete(
        roleMiddleware(['admin']),
        questionCardController.deleteQuestionCard,
    );

module.exports = questionCardRouter;
