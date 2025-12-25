export interface UserResponse {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface UserLoginResponse extends UserResponse {
  accessToken: string
}

export interface UserLoginRequest {
  email: string
  password: string
}

export interface UserRegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}


let accessToken: string | null = null
let currentUser: UserResponse | null = null


function withAuthHeaders(
  headers: Record<string, string> = {}
): Record<string, string> {
  if (!accessToken) return headers

  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
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

    accessToken = data.accessToken
    currentUser = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    }

    return currentUser
  },

  logout() {
    accessToken = null
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
