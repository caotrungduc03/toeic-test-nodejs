const { Topic, Course, FlashCard } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const getTopics = catchAsync(async (req, res) => {
    const topics = await Topic.find().populate(['course', 'cards']);
    res.status(200).json(response(200, 'Success', topics));
});

const getTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const topic = await Topic.findById(topicId).populate(['course', 'cards']);

    if (!topic) {
        throw new ApiError('Topic not found', 404);
    }

    res.status(200).json(response(200, 'Success', topic));
});

const createTopic = catchAsync(async (req, res) => {
    const rawTopic = req.body;
    const { topicName, courseName } = rawTopic;

    if (!topicName || !courseName) {
        throw new ApiError('Topic name and course name are required', 400);
    }

    const isExists = await Topic.exists({ name: topicName });
    if (isExists) {
        throw new ApiError('Topic is already exists', 400);
    }

    const course = await Course.findOne({ name: courseName });
    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    delete rawTopic.courseName;

    const topic = await Topic.create({
        ...rawTopic,
        name: topicName,
        course: course._id,
    });

    course.topics.push(topic._id);
    await course.save();

    res.status(201).json(response(201, 'Created', topic));
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
