/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt
 *  - replaces _id with id
 */

const toJSON = (schema) => {
    const transform = schema.options.toJSON?.transform;

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc, ret, options) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

            if (transform) {
                return transform(doc, ret, options);
            }
        },
    });
};

module.exports = toJSON;
