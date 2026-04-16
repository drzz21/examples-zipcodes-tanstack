import { zipCodesApi } from '../zipCodes.api';
import type { ZipcodeData } from '../../types/zipcode.types';

interface ZippopotamPlace {
	'place name': string;
	longitude: string;
	latitude: string;
	state: string;
	'state abbreviation': string;
}

interface ZippopotamResponse {
	'post code': string;
	country: string;
	'country abbreviation': string;
	places: ZippopotamPlace[];
}

export const getZipCodeFn = async (zipCode: string): Promise<ZipcodeData> => {
	const { data } = await zipCodesApi.get<ZippopotamResponse>(zipCode);
	return {
		postCode: data['post code'],
		country: data.country,
		countryAbbreviation: data['country abbreviation'],
		places: data.places.map((place) => ({
			placeName: place['place name'],
			longitude: place.longitude,
			latitude: place.latitude,
			state: place.state,
			stateAbbreviation: place['state abbreviation'],
		})),
	};
};