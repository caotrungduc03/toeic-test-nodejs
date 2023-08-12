const catchAsync = require('../utils/catchAsync');
const { QuestionCard, Topic, CardStudy, Course } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const response = require('../utils/response');

const getQuestionCards = catchAsync(async (req, res) => {
    const questionCards = await QuestionCard.find()
        .populate({
            path: 'topic',
            select: 'name',
        })
        .populate({
            path: 'course',
            select: 'name',
        });

    res.status(httpStatus.OK).json(
        response(httpStatus.OK, 'Success', questionCards),
    );
});

const getQuestionCard = catchAsync(async (req, res) => {
    const { questionCardId } = req.params;

    const questionCard = await QuestionCard.findById(questionCardId)
        .populate({
            path: 'topic',
            select: 'name',
        })
        .populate({
            path: 'course',
            select: 'name',
        });
    if (!questionCard) {
        throw new ApiError('QuestionCard not found!', httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK).json(
        response(httpStatus.OK, 'Success', questionCard),
    );
});

const createQuestionCard = catchAsync(async (req, res) => {
    const newQuestionCard = req.body;
    const { topicName, courseName, correct, choices } = newQuestionCard;

    if (!topicName || !courseName || !correct || !choices) {
        throw new ApiError(
            'Topic name, course name, correct and choices are required!',
            httpStatus.BAD_REQUEST,
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
        throw new ApiError('Topic not found!', httpStatus.NOT_FOUND);
    }

    delete newQuestionCard.topicName;
    delete newQuestionCard.courseName;

    const questionCard = await QuestionCard.create({
        ...newQuestionCard,
        topic: topic._id,
        course: course._id,
    });

    topic.cards.push(questionCard._id);
    await topic.save();

    res.status(httpStatus.CREATED).json(
        response(httpStatus.CREATED, 'Created', questionCard),
    );
});

const updateQuestionCard = catchAsync(async (req, res) => {
    const { questionCardId } = req.params;
    const newQuestionCard = req.body;
    const { topicName, courseName } = newQuestionCard;

    const course = await Course.findOne({ name: courseName });
    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    const topic = await Topic.findOne({
        name: topicName,
        course: course._id,
    });

    if (!topic) {
        throw new ApiError('Topic not found!', httpStatus.NOT_FOUND);
    }

    const questionCard = await QuestionCard.findByIdAndUpdate(questionCardId, {
        ...newQuestionCard,
        topic: topic._id,
        course: topic.course,
    });

    if (!questionCard) {
        throw new ApiError('QuestionCard not found', httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK).json(
        response(httpStatus.OK, 'Updated', questionCard),
    );
});

const deleteQuestionCard = catchAsync(async (req, res) => {
    const { questionCardId } = req.params;
    const deletedQuestionCard = await QuestionCard.findByIdAndDelete(
        questionCardId,
    );

    if (!questionCard) {
        throw new ApiError('QuestionCard not found', httpStatus.NOT_FOUND);
    }

    await Promise.all([
        Topic.findByIdAndUpdate(deletedQuestionCard.topic, {
            $pull: {
                cards: questionCardId,
            },
        }),
        CardStudy.deleteMany({
            cardId: questionCardId,
        }),
    ]);

    res.status(httpStatus.OK).json(
        response(httpStatus.OK, 'Deleted', deletedQuestionCard),
    );
});

module.exports = {
    getQuestionCards,
    getQuestionCard,
    createQuestionCard,
    updateQuestionCard,
    deleteQuestionCard,
};
