const { Topic } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const shuffleArray = require('../utils/shuffleArray');

const getRandomAnswers = (correctAnswer, answers) => {
    const answerArr = [];
    answerArr.push(correctAnswer);
    const filterArr = answers.filter((answer) => answer !== correctAnswer);
    shuffleArray(filterArr);
    answerArr.push(...filterArr.slice(0, 3));
    shuffleArray(answerArr);

    return answerArr;
};

const playGameSingle = catchAsync(async (req, res) => {
    const { topicId } = req.query;
    const topic = await Topic.findById(topicId).populate('cards');
    if (!topic) {
        throw new ApiError('Topic not found', 404);
    }

    const { cards } = topic;
    const answers = cards.map(({ texts }) => texts);
    const newCards = cards.map((card) => {
        const { word, image, sound, texts } = card;
        const choices = getRandomAnswers(texts, answers);

        return {
            word,
            image,
            sound,
            correct: texts,
            choices,
        };
    });

    shuffleArray(newCards);

    res.status(200).json(response(200, 'Success', newCards));
});

module.exports = {
    playGameSingle,
};
