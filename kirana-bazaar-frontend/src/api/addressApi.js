import api from "../config/axios";

export const getUserAddresses  = (userId)          => api.get(`/addresses/user/${userId}`);
export const addAddress        = (userId, address) => api.post(`/addresses?userId=${userId}`, address);
export const updateAddress     = (id, address)     => api.put(`/addresses/${id}`, address);
export const deleteAddress     = (id)              => api.delete(`/addresses/${id}`);
export const setDefaultAddress = (id, userId)      => api.put(`/addresses/${id}/default?userId=${userId}`);