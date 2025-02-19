import errorResponse from "../lib/res/errorResponse.js";
import StatusCodes from "http-status-codes";

const zValidateRequest =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      schema.parse(req[source]);
      next();
    } catch (e) {
      const errors = e.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      res.status(StatusCodes.BAD_REQUEST).json(
        errorResponse(
          false,
          "Request validation failed",
          errors,
          StatusCodes.BAD_REQUEST
        )
      );
    }
  };

export default zValidateRequest;
