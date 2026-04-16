import { useQuery } from '@tanstack/vue-query';
import type { MaybeRef } from 'vue';
import { computed, unref } from 'vue';
import { getZipCodeFn } from '../services/zipcodes.services';

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
