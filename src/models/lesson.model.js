const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
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
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
