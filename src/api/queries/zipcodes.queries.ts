import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { MaybeRef } from 'vue';
import { computed, unref } from 'vue';
import {
	getRecordFn,
	getRecordsByZipFn,
	getZipCodeFn,
	saveRecordFn,
} from '../services/zipcodes.services';
import type { SavedRecord } from '../../types/zipcode.types';

const ZIP_CODE_REGEX = /^\d{5}$/;

export const zipCodeQueries = (zipCode: MaybeRef<string>) => {
	const normalized = computed(() => unref(zipCode).trim());
	const isValid = computed(() => ZIP_CODE_REGEX.test(normalized.value));

	const zipCodeDataQuery = useQuery({
		queryKey: ['zipCode', normalized],
		queryFn: () => getZipCodeFn(normalized.value),
		staleTime: 1000 * 60 * 60,
		enabled: isValid,
	});

	return {
		zipCodeDataQuery,
	};
};

// Mutation para GUARDAR el registro (simula el POST al backend / JSON)
export const useSaveRecord = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (record: SavedRecord) => saveRecordFn(record),
		onSuccess: (record) => {
			// Refresca las queries de registros guardados para rehidratar la pantalla
			queryClient.invalidateQueries({
				queryKey: ['savedRecord', record.postCode, record.placeName],
			});
			queryClient.invalidateQueries({
				queryKey: ['savedRecordsByZip', record.postCode],
			});
		},
	});
};

// Query para RECUPERAR todos los registros guardados de un código postal.
// Se usa al cargar para autoseleccionar el lugar guardado.
export const useSavedRecordsByZip = (postCode: MaybeRef<string>) => {
	const pc = computed(() => unref(postCode).trim());
	return useQuery({
		queryKey: ['savedRecordsByZip', pc],
		queryFn: () => getRecordsByZipFn(pc.value),
		enabled: computed(() => !!pc.value),
	});
};

// Query para RECUPERAR el registro guardado (simula el GET del backend / JSON).
// Con el código postal + lugar seleccionado obtenemos nombre y teléfono.
export const useSavedRecord = (
	postCode: MaybeRef<string>,
	placeName: MaybeRef<string>
) => {
	const pc = computed(() => unref(postCode).trim());
	const pn = computed(() => unref(placeName));

	return useQuery({
		queryKey: ['savedRecord', pc, pn],
		queryFn: () => getRecordFn(pc.value, pn.value),
		enabled: computed(() => !!pc.value && !!pn.value),
	});
};
