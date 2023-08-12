const { FlashCard, Topic, CardStudy, Course } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const getFlashCards = catchAsync(async (req, res) => {
    const flashCards = await FlashCard.find().populate(['course', 'topic']);

    res.status(200).json(response(200, 'Success', flashCards));
});

const getFlashCard = catchAsync(async (req, res) => {
    const { flashCardId } = req.params;
    const flashCard = await FlashCard.findById(flashCardId).populate([
        'course',
        'topic',
    ]);

    if (!flashCard) {
        throw new ApiError('Flash card not found', 404);
    }

    res.status(200).json(response(200, 'Success', flash));
});

const createFlashCard = catchAsync(async (req, res) => {
    const rawFlashCard = req.body;
    const { word, ipa, texts, topicName, courseName } = rawFlashCard;

    if (!word || !ipa || !texts || !topicName || !courseName) {
        throw new ApiError(
            'Word, ipa, texts, topic name and course name are required',
            400,
        );
    }

    const course = await Course.findOne({ name: courseName });
    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    const topic = await Topic.findOne({
        name: topicName,
        course: course._id,
    });

    if (!topic) {
        throw new ApiError('Topic not found', 404);
    }

    const isExists = await FlashCard.exists({ word });
    if (isExists) {
        throw new ApiError('Flash card is already exists', 400);
    }

    delete rawFlashCard.topicName;
    delete rawFlashCard.courseName;

    const flashCard = await FlashCard.create({
        ...rawFlashCard,
        topic: topic._id,
        course: course._id,
    });

    topic.cards.push(flashCard._id);
    await topic.save();

    res.status(201).json(response(201, 'Created', flashCard));
});

const updateFlashCard = catchAsync(async (req, res) => {
    const { flashCardId } = req.params;
    const rawFlashCard = req.body;
    const { topicName } = rawFlashCard;

    const topic = await Topic.findOne({ name: topicName });
    if (!topic) {
        throw new ApiError('Topic not found', 404);
    }

    const updatedFlashCard = await FlashCard.findByIdAndUpdate(
        flashCardId,
        {
            ...rawFlashCard,
            topic: topic._id,
            course: topic.course,
        },
        {
            new: true,
        },
    );

    if (!updatedFlashCard) {
        throw new ApiError('Flash card not found', 404);
    }

    res.status(200).json(response(200, 'Updated', updatedFlashCard));
});

const deleteFlashCard = catchAsync(async (req, res) => {
    const { flashCardId } = req.params;
    const deletedFlashCard = await FlashCard.findByIdAndDelete(flashCardId);

    if (!deletedFlashCard) {
        throw new ApiError('Flash card not found', 404);
    }

    await Promise.all([
        Topic.findByIdAndUpdate(deletedFlashCard.topic, {
            $pull: {
                cards: flashCardId,
            },
        }),
        CardStudy.deleteMany({
            cardId: flashCardId,
        }),
    ]);

    res.status(200).json(response(200, 'Deleted', deletedFlashCard));
});

module.exports = {
    getFlashCards,
    getFlashCard,
    createFlashCard,
    updateFlashCard,
    deleteFlashCard,
};
