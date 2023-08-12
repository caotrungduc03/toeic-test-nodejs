const { Topic, Course, FlashCard, QuestionCard } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const shuffleArray = require('../utils/shuffleArray');

const getTopics = catchAsync(async (req, res) => {
    const topics = await Topic.find()
        .populate({
            path: 'course',
            select: 'name',
        })
        .populate({
            path: 'cards',
            select: 'name',
        });
    res.status(200).json(response(200, 'Success', topics));
});

const getTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const topic = await Topic.findById(topicId).populate({
        path: 'cards',
        options: {
            sort: {
                orderIndex: 1,
            },
        },
    });

    if (!topic) {
        throw new ApiError('Topic not found', 404);
    }

    if (topic.onModel === 'QuestionCard') {
        topic.cards.forEach((card) => {
            shuffleArray(card.choices);
        });
    }

    topic.onModel = undefined;

    res.status(200).json(response(200, 'Success', topic));
});

const createTopic = catchAsync(async (req, res) => {
    const rawTopic = req.body;
    const { topicName, courseName, onModel, orderIndex } = rawTopic;

    if (!topicName || !courseName || !onModel || !orderIndex) {
        throw new ApiError(
            'Topic name, course name, on model and order index are required',
            400,
        );
    }

    const [topic, course] = await Promise.all([
        Topic.findOne({ name: topicName }).select(['_id', 'course']),
        Course.findOne({ name: courseName }).select(['_id', 'topics']),
    ]);

    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    if (topicName === topic?.name && course._id.equals(topic?.course._id)) {
        throw new ApiError('Topic is already exists', 400);
    }

    delete rawTopic.courseName;

    const newTopic = await Topic.create({
        ...rawTopic,
        name: topicName,
        course: course._id,
    });

    course.topics.push(newTopic._id);
    await course.save();

    res.status(201).json(response(201, 'Created', newTopic));
});

const updateTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const rawTopic = req.body;
    const { topicName, courseName } = rawTopic;

    const course = await Course.findOne({ name: courseName });
    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
        topicId,
        {
            ...rawTopic,
            name: topicName,
            course: course._id,
        },
        {
            new: true,
        },
    );

    if (!updatedTopic) {
        throw new ApiError('Topic not found', 404);
    }

    res.status(200).json(response(200, 'Updated', updatedTopic));
});

const deleteTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const deletedTopic = await Topic.findByIdAndDelete(topicId);

    if (!deletedTopic) {
        throw new ApiError('Topic not found', 404);
    }

    await Promise.all([
        Course.findByIdAndUpdate(deletedTopic.course, {
            $pull: {
                topics: topicId,
            },
        }),
        FlashCard.deleteMany({
            topic: topicId,
        }),
        QuestionCard.deleteMany({
            topic: topicId,
        }),
    ]);

    res.status(204).json();
});

module.exports = {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
};
