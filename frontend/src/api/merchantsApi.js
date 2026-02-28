import client from './client';

export const getMerchants = () => client.get('/merchants/');
export const createMerchant = (name, fee_percentage) =>
    client.post('/merchants/', { name, fee_percentage });
export const updateMerchantFee = (name, fee_percentage) =>
    client.patch(`/merchants/${name}`, { fee_percentage });
