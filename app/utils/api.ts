import { type UserResponse } from '~/utils/Responses/UserResponse'
import { type UserLoginResponse } from '~/utils/Responses/UserLoginResponse'
import { type UserLoginRequest } from '~/utils/Requests/UserLoginRequest'
import { type UserRegisterRequest } from '~/utils/Requests/UserRegisterRequest'

export const accessToken = ref<string | null>(null)
let currentUser: UserResponse | null = null

export type ApiErrorCode =
  | 'REGISTER_FAILED'
  | 'LOGIN_FAILED'
  | 'VALIDATION_FAILED'
  | 'NOT_AUTHENTICATED'
  | 'GET_USERS_FAILED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status?: number
  readonly details?: unknown

  constructor(code: ApiErrorCode, message?: string, status?: number, details?: unknown) {
    super(message ?? code)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}


function withAuthHeaders(
  headers: Record<string, string> = {}
): Record<string, string> {
  if (!accessToken.value) return headers

  return {
    ...headers,
    Authorization: `Bearer ${accessToken.value}`,
  }
}

const API_BASE_URL = 'http://localhost:5295/api'

async function parseJsonSafe(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return null

  try {
    return await response.json()
  } catch {
    return null
  }
}

async function requestJson<T>(
  path: string,
  init: RequestInit & { auth?: boolean; errorCode?: ApiErrorCode } = {}
): Promise<T> {
  const { auth = true, errorCode = 'UNKNOWN_ERROR', ...fetchInit } = init

  const headers: Record<string, string> = {
    ...(fetchInit.headers as Record<string, string> | undefined),
  }

  const finalHeaders = auth ? withAuthHeaders(headers) : headers

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchInit,
      headers: finalHeaders,
    })
  } catch (err) {
    throw new ApiError('NETWORK_ERROR', 'Network error', undefined, err)
  }

  const data = await parseJsonSafe(response)

  if (response.status === 401) {
    throw new ApiError('NOT_AUTHENTICATED', 'Not authenticated', 401, data)
  }

  
  if (response.status === 400 && data && typeof data === 'object' && 'errors' in data) {
    throw new ApiError('VALIDATION_FAILED', 'Validation failed', 400, data)
  }

  if (!response.ok) {
    throw new ApiError(errorCode, `Request failed (${response.status})`, response.status, data)
  }

  return data as T
}

export const api = {
  async registerUser(
    request: UserRegisterRequest
  ): Promise<UserResponse> {
    return await requestJson<UserResponse>('/Auth/register', {
      method: 'POST',
      auth: false,
      errorCode: 'REGISTER_FAILED',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  },

  async loginUser(
    request: UserLoginRequest
  ): Promise<UserResponse> {
    const data = await requestJson<UserLoginResponse>('/Auth/login', {
      method: 'POST',
      auth: false,
      errorCode: 'LOGIN_FAILED',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    accessToken.value = data.accessToken
    currentUser = data.user

    return currentUser
  },

  logout() {
    accessToken.value = null
    currentUser = null
  },

  getCurrentUser(): UserResponse | null {
    return currentUser
  },

  async getAllUsers(): Promise<UserResponse[]> {
    return await requestJson<UserResponse[]>('/Users', {
      method: 'GET',
      auth: true,
      errorCode: 'GET_USERS_FAILED',
    })
  },
}
