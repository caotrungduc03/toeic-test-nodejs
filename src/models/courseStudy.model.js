const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseStudySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        group: {
            type: String,
            enum: ['practice-test', 'vocabulary', 'grammar', 'test'],
            required: true,
        },
        topics: [
            {
                topicId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                },
                progress: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        lessons: [Schema.Types.ObjectId],
    },
    {
        timestamps: true,
    },
);

const CourseStudy = mongoose.model('CourseStudy', courseStudySchema);

module.exports = CourseStudy;
