const httpStatus = require('http-status');
const { Course, Topic, Lesson, FlashCard, QuestionCard } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const importArray = catchAsync(async (req, res) => {
    const { type } = req.query;
    const data = req.body;
    let results = [];
    switch (type) {
        case 'course':
            results = await Promise.all(
                data?.map(async (item) => {
                    const { name, group, orderIndex } = item;

                    if (!name || !group || !orderIndex) {
                        throw new ApiError(
                            'Name, group and order index are required',
                            400,
                        );
                    }

                    const isExists = await Course.exists({ name });
                    if (isExists) {
                        throw new ApiError('Course is already exists', 400);
                    }

                    return await Course.create(item);
                }),
            );
            break;
        case 'topic':
            results = await Promise.all(
                data?.map(async (item) => {
                    const { topicName, courseName, onModel, orderIndex } = item;

                    if (!topicName || !courseName || !onModel || !orderIndex) {
                        throw new ApiError(
                            'Topic name, course name, on model and order index are required',
                            400,
                        );
                    }

                    const [topic, course] = await Promise.all([
                        Topic.findOne({ name: topicName }).select([
                            '_id',
                            'course',
                        ]),
                        Course.findOne({ name: courseName }).select([
                            '_id',
                            'topics',
                        ]),
                    ]);

                    if (!course) {
                        throw new ApiError('Course not found', 404);
                    }

                    if (
                        topicName === topic?.name &&
                        course._id.equals(topic?.course._id)
                    ) {
                        throw new ApiError('Topic is already exists', 400);
                    }

                    delete item.courseName;

                    const newTopic = await Topic.create({
                        ...item,
                        name: topicName,
                        course: course._id,
                    });

                    course.topics.push(newTopic._id);
                    await course.save();

                    return newTopic;
                }),
            );

            break;
        case 'lesson':
            results = await Promise.all(
                data?.map(async (item) => {
                    const { children, courseName, orderIndex } = item;

                    if (!children || !courseName || !orderIndex) {
                        throw new ApiError(
                            'Children, course name and order index are required',
                            httpStatus.BAD_REQUEST,
                        );
                    }

                    const course = await Course.findOne({ name: courseName });

                    if (!course) {
                        throw new ApiError(
                            'Course not found',
                            httpStatus.NOT_FOUND,
                        );
                    }

                    delete item.courseName;

                    const lesson = await Lesson.create({
                        ...item,
                        course: course._id,
                    });

                    course.lessons.push(lesson._id);
                    await course.save();

                    return lesson;
                }),
            );
            break;
        case 'flash-card':
            results = await Promise.all(
                data?.map(async (item) => {
                    const { word, ipa, texts, topicName, courseName } = item;

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

                    delete item.topicName;
                    delete item.courseName;

                    const flashCard = await FlashCard.create({
                        ...item,
                        topic: topic._id,
                        course: course._id,
                    });

                    topic.cards.push(flashCard._id);
                    await topic.save();

                    return flashCard;
                }),
            );
            break;
        case 'question-card':
            results = await Promise.all(
                data?.map(async (item) => {
                    const { topicName, courseName, correct, choices } = item;

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
                        throw new ApiError(
                            'Topic not found!',
                            httpStatus.NOT_FOUND,
                        );
                    }

                    delete item.topicName;
                    delete item.courseName;

                    const questionCard = await QuestionCard.create({
                        ...item,
                        topic: topic._id,
                        course: course._id,
                    });

                    topic.cards.push(questionCard._id);
                    await topic.save();

                    return questionCard;
                }),
            );
            break;
        default:
            throw new ApiError('Invalid type param');
    }

    res.status(201).json(response(201, 'Created', results));
});

module.exports = {
    importArray,
};
