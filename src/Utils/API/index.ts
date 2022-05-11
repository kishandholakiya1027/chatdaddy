import api from './axios';
import apiTeam from './axiosTeam';

export const contacts = (queryParams: string = '') => api(`contacts?returnTotalCount=true&${queryParams}`, 'GET');
export const getToken = (data: string = '') => apiTeam(`token`, 'POST',data);