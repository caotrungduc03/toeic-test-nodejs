const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const courseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        group: {
            type: String,
            enum: ['practice-test', 'vocabulary', 'grammar', 'test'],
            required: true,
        },
        lessons: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Lesson',
            },
        ],
        topics: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Topic',
            },
        ],
        orderIndex: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

courseSchema.plugin(toJSON);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
