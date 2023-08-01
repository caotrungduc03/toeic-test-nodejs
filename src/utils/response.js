const response = (code, message, data) => {
    return {
        code,
        message,
        data: data ? data : [],
    };
};

module.exports = response;
