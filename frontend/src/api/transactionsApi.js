import client from './client';

export const getMyTransactions = () => client.get('/transactions/my');
export const getAllTransactions = () => client.get('/transactions/');
export const createTransaction = (user_name, merchant_name, amount) =>
    client.post('/transactions/', { user_name, merchant_name, amount });
