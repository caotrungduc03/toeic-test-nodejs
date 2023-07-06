const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        group: {
            type: String,
            required: true,
            trim: true,
        },
        totalCard: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
