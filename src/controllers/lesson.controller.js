const { Lesson, Course } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const response = require('../utils/response');

const getLessons = catchAsync(async (req, res) => {
    const lessons = await Lesson.find().populate({
        path: 'course',
        select: 'name -_id',
    });

    res.status(httpStatus.OK).json(response(httpStatus.OK, 'Success', lessons));
});

const getLesson = catchAsync(async (req, res) => {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId).populate({
        path: 'course',
        select: 'name -_id',
    });

    if (!lesson) {
        throw new ApiError('Lesson not found!', httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK).json(response(httpStatus.OK, 'Success', lesson));
});

const createLesson = catchAsync(async (req, res) => {
    const newLesson = req.body;
    const { children, courseName } = newLesson;

    if (!children || !courseName) {
        throw new ApiError(
            'children or course name  are required!',
            httpStatus.BAD_REQUEST,
        );
    }

    const course = await Course.findOne({ name: courseName });

    if (!course) {
        throw new ApiError('Course not found', httpStatus.NOT_FOUND);
    }

    delete newLesson.courseName;

    const lesson = await Lesson.create({
        ...newLesson,
        course: course._id,
    });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(httpStatus.CREATED).json(
        response(httpStatus.CREATED, 'Created', lesson),
    );
});

const updateLesson = catchAsync(async (req, res) => {
    const { lessonId } = req.params;
    const newLesson = req.body;
    const { courseName } = newLesson;

    const course = await Course.findOne({ name: courseName });
    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    const lesson = await Lesson.findByIdAndUpdate(lessonId, {
        ...newLesson,
        course: course._id,
    });

    if (!lesson) {
        throw new ApiError('Lesson not found!', httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK).json(response(httpStatus.OK, 'Updated', lesson));
});

const deleteLesson = catchAsync(async (req, res) => {
    const { lessonId } = req.params;
    const lesson = await Lesson.findByIdAndDelete(lessonId);

    if (!lesson) {
        throw new ApiError('Lesson not found', httpStatus.NOT_FOUND);
    }

    await Course.findByIdAndUpdate(lesson.course, {
        $pull: {
            lessons: lessonId,
        },
    });

    res.status(httpStatus.OK).json(response(httpStatus.NO_CONTENT));
});

module.exports = {
    getLessons,
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
};
