import { type UserResponse } from '~/utils/Responses/UserResponse'
import type { CountryResponse } from './Responses/CountryResponse'
import type { UserUpdateRequest } from './Requests/UserUpdateRequest'
import { ApiError, EApiErrorCode } from '~/composables/useApiError'
import type { CreateCardRequest } from './Requests/CreateCardRequest'
import type { CardResponse } from './Responses/CardResponse'
import type { UpdateCardRequest } from './Requests/UpdateCardRequest'
import type { GetSimilarCardsRequest } from './Requests/GetSimilarCardsRequest'
import type { UpdateProfileAvatarRequest } from './Requests/UpdateProfileAvatartRequest'

// const API_BASE_URL = 'http://localhost:5295/api';
const API_BASE_URL = 'https://nexthome-api-production.up.railway.app/api';
const USERS_PREFIX = '/Users';
const COUNTRIES_PREFIX = '/Countries';
const COLLECTIONS_PREFIX = '/Collections';

async function parseJsonSafe(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return null

  try {
    return await response.json()
  } catch {
    return null
  }
}

export function requestPublic<T>(
  path: string,
  options: RequestInit & { errorCode?: EApiErrorCode } = {}
) {
  return sendRequest<T>(path, options);
}

export function requestAuth<T>(
  path: string,
  options: RequestInit & { errorCode?: EApiErrorCode } = {}
) {
  const { getApiToken } = useApiToken();
  const token = getApiToken();
  return sendRequest<T>(path, { ...options, token });
}

async function sendRequest<T>(
  path: string,
  {
    token,
    errorCode = EApiErrorCode.UNKNOWN_ERROR,
    headers = {},
    ...fetchInit
  }: RequestInit & { token?: string; errorCode?: EApiErrorCode } = {}
): Promise<T> {

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchInit,
    headers: finalHeaders,
  })

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
    throw new ApiError(errorCode, response.status, data)
  }

  return data as T
}


export const api = {
  //#region Users Controller
  //#region Users
  async getAllUsers(): Promise<UserResponse[]> {
    return await requestAuth<UserResponse[]>(`${USERS_PREFIX}`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_USERS_FAILED,
    });
  },

  async updateUserAvatar(userId: string, request: UpdateProfileAvatarRequest): Promise<UserResponse> {
    let response = await requestAuth<UserResponse>(`${USERS_PREFIX}/${userId}/avatar`, {
      method: 'PUT',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response;
  },

  async updateUser(
    userId: string,
    request: UserUpdateRequest,
  ): Promise<UserResponse> {
    let response = await requestAuth<UserResponse>(`${USERS_PREFIX}/${userId}`, {
      method: 'PUT',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response;
  },

  async getMe(): Promise<UserResponse> {
    return await requestAuth<UserResponse>(`${USERS_PREFIX}/me`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_USER_FAILED,
    });
  },
  //#endregion
  
  //#region Cloudinary
  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', useRuntimeConfig().public.cloudinaryUploadPreset as string);
    
    const cloudName = useRuntimeConfig().public.cloudinaryCloudName as string;
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    return data.secure_url;
  },
  //#endregion

  //#region Experience Cards
  async getExperienceCardsByUserId(userId: string): Promise<CardResponse[]> {
    return await requestAuth<CardResponse[]>(`${USERS_PREFIX}/${userId}/cards/experience`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_EXPERIENCE_CARDS_FAILED,
    });
  },

  async getExperienceCardById(cardId: string): Promise<CardResponse> {
    return await requestAuth<CardResponse>(`${USERS_PREFIX}/cards/experience/${cardId}`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_EXPERIENCE_CARD_FAILED,
    });
  },

  async deleteExperienceCardById(userId: string, cardId: string): Promise<void> {
    await requestAuth<void>(`${USERS_PREFIX}/${userId}/cards/experience/${cardId}`, {
      method: 'DELETE',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
    });
  },

  async createExperienceCard(userId: string, request: CreateCardRequest): Promise<CardResponse> {
    return await requestAuth<CardResponse>(`${USERS_PREFIX}/${userId}/cards/experience`, {
      method: 'POST',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  async updateExperienceCard(id: string, cardId: string, request: UpdateCardRequest): Promise<CardResponse> {
    return await requestAuth<CardResponse>(`${USERS_PREFIX}/${id}/cards/experience/${cardId}`, {
      method: 'PUT',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },
  //#endregion

  //#region ChallengeCards
  async getChallengeCardsByUserId(userId: string): Promise<CardResponse[]> {
    return await requestAuth<CardResponse[]>(`${USERS_PREFIX}/${userId}/cards/challenge`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_CHALLENGE_CARDS_FAILED,
    });
  },

  async getChallengeCardById(cardId: string): Promise<CardResponse> {
    return await requestAuth<CardResponse>(`${USERS_PREFIX}/cards/challenge/${cardId}`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_CHALLENGE_CARD_FAILED,
    });
  },

  async deleteChallengeCardById(userId: string, cardId: string): Promise<void> {
    await requestAuth<void>(`${USERS_PREFIX}/${userId}/cards/challenge/${cardId}`, {
      method: 'DELETE',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
    });
  },

  async createChallengeCard(userId: string, request: CreateCardRequest): Promise<CardResponse> {
    return await requestAuth<CardResponse>(`${USERS_PREFIX}/${userId}/cards/challenge`, {
      method: 'POST',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  async updateChallengeCard(id: string, cardId: string, request: UpdateCardRequest): Promise<CardResponse> {
    return await requestAuth<CardResponse>(`${USERS_PREFIX}/${id}/cards/challenge/${cardId}`, {
      method: 'PUT',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  //#endregion
  //#region Collections
  async searchSimilarCards(request: GetSimilarCardsRequest): Promise<CardResponse[]> {
    return await requestAuth<CardResponse[]>(`${COLLECTIONS_PREFIX}/cards/similar`, {
      method: 'POST',
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
    return await requestAuth<CountryResponse[]>(`${COUNTRIES_PREFIX}`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_COUNTRIES_FAILED,
    });
  },
  //#endregion

}