import client from './client';

export const getMerchantFee = (merchant_name) =>
    client.get(`/reports/fee/${merchant_name}`);

export const getUserDues = (user_name) =>
    client.get(`/reports/dues/${user_name}`);

export const getUsersAtCreditLimit = () =>
    client.get('/reports/users-at-credit-limit');

export const getTotalDues = () =>
    client.get('/reports/total-dues');
