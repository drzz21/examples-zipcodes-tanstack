export interface PlaceInfo {
	placeName: string;
	longitude: string;
	latitude: string;
	state: string;
	stateAbbreviation: string;
}

export interface ZipcodeData {
	postCode: string;
	country: string;
	countryAbbreviation: string;
	places: PlaceInfo[];
}
