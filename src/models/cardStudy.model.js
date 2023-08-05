const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const cardStudySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        cardId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        topicId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        type: {
            type: String,
            enum: ['flash-card', 'question-card'],
            required: true,
        },
        status: {
            type: String,
            enum: ['0', '1', '2'],
            default: '0',
        },
        review: {
            type: String,
            enum: ['0', '1', '2', '3'],
            default: '0',
        },
    },
    {
        timestamps: true,
    },
);

cardStudySchema.plugin(toJSON);

const CardStudy = mongoose.model('CardStudy', cardStudySchema);

module.exports = CardStudy;
