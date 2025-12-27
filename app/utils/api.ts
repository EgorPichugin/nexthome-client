import { type UserResponse } from '~/utils/Responses/UserResponse'
import { type UserLoginResponse } from '~/utils/Responses/UserLoginResponse'
import { type UserLoginRequest } from '~/utils/Requests/UserLoginRequest'
import { type UserRegisterRequest } from '~/utils/Requests/UserRegisterRequest'

export const accessToken = ref<string | null>(null)
let currentUser: UserResponse | null = null


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

export const api = {
  async registerUser(
    request: UserRegisterRequest
  ): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('REGISTER_FAILED')
    }

    return await response.json()
  },

  async loginUser(
    request: UserLoginRequest
  ): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('LOGIN_FAILED')
    }

    const data = (await response.json()) as UserLoginResponse

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
    const response = await fetch(`${API_BASE_URL}/Users`, {
      method: 'GET',
      headers: withAuthHeaders(),
    })

    console.log(response.status)

    if (response.status === 401) {
      throw new Error('NOT_AUTHENTICATED')
    }

    if (!response.ok) {
      throw new Error('GET_USERS_FAILED')
    }

    return await response.json()
  },
}
