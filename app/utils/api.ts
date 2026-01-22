import { type UserResponse } from '~/utils/Responses/UserResponse'
import type { CountryResponse } from './Responses/CountryResponse'
import type { UserUpdateRequest } from './Requests/UserUpdateRequest'
import { ApiError, EApiErrorCode } from '~/composables/useApiError'
import type { CreateCardRequest } from './Requests/CreateCardRequest'
import type { CardResponse } from './Responses/CardResponse'
import type { UpdateCardRequest } from './Requests/UpdateCardRequest'
import type { GetSimilarCardsRequest } from './Requests/GetSimilarCardsRequest'
import type { UpdateProfileAvatarRequest } from './Requests/UpdateProfileAvatartRequest'
import { Routes } from '~/utils/Routes'

const getApiBaseUrl = () => `${useRuntimeConfig().public.apiBase}/api`;

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

  const API_BASE_URL = getApiBaseUrl();
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
    return await requestAuth<UserResponse[]>(`${Routes.USERS}`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_USERS_FAILED,
    });
  },

  async updateUserAvatar(userId: string, request: UpdateProfileAvatarRequest): Promise<UserResponse> {
    let response = await requestAuth<UserResponse>(`${Routes.USERS}/${userId}/avatar`, {
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
    let response = await requestAuth<UserResponse>(`${Routes.USERS}/${userId}`, {
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
    return await requestAuth<UserResponse>(`${Routes.USERS}/me`, {
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
    const url: string = Routes.getExperienceCardUrl(userId);
    return await requestAuth<CardResponse[]>(url, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_EXPERIENCE_CARDS_FAILED,
    });
  },

  async getExperienceCardById(userId: string, cardId: string): Promise<CardResponse> {
    const url: string = Routes.getExperienceCardUrl(userId, cardId);
    return await requestAuth<CardResponse>(url, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_EXPERIENCE_CARD_FAILED,
    });
  },

  async deleteExperienceCardById(userId: string, cardId: string): Promise<void> {
    const url = Routes.getExperienceCardUrl(userId, cardId);
    await requestAuth<void>(url, {
      method: 'DELETE',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
    });
  },

  async createExperienceCard(userId: string, request: CreateCardRequest): Promise<CardResponse> {
    const url: string = Routes.getExperienceCardUrl(userId);
    return await requestAuth<CardResponse>(url, {
      method: 'POST',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  async updateExperienceCard(userId: string, cardId: string, request: UpdateCardRequest): Promise<CardResponse> {
    const url: string = Routes.getExperienceCardUrl(userId, cardId);
    return await requestAuth<CardResponse>(url, {
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
    const url: string = Routes.getChallengeCardUrl(userId);
    return await requestAuth<CardResponse[]>(url, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_CHALLENGE_CARDS_FAILED,
    });
  },

  async getChallengeCardById(userId: string, cardId: string): Promise<CardResponse> {
    const url = Routes.getChallengeCardUrl(userId, cardId);
    return await requestAuth<CardResponse>(url, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_CHALLENGE_CARD_FAILED,
    });
  },

  async deleteChallengeCardById(userId: string, cardId: string): Promise<void> {
    const url = Routes.getChallengeCardUrl(userId, cardId);
    await requestAuth<void>(url, {
      method: 'DELETE',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
    });
  },

  async createChallengeCard(userId: string, request: CreateCardRequest): Promise<CardResponse> {
    const url = Routes.getChallengeCardUrl(userId);
    return await requestAuth<CardResponse>(url, {
      method: 'POST',
      errorCode: EApiErrorCode.UNKNOWN_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  async updateChallengeCard(userId: string, cardId: string, request: UpdateCardRequest): Promise<CardResponse> {
      const url = Routes.getChallengeCardUrl(userId, cardId);
    return await requestAuth<CardResponse>(url, {
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
    const url = `${Routes.COLLECTIONS}/cards/similar`;
    return await requestAuth<CardResponse[]>(url, {
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
    return await requestAuth<CountryResponse[]>(`${Routes.COUNTRIES}`, {
      method: 'GET',
      errorCode: EApiErrorCode.GET_COUNTRIES_FAILED,
    });
  },
  //#endregion

}