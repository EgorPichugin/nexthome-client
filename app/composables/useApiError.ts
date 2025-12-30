import { useMessage } from "naive-ui";

export enum EApiErrorCode {
  REGISTER_FAILED = 'REGISTER_FAILED',
  LOGIN_FAILED = 'LOGIN_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  GET_USERS_FAILED = 'GET_USERS_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  GET_COUNTRIES_FAILED = 'GET_COUNTRIES_FAILED',
  GET_USER_FAILED = 'GET_USER_FAILED',
}

const ApiErrorMessages: Record<EApiErrorCode, string> = {
    [EApiErrorCode.REGISTER_FAILED]: 'Registration failed. Email may already be in use',
    [EApiErrorCode.LOGIN_FAILED]: 'Invalid email or password',
    [EApiErrorCode.VALIDATION_FAILED]: 'Validation failed. Please check your input',
    [EApiErrorCode.NOT_AUTHENTICATED]: 'You are not authenticated. Please log in',
    [EApiErrorCode.GET_USERS_FAILED]: 'Failed to retrieve users',
    [EApiErrorCode.NETWORK_ERROR]: 'No connection to the server',
    [EApiErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred',
    [EApiErrorCode.GET_COUNTRIES_FAILED]: 'Failed to load countries. Please try again later',
    [EApiErrorCode.GET_USER_FAILED]: 'Failed to load user. Please try again later',
}

export class ApiError extends Error {
  readonly code: EApiErrorCode
  readonly status?: number
  readonly details?: unknown

  constructor(code: EApiErrorCode, status?: number, details?: unknown) {
    super(ApiErrorMessages[code]);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function useApiError() {
  function getUserErrorMessages(error: unknown): string[] {
    if (!(error instanceof ApiError)) {
      return [ApiErrorMessages[EApiErrorCode.UNKNOWN_ERROR]];
    }

    if (error.code === EApiErrorCode.VALIDATION_FAILED && error.details) {
      const errors = (error.details as any)?.errors
      return Array.isArray(errors) ? errors : [error.message];
    }

    return [error.message];
  }

  return { getUserErrorMessages }
}