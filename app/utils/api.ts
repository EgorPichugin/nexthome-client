export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface UserRegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const api = {
    async registerUser(userRequest: UserRegisterRequest): Promise<User> {
        const response = await fetch(`http://localhost:5295/api/Auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userRequest),
        });
        const json = await response.json();

        return json as User;
    }
}