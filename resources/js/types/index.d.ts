export interface Auth {
    user: User;
}

export interface User {
    id: number;
    name: string;
    username: string;
    plain_password: string;
    role: 'administrator' | 'judge';
    created_at: string;
    updated_at: string;
}
