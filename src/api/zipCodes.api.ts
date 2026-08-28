import axios from 'axios';

export const zipCodesApi = axios.create({
	baseURL: 'https://api.zippopotam.us/de/',
	headers: {
		'Content-Type': 'application/json',
	},
});
