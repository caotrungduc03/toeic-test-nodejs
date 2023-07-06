const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const flashCardSchema = new Schema(
    {
        group: {
            type: String,
            required: true,
        },
        word: {
            type: String,
            required: true,
            trim: true,
        },
        ipa: {
            type: String,
            required: true,
            trim: true,
        },
        image: String,
        sound: String,
        texts: {
            type: String,
            required: true,
            trim: true,
        },
        hint: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

const FlashCard = mongoose.model('FlashCard', flashCardSchema);

module.exports = FlashCard;
