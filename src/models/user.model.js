const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        avatar: {
            type: String,
            default: 'https://static.thenounproject.com/png/5034901-200.png',
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
        birthday: {
            type: String,
            trim: true,
        },
        password: {
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

userSchema.plugin(toJSON);

userSchema.pre('save', async function (next) {
    const user = this;

    try {
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 7);
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
