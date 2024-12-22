class expressError extends Error {
    constructor (statusCode, message) {
        super();
        this.status = statusCode;
        this.message = message;
    }
}

module.exports = expressError;