const { Topic, Course } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getTopics = catchAsync(async (req, res) => {
    const topics = await Topic.find().populate('course');
    res.status(200).json({
        topics,
    });
});

const getTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const topic = await Topic.findById(topicId).populate('course');

    if (!topic) {
        throw new ApiError('Topic not found', 404);
    }

    res.status(200).json({
        topic,
    });
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

    res.status(201).json({
        topic,
        updatedCourse: course,
    });
});

const updateTopic = catchAsync(async (req, res) => {
    const { topicId } = req.params;
    const { topicName, courseName, ...othersRawTopic } = req.body;

    const course = await Course.findOne({ name: courseName });
    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
        topicId,
        {
            ...othersRawTopic,
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

    await Course.findByIdAndUpdate(deletedTopic.course, {
        $pull: { topics: topicId },
    });

    res.status(204).json();
});

module.exports = {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
};
