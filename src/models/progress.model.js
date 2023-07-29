const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        courses: [
            {
                courseId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                },
                group: {
                    type: String,
                    enum: ['practice-test', 'vocabulary', 'grammar'],
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
        ],
    },
    {
        timestamps: true,
    },
);

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
