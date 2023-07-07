const express = require('express');
const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const flashCardRouter = require('./flashCard.router');
const topicRouter = require('./topic.router');
const courseRouter = require('./course.router');

const router = express.Router();

const routes = [
    {
        path: '/users',
        route: userRouter,
    },
    {
        path: '/auth',
        route: authRouter,
    },
    {
        path: '/flash-cards',
        route: flashCardRouter,
    },
    {
        path: '/topics',
        route: topicRouter,
    },
    {
        path: '/courses',
        route: courseRouter,
    },
];

routes.map((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
