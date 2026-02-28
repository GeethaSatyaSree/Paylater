import client from './client';

export const createPayback = (user_name, amount) =>
    client.post('/paybacks/', { user_name, amount });
