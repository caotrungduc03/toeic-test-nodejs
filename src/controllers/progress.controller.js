const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const response = require('../utils/response');
const { Progress, Lesson } = require('../models');

const getProgressCourses = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { group } = req.query;

    if (!['practice-test', 'vocabulary', 'grammar'].includes(group)) {
        throw new ApiError('Group is required', 400);
    }

    const progress = await Progress.findOne({ userId: _id });

    if (!progress) {
        throw new ApiError('Progress not found', 404);
    }

    const progressCourses = progress.courses.filter(
        (course) => course.group === group,
    );

    res.status(200).json(response(200, 'Success', progressCourses));
});

const updateProgressLesson = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { lessonId } = req.query;

    if (!lessonId) {
        throw new ApiError('LessonId are required', 400);
    }

    const lesson = await Lesson.findById(lessonId).populate('course', 'group');

    if (!lesson) {
        throw new ApiError('Lesson not found', 404);
    }

    let progress = await Progress.findOne({ userId: _id });

    if (!progress) {
        progress = new Progress({ userId: _id, courses: [] });
    }

    const courseIndex = progress.courses.findIndex((course) =>
        course.courseId.equals(lesson.course._id),
    );

    if (courseIndex === -1) {
        progress.courses.push({
            courseId: lesson.course._id,
            group: lesson.course.group,
            topics: [],
            lessons: [lessonId],
        });
    } else {
        const lessonIndex =
            progress.courses[courseIndex].lessons.indexOf(lessonId);

        if (lessonIndex === -1) {
            progress.courses[courseIndex].lessons.push(lessonId);
        }
    }

    await progress.save();

    progress.__v = undefined;

    res.json(response(200, 'Updated', progress));
});

module.exports = {
    getProgressCourses,
    updateProgressLesson,
};
