import { ApiError } from "./api-error";

export class ResponseUtil {
  public static success(statusCode: number, data?: object) {
    return {
      statusCode: statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: true, data }),
    };
  }

  public static error(error: ApiError) {
    const status = error.status || 500;
    return {
      statusCode: status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: false,
        message: error.message || 'Something went wrong...',
      }),
    };
  }
}