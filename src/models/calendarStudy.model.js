const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const calendarStudySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        day: {
            type: Number,
            required: true,
        },
        cards: [Schema.Types.ObjectId],
    },
    {
        timestamps: true,
    },
);

calendarStudySchema.plugin(toJSON);

const CalendarStudy = mongoose.model('CalendarStudy', calendarStudySchema);

module.exports = CalendarStudy;
