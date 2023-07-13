const express = require('express');
const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const lessonRouter = require('./lesson.router');
const questionCardRouter = require('./questionCard.router');
const courseRouter = require('./course.router');
const topicRouter = require('./topic.router');
const flashCardRouter = require('./flashCard.router');

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
        path: '/lessons',
        route: lessonRouter,
    },
    {
        path: '/questionCards',
        route: questionCardRouter,
    },
    {
        path: '/courses',
        route: courseRouter,
    },
    {
        path: '/topics',
        route: topicRouter,
    },
    {
        path: '/flash-cards',
        route: flashCardRouter,
    },
];

routes.map((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
