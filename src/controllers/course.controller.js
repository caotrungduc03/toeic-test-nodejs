const { Course } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getCourses = catchAsync(async (req, res) => {
    const courses = await Course.find();

    res.status(200).json({
        courses,
    });
});

const getCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    res.status(200).json({
        course,
    });
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

    res.status(201).json({
        course,
    });
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

    res.status(200).json({
        updatedCourse,
    });
});

const deleteCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
        throw new ApiError('Course not found', 404);
    }

    res.status(204).json();
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};
