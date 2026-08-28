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

// Registro mínimo que se persiste (el "JSON" guardado).
// Solo lo esencial: el resto se rehidrata desde la API con postCode.
export interface SavedRecord {
	postCode: string;
	placeName: string;
	name: string;
	phone: string;
}

