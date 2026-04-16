<script setup lang="ts">
import { computed } from 'vue';
import { zipCodeQueries } from '../api/queries/zipcodes.queries';
import ZipcodeForm from './ZipcodeForm.vue';

const props = defineProps<{
	zipcode: string;
}>();

const emit = defineEmits<{
	'update:zipcode': [value: string];
}>();

const zipcodeRef = computed(() => props.zipcode);
const { zipCodeDataQuery } = zipCodeQueries(zipcodeRef);

const isValidZipcode = computed(() => /^\d{5}$/.test(props.zipcode.trim()));

const displayData = computed(() => {
	if (!isValidZipcode.value) return undefined;
	return zipCodeDataQuery.data.value;
});
</script>

<template>
	<ZipcodeForm
		:zipcode="zipcode"
		:data="displayData"
		:is-fetching="zipCodeDataQuery.isFetching.value"
		:is-error="zipCodeDataQuery.isError.value"
		@update:zipcode="emit('update:zipcode', $event)"
	/>
</template>
