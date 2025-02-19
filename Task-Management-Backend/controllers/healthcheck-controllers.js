import { ApiResponse } from '../utils/ApiResponse.js';

export const healthcheck = async (req, res) => {
  try {
    // Simulate DB or other service checks here if necessary
    const dbStatus = "Connected"; // Replace with actual DB status check logic
    
    // Return a detailed health check response
    return res.status(200).json(
      new ApiResponse(200, { status: "OK", dbStatus }, "Server is healthy")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, "Internal Server Error: Health Check Failed")
    );
  }
};
