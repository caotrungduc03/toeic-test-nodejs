const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const flashCardSchema = new Schema(
    {
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
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        orderIndex: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

const FlashCard = mongoose.model('FlashCard', flashCardSchema);

module.exports = FlashCard;
