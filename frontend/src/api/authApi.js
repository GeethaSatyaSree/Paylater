import client from './client';

export const login = (email, password) =>
    client.post('/auth/login', { email, password });

export const register = (name, email, password, credit_limit) =>
    client.post('/auth/register', { name, email, password, credit_limit });

export const getMe = () => client.get('/users/me');
