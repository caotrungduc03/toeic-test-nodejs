const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const response = require('../utils/response');
const {
    CardStudy,
    Lesson,
    CourseStudy,
    QuestionCard,
    FlashCard,
} = require('../models');

const getProgressCourses = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { group } = req.query;

    if (!['practice-test', 'vocabulary', 'grammar', 'test'].includes(group)) {
        throw new ApiError('Group query is required', 400);
    }

    const coursesStudy = await CourseStudy.find({ userId: _id, group });

    res.status(200).json(response(200, 'Success', coursesStudy));
});

const getProgressCards = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { topicId } = req.query;

    if (!topicId) {
        throw new ApiError('TopicId query is required', 400);
    }

    const cards = await CardStudy.find({ userId: _id, topicId }).select([
        'cardId',
        'status',
    ]);

    res.status(200).json(response(200, 'Success', cards));
});

const updateLessonStatus = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { lessonId } = req.query;

    if (!lessonId) {
        throw new ApiError('LessonId are required', 400);
    }

    const lesson = await Lesson.findById(lessonId).populate('course', 'group');

    if (!lesson) {
        throw new ApiError('Lesson not found', 404);
    }

    let courseStudy = await CourseStudy.findOne({
        userId: _id,
        courseId: lesson.course._id,
    });

    if (!courseStudy) {
        courseStudy = new CourseStudy({
            userId: _id,
            courseId: lesson.course._id,
            group: lesson.course.group,
        });
    }

    const lessonIndex = courseStudy.lessons.indexOf(lessonId);

    if (lessonIndex === -1) {
        courseStudy.lessons.push(lessonId);
    }

    await courseStudy.save();

    res.status(200).json(response(200, 'Updated', lesson));
});

const updateCardStatus = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { cardId, status, answer } = req.query;

    if (!cardId || !status || !answer) {
        throw new ApiError('CardId, status and answer queries are required');
    }

    const [fCard, qCard] = await Promise.all([
        FlashCard.findOne({ _id: cardId })
            .populate('course', 'group')
            .select(['-createdAt', '-updatedAt', '-__v']),
        QuestionCard.findOne({ _id: cardId })
            .populate('course', 'group')
            .select(['-createdAt', '-updatedAt', '-__v']),
        ,
    ]);

    const card = fCard ?? qCard;
    const type = fCard ? 'flash-card' : 'question-card';

    if (!card) {
        throw new ApiError('Card not found', 404);
    }

    let cardStudy = await CardStudy.findOne({ userId: _id, cardId });

    if (!cardStudy) {
        cardStudy = new CardStudy({
            userId: _id,
            cardId,
            topicId: card.topic,
            type,
        });
    }

    if (answer === 'true') {
        if (status !== '2') {
            cardStudy.status = '2';

            let courseStudy = await CourseStudy.findOne({
                userId: _id,
                courseId: card.course._id,
            });

            if (!courseStudy) {
                courseStudy = new CourseStudy({
                    userId: _id,
                    courseId: card.course._id,
                    group: card.course.group,
                });
            }

            const topicIndex = courseStudy.topics.findIndex((topic) =>
                topic.topicId.equals(card.topic._id),
            );

            if (topicIndex === -1) {
                courseStudy.topics.push({
                    topicId: card.topic._id,
                    progress: 1,
                });
            } else {
                courseStudy.topics[topicIndex].progress++;
            }

            await courseStudy.save();
        }
    } else {
        if (status !== '1') {
            cardStudy.status = '1';

            if (type === 'question-card' && card.course.group !== 'test') {
                cardStudy.review = '1';
            }
        }

        if (status === '2') {
            const courseStudy = await CourseStudy.findOne({
                userId: _id,
                courseId: card.course._id,
            });

            const topicIndex = courseStudy.topics.findIndex((topic) =>
                topic.topicId.equals(card.topic._id),
            );

            courseStudy.topics[topicIndex].progress--;

            await courseStudy.save();
        }
    }

    await cardStudy.save();

    res.status(200).json(response(200, 'Updated', card));
});

module.exports = {
    getProgressCourses,
    getProgressCards,
    updateLessonStatus,
    updateCardStatus,
};
