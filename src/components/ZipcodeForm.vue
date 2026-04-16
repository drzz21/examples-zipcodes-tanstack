<script setup lang="ts">
import type { ZipcodeData } from '../types/zipcode.types';

defineProps<{
	zipcode: string;
	data?: ZipcodeData;
	isFetching: boolean;
	isError: boolean;
}>();

const emit = defineEmits<{
	'update:zipcode': [value: string];
}>();
</script>

<template>
	<v-card elevation="0" rounded="lg" color="transparent">
		<!-- Sección: Código Postal -->
		<div class="section-header mb-4">
			<div class="d-flex align-center gap-2">
				<v-avatar color="primary" size="32" rounded="lg">
					<v-icon size="18" color="white"
						>mdi-map-marker-outline</v-icon
					>
				</v-avatar>
				<div>
					<div
						class="text-subtitle-1 font-weight-bold text-grey-darken-3"
					>
						Código Postal
					</div>
					<div class="text-caption text-grey">
						Ingresa el código postal a consultar
					</div>
				</div>
			</div>
		</div>

		<v-text-field
			:model-value="zipcode"
			@update:model-value="emit('update:zipcode', $event)"
			label="Código Postal"
			prepend-inner-icon="mdi-magnify"
			variant="outlined"
			color="primary"
			placeholder="Ej. 35201"
			hint="Este campo es editable"
			persistent-hint
			class="mb-6"
			rounded="lg"
			:loading="isFetching"
		/>

		<!-- Sección: País -->
		<div class="section-header mb-4">
			<div class="d-flex align-center gap-2">
				<v-avatar color="blue-lighten-1" size="32" rounded="lg">
					<v-icon size="18" color="white">mdi-earth</v-icon>
				</v-avatar>
				<div>
					<div
						class="text-subtitle-1 font-weight-bold text-grey-darken-3"
					>
						Información del País
					</div>
					<div class="text-caption text-grey">
						Campos de solo lectura
					</div>
				</div>
			</div>
		</div>

		<v-row>
			<v-col cols="12" sm="8">
				<v-text-field
					:model-value="data?.country ?? ''"
					label="País"
					prepend-inner-icon="mdi-flag-outline"
					variant="outlined"
					rounded="lg"
					disabled
					class="disabled-field"
				/>
			</v-col>
			<v-col cols="12" sm="4">
				<v-text-field
					:model-value="data?.countryAbbreviation ?? ''"
					label="Abreviación"
					prepend-inner-icon="mdi-alphabetical"
					variant="outlined"
					rounded="lg"
					disabled
					class="disabled-field"
				/>
			</v-col>
		</v-row>

		<!-- Sección: Lugares -->
		<div class="section-header mb-4 mt-2">
			<div class="d-flex align-center gap-2">
				<v-avatar color="teal-lighten-1" size="32" rounded="lg">
					<v-icon size="18" color="white"
						>mdi-city-variant-outline</v-icon
					>
				</v-avatar>
				<div>
					<div
						class="text-subtitle-1 font-weight-bold text-grey-darken-3"
					>
						Lugares
						<v-chip
							v-if="data?.places?.length"
							size="x-small"
							color="teal"
							class="ml-2"
						>
							{{ data.places.length }}
						</v-chip>
					</div>
					<div class="text-caption text-grey">
						Localidades asociadas al código postal
					</div>
				</div>
			</div>
		</div>

		<!-- Place cards -->
		<v-card
			v-for="(place, index) in (data?.places ?? [])"
			:key="index"
			variant="outlined"
			rounded="lg"
			class="mb-3 place-card"
		>
			<v-card-title
				class="py-3 px-4 bg-grey-lighten-5 d-flex align-center"
			>
				<v-icon size="16" color="teal" class="mr-2"
					>mdi-map-marker</v-icon
				>
				<span
					class="text-body-2 font-weight-semibold text-grey-darken-2"
				>
					{{ place.placeName || `Lugar ${index + 1}` }}
				</span>
				<v-chip
					v-if="place.stateAbbreviation"
					size="x-small"
					color="teal-lighten-2"
					class="ml-2"
				>
					{{ place.stateAbbreviation }}
				</v-chip>
			</v-card-title>
			<v-divider />
			<v-card-text class="pa-4">
				<v-row>
					<v-col cols="12" sm="6">
						<v-text-field
							:model-value="place.placeName"
							label="Nombre del lugar"
							prepend-inner-icon="mdi-city"
							variant="outlined"
							rounded="lg"
							disabled
							density="compact"
							class="disabled-field"
						/>
					</v-col>
					<v-col cols="12" sm="6">
						<v-text-field
							:model-value="place.state"
							label="Estado / Provincia"
							prepend-inner-icon="mdi-map"
							variant="outlined"
							rounded="lg"
							disabled
							density="compact"
							class="disabled-field"
						/>
					</v-col>
					<v-col cols="12" sm="4">
						<v-text-field
							:model-value="place.stateAbbreviation"
							label="Abrev. Estado"
							variant="outlined"
							rounded="lg"
							disabled
							density="compact"
							class="disabled-field"
						/>
					</v-col>
					<v-col cols="6" sm="4">
						<v-text-field
							:model-value="place.latitude"
							label="Latitud"
							prepend-inner-icon="mdi-latitude"
							variant="outlined"
							rounded="lg"
							disabled
							density="compact"
							class="disabled-field"
						/>
					</v-col>
					<v-col cols="6" sm="4">
						<v-text-field
							:model-value="place.longitude"
							label="Longitud"
							prepend-inner-icon="mdi-longitude"
							variant="outlined"
							rounded="lg"
							disabled
							density="compact"
							class="disabled-field"
						/>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-card>
</template>

<style scoped>
.disabled-field :deep(.v-field__input) {
	color: #546e7a !important;
	opacity: 1 !important;
}
.disabled-field :deep(.v-field) {
	background-color: #f8fafc !important;
}
.place-card {
	border-color: #e0e7ef !important;
}
.section-header {
	padding: 0;
}
</style>
