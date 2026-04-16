import { useQuery } from '@tanstack/vue-query';
import type {MaybeRef} from '@vueuse/core';
import { unref } from 'vue';
import { getZipCodeFn } from '../services/zipcodes.services';

export const zipCodeQueries = (zipCode: MaybeRef<string>) => {
	const zipCodeDataQuery = useQuery({
		queryKey: ['zipCode', zipCode],
		queryFn: () => getZipCodeFn(unref(zipCode)),
		staleTime: 1000 * 60 * 60,
	});

	return {
		zipCodeDataQuery,
	};
};
