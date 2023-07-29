const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionCardSchema = new Schema(
    {
        paragraphs: {
            type: String,
        },
        children: [
            {
                question: {
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
                        trim: true,
                    },
                },
                answer: {
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
                },
            },
        ],
        orderIndex: {
            type: Number,
        },
        topic: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Topic',
                require: true,
            },
        ],
        course: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                require: true,
            },
        ],
    },
    {
        timestamps: true,
    },
);

const QuestionCard = mongoose.model('QuestionCard', questionCardSchema);

module.exports = QuestionCard;
