const response = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
    res.status(err.status || 500).json(
        response(err.status || 500, err.message),
    );
};

module.exports = errorMiddleware;
