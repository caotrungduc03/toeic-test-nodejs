const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');
const Schema = mongoose.Schema;

const questionCardSchema = new Schema(
    {
        paragraphs: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        sound: {
            type: String,
            trim: true,
        },
        texts: {
            type: String,
            trim: true,
        },
        correct: {
            type: String,
            required: true,
        },
        choices: [
            {
                type: String,
                required: true,
            },
        ],
        orderIndex: {
            type: Number,
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            require: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            require: true,
        },
    },
    {
        timestamps: true,
    },
);

questionCardSchema.plugin(toJSON);

const QuestionCard = mongoose.model('QuestionCard', questionCardSchema);

module.exports = QuestionCard;
