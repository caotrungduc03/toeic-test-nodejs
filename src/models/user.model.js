const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        avatar: {
            type: String,
            default: 'avatar-default.jpg',
        },
        name: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            select: false,
        },
        confirmPassword: {
            type: String,
            required: true,
            trim: true,
            select: false,
        },
        passwordChangeAt: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    const user = this;

    try {
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 7);
        }
        if (user.isModified('confirmPassword')) {
            user.confirmPassword = await bcrypt.hash(user.confirmPassword, 7);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods = {
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex');

        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

        return resetToken;
    },
};

const User = mongoose.model('User', userSchema);

module.exports = User;
