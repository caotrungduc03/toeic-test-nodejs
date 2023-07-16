const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    children: [
        {
            title: {
                type: String,
                required: true,
            },
            contents: {
                type: String,
                required: true,
            },
        },
    ],
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    orderIndex: {
        type: Number,
    },
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
