export class ApiResponse<T> {
  success: true;
  message: string;
  data?: T;

  constructor(message: string, data?: T) {
    this.success = true;
    this.message = message;

    if (data !== undefined) {
      this.data = data;
    }
  }

  static success<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(message, data);
  }
}