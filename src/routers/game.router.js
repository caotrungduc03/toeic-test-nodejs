const express = require('express');
const { gameController } = require('../controllers');

const gameRouter = express.Router();

gameRouter.route('/single').get(gameController.playGameSingle);

module.exports = gameRouter;
