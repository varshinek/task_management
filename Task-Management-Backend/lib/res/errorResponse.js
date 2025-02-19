function errorResponse(success = false, message = "An error occurred", error = {}, statusCode) {
  return {
    statusCode,
    success,
    message,
    error: error instanceof Error ? error.message : error, // Ensures `error` is readable
  };
}

export default errorResponse;
