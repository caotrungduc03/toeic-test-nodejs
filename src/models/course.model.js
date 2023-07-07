const mongoose = require('mongoose');

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
            enum: ['Practice test', 'Vocabulary', 'Grammar'],
            required: true,
        },
        lessons: [],
        topics: [],
    },
    {
        timestamps: true,
    },
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
