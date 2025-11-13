export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  validationErrors?: ValidationError[];
}