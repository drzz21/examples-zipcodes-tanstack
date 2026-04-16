import axios from 'axios';

export const zipCodesApi = axios.create({
	baseURL: 'https://api.zippopotam.us/us/',
	headers: {
		'Content-Type': 'application/json',
	},
});
