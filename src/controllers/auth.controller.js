const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const httpStatus = require('http-status');
const sendMail = require('../utils/sendMail');
const response = require('../utils/response');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

const register = catchAsync(async (req, res) => {
    const newUser = req.body;
    const { name, email, password, confirmPassword } = newUser;
    const fileData = req.file;

    if (!name || !email || !password || !confirmPassword) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        throw new ApiError(
            'Name, email, password and confirm password are required',
            400,
        );
    }

    if (password !== confirmPassword) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        throw new ApiError('Password and confirm password do not match', 400);
    }

    const isUserExists = await User.exists({ email });
    if (isUserExists) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        throw new ApiError('User is already exists', 400);
    }

    if (fileData) {
        const result = await cloudinary.uploader.upload(fileData?.path);
        newUser.avatar = result.secure_url;
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: newUser.avatar,
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

const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError('Missing email', httpStatus.BAD_REQUEST);
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError('User not found', httpStatus.NOT_FOUND);

    const resetToken = user.createPasswordChangedToken();

    await user.save();

    const html = `Please click the link below to change your password, this link is valid for 15 minutes. <a href=${process.env.URL_SERVER}/auth/reset-password/${resetToken}>Click here</a>`;

    const rs = await sendMail(email, html);
    return res
        .status(httpStatus.OK)
        .json(response(httpStatus.OK, 'Success', rs));
});

const resetPassword = catchAsync(async (req, res) => {
    const { password, token, confirmPassword } = req.body;

    if (!password || !token || !confirmPassword) {
        throw new ApiError('Missing inputs', httpStatus.NOT_FOUND);
    }

    const passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new ApiError('Invalid reset token', httpStatus.NOT_FOUND);

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpires = undefined;

    await user.save();

    user.password = undefined;
    user.confirmPassword = undefined;
    user.passwordChangeAt = undefined;

    return res
        .status(httpStatus.OK)
        .json(response(httpStatus.OK, 'Updated password', user));
});

const getMe = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(httpStatus.OK).json(response(httpStatus.OK, 'Success', user));
});

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe,
};
