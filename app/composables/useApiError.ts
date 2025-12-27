import { ApiError } from '~/utils/api'

export function useApiError() {
  function getUserErrorMessage(error: unknown): string {
    if (!(error instanceof ApiError)) {
      return 'Unknown error occurred'
    }

    switch (error.code) {
        case 'NETWORK_ERROR':
            return 'No connection to the server'

        case 'NOT_AUTHENTICATED':
            return 'You are not authenticated. Please log in'

        case 'LOGIN_FAILED':
            return 'Invalid email or password'

        case 'REGISTER_FAILED':
            return 'Registration failed. Please check your details'

        case 'VALIDATION_FAILED': {
            const errors = (error.details as any)?.errors
            return Array.isArray(errors)
                ? errors.join('\n')
                : 'Invalid input data'
        }

        default:
            return (error.details as any)?.message ?? 'Unknown error occurred'
    }
  }

  return { getUserErrorMessage }
}