const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionCardSchema = new Schema({
    // courseName: {
    //     type: String,
    //     required: true,
    // },
    question: [
        {
            hint: {
                type: String,
            },
            image: {
                type: String,
                default: null,
            },
            sound: {
                type: String,
                default: null,
            },
            texts: {
                type: String,
                required: true,
            },
        },
    ],
    answer: [
        {
            correct: {
                type: String,
                required: true,
            },
            choices: [
                {
                    type: String,
                },
            ],
        },
    ],
    orderIndex: {
        type: Number,
    },
});

const QuestionCard = mongoose.model('QuestionCard', questionCardSchema);

module.exports = QuestionCard;
