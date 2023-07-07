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

// const InformationCard = {
//     _id: '611220911e6e0c7cbe105835',
//     title: 'Lesson 1: Predict what you will hear',
// 	group: 'part-1-photos',
//     children: [
//         {
//             title: '1. Question type',
//             content: [
//                 'In this part, you are asked to see a picture and choose the statement that most describes the picture. To be able to choose the correct answer, you should think of the topic of the picture and possible statements.',
//             ],
//         },
//         {
//             title: '2. Guide to answer',
//             content:  [
//                 'Before the beginning of the section, think of the theme of the picture as well as brainstorm nouns and verbs related to the picture. You should do this because most distractors in the TOEIC part 1 involve the wrong noun or verb.',
// 				'Before listening, you also should predict possible statements. Most statements are about',
// 			],
// 		},
//     ],
// };
