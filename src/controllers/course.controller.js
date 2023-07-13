const { Course, Topic, FlashCard } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const getCourses = catchAsync(async (req, res) => {
    const courses = await Course.find().populate('topics');

    res.status(200).json(response(200, 'Success', courses));
});

const getCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('topics');

    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    res.status(200).json(response(200, 'Success', course));
});

const createCourse = catchAsync(async (req, res) => {
    const rawCourse = req.body;
    const { name, group } = rawCourse;

    if (!name || !group) {
        throw new ApiError('Name and group are required', 400);
    }

    const isExists = await Course.exists({ name });
    if (isExists) {
        throw new ApiError('Course is already exists', 400);
    }

    const course = await Course.create(rawCourse);

    res.status(201).json(response(201, 'Created', course));
});

const updateCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const rawCourse = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, rawCourse, {
        new: true,
        runValidators: true,
    });

    if (!updatedCourse) {
        throw new ApiError('Course not found', 404);
    }

    res.status(200).json(response(200, 'Updated', updatedCourse));
});

const deleteCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
        throw new ApiError('Course not found', 404);
    }

    await Promise.all([
        Topic.deleteMany({
            course: deletedCourse._id,
        }),
        FlashCard.deleteMany({
            course: deletedCourse._id,
        }),
    ]);

    res.status(204).json();
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};
