const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const response = require('../utils/response');
const {
    CardStudy,
    Lesson,
    CourseStudy,
    QuestionCard,
    FlashCard,
    CalendarStudy,
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

const getProgressCardsStudy = catchAsync(async (req, res) => {
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

const getProgressCardsReview = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { review } = req.query;
    if (!review) {
        throw new ApiError('Type and review queries are required', 400);
    }

    const cards = await CardStudy.find({
        userId: _id,
        type: 'question-card',
        review,
    });

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

    res.status(200).json(response(200, 'Updated', courseStudy));
});

const updateCardStudyStatus = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { cardId, status, answer } = req.query;

    if (!cardId || !status || !answer) {
        throw new ApiError(
            'CardId, status and answer queries are required',
            400,
        );
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
        if (type === 'question-card' && card.course.group !== 'test') {
            cardStudy.review = '1';
        }

        if (status !== '1') {
            cardStudy.status = '1';
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

    res.status(200).json(response(200, 'Updated', cardStudy));
});

const updateCardStudyReview = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { cardId, status, answer } = req.query;

    if (!cardId || !status || !answer) {
        throw new ApiError(
            'CardId, status and answer queries are required',
            400,
        );
    }

    const card = await QuestionCard.findById(cardId);
    if (!card) {
        throw new ApiError('Card not found');
    }

    const cardStudy = await CardStudy.findOne({ userId: _id, cardId });

    if (!cardStudy) {
        throw new ApiError('Card not study');
    }

    if (answer === 'true') {
        if (status === '1') {
            cardStudy.review = '2';
        } else if (status === '2') {
            cardStudy.review = '0';
        }
    } else {
        if (status === '2') {
            cardStudy.review = '1';
        }
    }

    await cardStudy.save();

    res.status(200).json(response(200, 'Updated', cardStudy));
});

const getCalendarStudy = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { year, month, day } = req.query;
    if (!year || !month || !day) {
        throw new ApiError('Year, month and day queries are required', 400);
    }

    const calendarStudy = await CalendarStudy.findOne({
        userId: _id,
        year,
        month,
        day,
    });

    res.status(200).json(response(200, 'Success', calendarStudy));
});

const updateCalendarStudy = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { cardId } = req.query;
    if (!cardId) {
        throw new ApiError('CardId query is required', 400);
    }

    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let calendarStudy = await CalendarStudy.findOne({
        userId: _id,
        year,
        month,
        day,
    }).select(['-createdAt', '-updatedAt', '-__v']);

    if (!calendarStudy) {
        calendarStudy = new CalendarStudy({
            userId: _id,
            year,
            month,
            day,
        });
    }

    const cardIndex = calendarStudy.cards.findIndex((card) =>
        card.equals(cardId),
    );

    if (cardIndex === -1) {
        calendarStudy.cards.push(cardId);
    }

    await calendarStudy.save();

    res.status(200).json(response(200, 'Updated', calendarStudy));
});

module.exports = {
    getProgressCourses,
    getProgressCardsStudy,
    getProgressCardsReview,
    updateLessonStatus,
    updateCardStudyStatus,
    updateCardStudyReview,
    getCalendarStudy,
    updateCalendarStudy,
};
