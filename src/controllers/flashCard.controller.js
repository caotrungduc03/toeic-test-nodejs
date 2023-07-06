const { FlashCard } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getFlashCards = catchAsync(async (req, res) => {
    const flashCards = await FlashCard.find();
    res.status(200).json({
        flashCards,
    });
});

const getFlashCard = catchAsync(async (req, res) => {
    const { flashCardId } = req.params;
    const flashCard = await FlashCard.findById(flashCardId);

    if (!flashCard) {
        throw new ApiError('Flash card not found', 404);
    }

    res.status(200).json({
        flashCard,
    });
});

const createFlashCard = catchAsync(async (req, res) => {
    const rawFlashCard = req.body;
    const { group, word, ipa, texts } = rawFlashCard;

    if (!group || !word || !ipa || !texts) {
        throw new ApiError('Group, word, ipa and texts are required', 400);
    }

    const isExists = await FlashCard.exists({ word });
    if (isExists) {
        // throw new ApiError('Flash card is already exists', 400);
    }

    const imageFileName = req.files['image']
        ? req.files['image'][0].filename
        : '';
    const soundFileName = req.files['sound']
        ? req.files['sound'][0].filename
        : '';

    const flashCard = await FlashCard.create({
        ...rawFlashCard,
        image: imageFileName,
        sound: soundFileName,
    });

    res.status(201).json({
        flashCard,
    });
});

const updateFlashCard = catchAsync(async (req, res) => {
    const { flashCardId } = req.params;
    const rawFlashCard = req.body;
    const updatedFlashCard = await FlashCard.findByIdAndUpdate(
        flashCardId,
        rawFlashCard,
        {
            new: true,
        },
    );

    if (!updatedFlashCard) {
        throw new ApiError('Flash card not found', 404);
    }

    res.status(200).json({
        updatedFlashCard,
    });
});

const deleteFlashCard = catchAsync(async (req, res) => {
    const { flashCardId } = req.params;
    const deletedFlashCard = await FlashCard.findByIdAndDelete(flashCardId);

    if (!deletedFlashCard) {
        throw new ApiError('Flash card not found', 404);
    }

    res.status(204).json();
});

module.exports = {
    getFlashCards,
    getFlashCard,
    createFlashCard,
    updateFlashCard,
    deleteFlashCard,
};
