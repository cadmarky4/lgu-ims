export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiResponseBuilder {
  static success<T>(data?: T, message = 'Success'): ApiResponse<T> {
    const response: ApiResponse<T> = {
      success: true,
      message,
    };
    
    if (data !== undefined) {
      response.data = data;
    }
    
    return response;
  }

  static successWithPagination<T>(
    data: T,
    page: number,
    limit: number,
    total: number,
    message = 'Success'
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  static error(message: string, errors?: string[]): ApiResponse {
    const response: ApiResponse = {
      success: false,
      message,
    };
    
    if (errors !== undefined) {
      response.errors = errors;
    }
    
    return response;
  }

  static validationError(errors: string[]): ApiResponse {
    return {
      success: false,
      message: 'Validation failed',
      errors,
    };
  }
}
