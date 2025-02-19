class ApiError extends Error {
    constructor(
        statusCode,
        errorMessage = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(errorMessage);
        
        // Attach properties
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;
        this.errorMessage = errorMessage;  // Renamed to avoid conflict with inherited message
        
        // Capture the stack trace if not provided
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
