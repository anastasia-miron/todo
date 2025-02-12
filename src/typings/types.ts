export type ApiResponseSuccess<T> = {
    success: true
    data: T
}

export type ApiResponseError = {
    success: false,
    message: string,
    error?: {issues: unknown[]}
}

export type ApiResponse<T> = ApiResponseSuccess<T>  | ApiResponseError;
 