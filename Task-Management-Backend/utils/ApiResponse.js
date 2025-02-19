class ApiResponse {
    constructor(statusCode, data, message = "Success", error = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;  // Success flag is true if status code is less than 400
        this.error = error;  // Include error field for failure cases (optional)
    }
}

export { ApiResponse };
