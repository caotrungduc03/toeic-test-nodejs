const express = require('express');
const { importController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middlleware');

const importRouter = express.Router();

importRouter.use(authMiddleware);
importRouter.use(roleMiddleware(['admin']));

importRouter.route('/').post(importController.importArray);

module.exports = importRouter;
