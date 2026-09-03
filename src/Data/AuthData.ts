import type { LoginType, User } from '../Types/Types';

export class AuthData {

    static async login(user: LoginType, url: string): Promise<string> {
        
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
            credentials: 'include',
        });

        const data = await res.text();

        if (!res.ok) {
            throw Error(data);
        }

        localStorage.setItem('token', JSON.stringify(data));

        return data;
    }

    static async getProfile(token: string, url: string): Promise<User> {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw Error(data);
        }

        return data;
    }
}
