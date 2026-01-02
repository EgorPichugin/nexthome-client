import { type UserResponse } from '~/utils/Responses/UserResponse'
import { type UserLoginResponse } from '~/utils/Responses/UserLoginResponse'
import { type UserLoginRequest } from '~/utils/Requests/UserLoginRequest'
import { type UserRegisterRequest } from '~/utils/Requests/UserRegisterRequest'
import type { CountryResponse } from './Responses/CountryResponse'
import type { UserUpdateRequest } from './Requests/UserUpdateRequest'
import { ApiError, EApiErrorCode } from '~/composables/useApiError'
import { useAuthStore } from '~/stores/authStore';
import type { ExperienceCardResponse } from './Responses/ExperienceCardResponse'
import type { ExperienceCardUpdateRequest } from './Requests/ExperienceCardUpdateRequest'
import type { ExperienceCardCreateRequest } from './Requests/ExperienceCardCreateRequest'

const API_BASE_URL = 'http://localhost:5295/api'
const AUTH_PREFIX = '/Auth'
const USERS_PREFIX = '/Users'
const COUNTRIES_PREFIX = '/Countries'

function withAuthHeaders(
  headers: Record<string, string> = {}
): Record<string, string> {
  const authStore = useAuthStore()

  if (!authStore.accessToken) return headers

  return {
    ...headers,
    Authorization: `Bearer ${authStore.accessToken}`,
  }
}


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
  init: RequestInit & { auth?: boolean; errorCode?: EApiErrorCode } = {}
): Promise<T> {
  const { auth = true, errorCode = EApiErrorCode.UNKNOWN_ERROR, ...fetchInit } = init

  const headers: Record<string, string> = {
    ...(fetchInit.headers as Record<string, string> | undefined),
  }

  const finalHeaders = auth ? withAuthHeaders(headers) : headers

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchInit,
      headers: finalHeaders,
    });
  } catch (error) {
    throw new ApiError(EApiErrorCode.NETWORK_ERROR, undefined, error);
  }

  const data = await parseJsonSafe(response)

  if (response.status === 401) {
    throw new ApiError(EApiErrorCode.NOT_AUTHENTICATED, 401, data);
  }
  
  if (response.status === 400 && data && typeof data === 'object' && 'errors' in data) {
    throw new ApiError(EApiErrorCode.VALIDATION_FAILED, 400, data);
  }

  if (response.status === 409) {
    throw new ApiError(EApiErrorCode.REGISTER_FAILED, 409, data);
  }

  if (!response.ok) {
    throw new ApiError(errorCode, response.status, data);
  }

  return data as T
}

export const api = {
  //#region Auth Controller
  async registerUser(
    request: UserRegisterRequest
  ): Promise<UserResponse> {
    return await requestJson<UserResponse>(`${AUTH_PREFIX}/register`, {
      method: 'POST',
      auth: false,
      errorCode: EApiErrorCode.REGISTER_FAILED,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  },

  async loginUser(
    request: UserLoginRequest
  ): Promise<UserLoginResponse> {
    let response = await requestJson<UserLoginResponse>(`${AUTH_PREFIX}/login`, {
      method: 'POST',
      auth: false,
      errorCode: EApiErrorCode.LOGIN_FAILED,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return response
  },
  //#endregion

  //#region Users Controller
  //#region Users
  async getAllUsers(): Promise<UserResponse[]> {
    return await requestJson<UserResponse[]>(`${USERS_PREFIX}`, {
      method: 'GET',
      auth: true,
      errorCode: EApiErrorCode.GET_USERS_FAILED,
    });
  },

  async updateUser(
    userId: string,
    request: UserUpdateRequest
  ): Promise<UserResponse> {
    let response = await requestJson<UserResponse>(`${USERS_PREFIX}/${userId}`, {
      method: 'PUT',
      auth: true,
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response;
  },
  //#endregion

  //#region Experience Cards
  async getExperienceCardsByUserId(userId: string): Promise<ExperienceCardResponse[]> {
    return await requestJson<ExperienceCardResponse[]>(`${USERS_PREFIX}/${userId}/cards/experience`, {
      method: 'GET',
      auth: true,
      errorCode: EApiErrorCode.GET_EXPERIENCE_CARDS_FAILED,
    });
  },

  async getExperienceCardById(cardId: string): Promise<ExperienceCardResponse> {
    return await requestJson<ExperienceCardResponse>(`${USERS_PREFIX}/cards/experience/${cardId}`, {
      method: 'GET',
      auth: true,
      errorCode: EApiErrorCode.GET_EXPERIENCE_CARD_FAILED,
    });
  },

  async deleteExperienceCardById(userId: string, cardId: string): Promise<void> {
    await requestJson<void>(`${USERS_PREFIX}/${userId}/cards/experience/${cardId}`, {
      method: 'DELETE',
      auth: true,
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
    });
  },

  async createExperienceCard(userId: string, request: ExperienceCardCreateRequest): Promise<ExperienceCardResponse> {
    return await requestJson<ExperienceCardResponse>(`${USERS_PREFIX}/${userId}/cards/experience`, {
      method: 'POST',
      auth: true,
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  async updateExperienceCard(id: string, cardId: string, request: ExperienceCardUpdateRequest): Promise<ExperienceCardResponse> {
    return await requestJson<ExperienceCardResponse>(`${USERS_PREFIX}/${id}/cards/experience/${cardId}`, {
      method: 'PUT',
      auth: true,
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  }, 
  //#endregion
  //#endregion

  //#region Countries Controller
  async fetchCountries(): Promise<CountryResponse[]> {
    return await requestJson<CountryResponse[]>('/Countries', {
      method: 'GET',
      auth: false,
      errorCode: EApiErrorCode.GET_COUNTRIES_FAILED,
    });
  },
  //#endregion

}