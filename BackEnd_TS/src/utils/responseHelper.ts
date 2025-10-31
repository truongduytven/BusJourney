import { Response } from 'express';

/**
 * Helper function to send success response
 */
export const sendSuccess = (
  res: Response,
  message: string,
  data?: any,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data })
  });
};

/**
 * Helper function to send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  error?: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error })
  });
};

/**
 * Helper function to send validation error
 */
export const sendValidationError = (
  res: Response,
  message: string
) => {
  return sendError(res, message, 400);
};

/**
 * Helper function to send not found error
 */
export const sendNotFoundError = (
  res: Response,
  message: string = 'Không tìm thấy tài nguyên'
) => {
  return sendError(res, message, 404);
};

/**
 * Helper function to send unauthorized error
 */
export const sendUnauthorizedError = (
  res: Response,
  message: string = 'Unauthorized'
) => {
  return sendError(res, message, 401);
};

/**
 * Helper function to send server error
 */
export const sendServerError = (
  res: Response,
  error: any,
  message: string = 'Lỗi server'
) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return res.status(500).json({
    success: false,
    message,
    error: errorMessage
  });
};

/**
 * Helper function to handle async controller errors
 */
export const handleControllerError = (
  res: Response,
  error: any,
  operationName: string
) => {
  console.error(`${operationName} error:`, error);
  return sendServerError(res, error);
};
