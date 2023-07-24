const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const response = require('../utils/response');

const register = catchAsync(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        throw new ApiError(
            'Name, email, password and confirm password are required',
            400,
        );
    }

    if (password !== confirmPassword) {
        throw new ApiError('Password and confirm password do not match', 400);
    }

    const isUserExists = await User.exists({ email });
    if (isUserExists) {
        throw new ApiError('User is already exists', 400);
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    user.password = undefined;

    res.status(201).json(response(201, 'Created', user));
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError('Email or password is incorrect', 400);
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
        throw new ApiError('Email or password is incorrect', 400);
    }

    const accessToken = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    );

    res.status(200).json(response(200, 'Success', accessToken));
});

module.exports = {
    register,
    login,
};
