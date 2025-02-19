const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Ensure that the promise resolves or rejects
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // Catch any error and pass it to the next middleware (error handler)
    }
};

export { asyncHandler };
