const { Topic } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getTopics = catchAsync(async (req, res) => {
    const topics = await Topic.find();
    res.status(200).json({
        topics,
    });
});

const getTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const topic = await Topic.findById(topicId);

    if (!topic) {
        throw new ApiError('Topic not found', 404);
    }

    res.status(200).json({
        topic,
    });
});

const createTopic = catchAsync(async (req, res) => {
    const rawTopic = req.body;
    const { name, courseName } = rawTopic;

    if (!name || !courseName) {
        throw new ApiError('Name and course name are required', 400);
    }

    const isExists = await Topic.exists({ name });
    if (isExists) {
        throw new ApiError('Topic is already exists', 400);
    }

    const topic = await Topic.create(rawTopic);

    res.status(201).json({
        topic,
    });
});

const updateTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const rawTopic = req.body;
    const updatedTopic = await Topic.findByIdAndUpdate(topicId, rawTopic, {
        new: true,
    });

    if (!updatedTopic) {
        throw new ApiError('Topic not found', 404);
    }

    res.status(200).json({
        updatedTopic,
    });
});

const deleteTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const deletedTopic = await Topic.findByIdAndDelete(topicId);

    if (!deletedTopic) {
        throw new ApiError('Topic not found', 404);
    }

    res.status(204).json();
});

module.exports = {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
};
