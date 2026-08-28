import { zipCodesApi } from '../zipCodes.api';
import type { SavedRecord, ZipcodeData } from '../../types/zipcode.types';

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

// ---------------------------------------------------------------------------
// Persistencia simulada (el "JSON")
//
// Simulamos un backend usando localStorage como si fuera un archivo JSON.
// El navegador no puede escribir archivos en disco, así que localStorage
// hace de almacenamiento persistente entre recargas.
//
// PARA PASAR A BACKEND REAL: reemplaza el cuerpo de estas dos funciones por
// llamadas axios, sin tocar nada más de la app. Por ejemplo:
//   saveRecordFn  ->  await api.post('/records', record)
//   getRecordFn   ->  const { data } = await api.get(`/records/${postCode}`)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'zipcode-records';

// Lee el "JSON" completo (todos los registros guardados)
const readAll = (): SavedRecord[] => {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as SavedRecord[];
	} catch {
		return [];
	}
};

// Guarda un registro. Si ya existe uno con el mismo postCode + placeName,
// lo reemplaza (comportamiento tipo "upsert").
export const saveRecordFn = async (
	record: SavedRecord
): Promise<SavedRecord> => {
	const records = readAll();
	const index = records.findIndex(
		(r) => r.postCode === record.postCode && r.placeName === record.placeName
	);
	if (index >= 0) {
		records[index] = record;
	} else {
		records.push(record);
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
	return record;
};

// Recupera un registro guardado por código postal + nombre de lugar.
// Devuelve null si no hay nada guardado para esa combinación.
export const getRecordFn = async (
	postCode: string,
	placeName: string
): Promise<SavedRecord | null> => {
	const records = readAll();
	return (
		records.find(
			(r) => r.postCode === postCode && r.placeName === placeName
		) ?? null
	);
};

// Recupera todos los registros guardados de un código postal (sin filtrar lugar)
export const getRecordsByZipFn = async (
	postCode: string
): Promise<SavedRecord[]> => {
	return readAll().filter((r) => r.postCode === postCode);
};