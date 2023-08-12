const express = require('express');
const { gameController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const gameRouter = express.Router();

gameRouter.use(authMiddleware);

gameRouter.route('/single').get(gameController.playGameSingle);

module.exports = gameRouter;
