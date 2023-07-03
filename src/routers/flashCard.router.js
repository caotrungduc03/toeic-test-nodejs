const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');
const { flashCardController } = require('../controllers');
const upload = require('../middlewares/upload.middleware');

const flashCardRouter = express.Router();

flashCardRouter.use(authMiddleware);

flashCardRouter
    .route('/')
    .get(roleMiddleware(['user', 'admin']), flashCardController.getFlashCards)
    .post(
        roleMiddleware(['admin']),
        upload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'sound', maxCount: 1 },
        ]),
        flashCardController.createFlashCard,
    );

flashCardRouter
    .route('/:flashCardId')
    .get(roleMiddleware(['user', 'admin']), flashCardController.getFlashCard)
    .put(roleMiddleware(['admin']), flashCardController.updateFlashCard)
    .delete(roleMiddleware(['admin']), flashCardController.deleteFlashCard);

module.exports = flashCardRouter;
