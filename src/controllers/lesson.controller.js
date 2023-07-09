const { Lesson } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const getLessons = catchAsync(async (req, res) => {
    const lessons = await Lesson.find();
    res.status(httpStatus.OK).json({ lessons });
});
const getLesson = catchAsync(async (req, res) => {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        throw new ApiError('Lesson not found!', httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.OK).json({ lesson });
});

const createLesson = catchAsync(async (req, res) => {
    const newLesson = req.body;
    const { name, children } = newLesson;
    if (!name || !children) {
        throw new ApiError(
            'name or children is required!',
            httpStatus.BAD_REQUEST,
        );
    }
    const lesson = await Lesson.create(newLesson);
    res.status(httpStatus.CREATED).json({ lesson });
});

const updateLesson = catchAsync(async (req, res) => {
    const { lessonId } = req.params;
    const newLesson = req.body;
    const lesson = await Lesson.findByIdAndUpdate(lessonId, newLesson);
    if (!lesson) {
        throw new ApiError('Lesson not found!', httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.OK).json({ lesson });
});

const deleteLesson = catchAsync(async (req, res) => {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) {
        throw new ApiError('Lesson not found', httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.OK).json({});
});

module.exports = {
    getLessons,
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
};
