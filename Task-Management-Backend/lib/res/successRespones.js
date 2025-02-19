function successResponse(success = true, message = "Request successful", data = {}, statusCode) {
  return {
    success,
    message,
    data: data ?? {}, // Ensures `data` is always an object
    statusCode,
  };
}

export default successResponse;
