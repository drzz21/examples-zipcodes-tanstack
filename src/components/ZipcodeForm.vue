<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { ZipcodeData } from '../types/zipcode.types';
import {
	useSaveRecord,
	useSavedRecord,
	useSavedRecordsByZip,
} from '../api/queries/zipcodes.queries';

const props = defineProps<{
	zipcode: string;
	data?: ZipcodeData;
	isFetching: boolean;
	isError: boolean;
}>();

const emit = defineEmits<{
	'update:zipcode': [value: string];
}>();

// Estado local editable para los datos adicionales.
// No se liga al `data` de la query (que es de solo lectura / cache).
const form = reactive({
	name: '',
	phone: '',
});

// Índice del lugar seleccionado dentro de data.places.
const selectedIndex = ref(0);

const postCode = computed(() => props.data?.postCode ?? '');

// Registros guardados para este código postal (para autoseleccionar el lugar).
const { data: savedRecords } = useSavedRecordsByZip(postCode);

// Cuando llegan los datos de la API (o los registros guardados), decidimos
// qué lugar seleccionar: si hay un registro guardado, elegimos ese lugar;
// si no, el primero por defecto.
watch(
	[() => props.data, savedRecords],
	([data, records]) => {
		const places = data?.places ?? [];
		if (!places.length) {
			selectedIndex.value = -1;
			return;
		}
		// ¿Hay un registro guardado cuyo placeName coincida con algún lugar?
		const savedPlaceNames = (records ?? []).map((r) => r.placeName);
		const matchIndex = places.findIndex((p) =>
			savedPlaceNames.includes(p.placeName)
		);
		selectedIndex.value = matchIndex >= 0 ? matchIndex : 0;
	},
	{ immediate: true }
);

// Opciones para el menú desplegable de "Nombre del lugar"
const placeOptions = computed(() =>
	(props.data?.places ?? []).map((place, index) => ({
		title: place.placeName || `Lugar ${index + 1}`,
		value: index,
	}))
);

// Lugar actualmente seleccionado (los demás campos se derivan de aquí)
const selectedPlace = computed(
	() => props.data?.places[selectedIndex.value] ?? null
);

const selectedPlaceName = computed(() => selectedPlace.value?.placeName ?? '');

// --- Guardar (POST simulado) ---
const { mutate, isPending, isSuccess, isError: isSaveError, reset } =
	useSaveRecord();

const handleSubmit = () => {
	// No guardamos si aún no hay datos ni lugar seleccionado
	if (!props.data || !selectedPlace.value) return;

	reset();
	// Guardamos solo lo mínimo: el resto se rehidrata desde la API.
	mutate({
		postCode: props.data.postCode,
		placeName: selectedPlace.value.placeName,
		name: form.name,
		phone: form.phone,
	});
};

// --- Rehidratar (GET simulado) ---
// Con postCode + lugar seleccionado buscamos si hay un registro guardado.
const { data: savedRecord } = useSavedRecord(postCode, selectedPlaceName);

// Cuando aparece un registro guardado, precargamos nombre y teléfono.
const isPrefilled = ref(false);
watch(
	savedRecord,
	(record) => {
		if (record) {
			// Rehidratamos nombre y teléfono desde el registro guardado
			form.name = record.name;
			form.phone = record.phone;
			isPrefilled.value = true;
		} else {
			// No hay registro para este lugar: limpiamos si veníamos de un prellenado
			if (isPrefilled.value) {
				form.name = '';
				form.phone = '';
			}
			isPrefilled.value = false;
		}
	},
	{ immediate: true }
);

// Al cambiar de lugar, reseteamos el estado de la mutación (alerts de éxito/error)
watch(selectedPlaceName, () => {
	reset();
});
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
			placeholder="Ej. 01067"
			hint="Este campo es editable"
			persistent-hint
			class="mb-6"
			rounded="lg"
			:loading="isFetching"
		/>

		

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
						{{
							(data?.places?.length ?? 0) > 1
								? 'Selecciona el lugar que corresponde'
								: 'Localidades asociadas al código postal'
						}}
					</div>
				</div>
			</div>
		</div>

		<!-- Lugar: selección por menú desplegable -->
		<v-card
			v-if="data?.places?.length"
			variant="outlined"
			rounded="lg"
			class="mb-3 place-card"
		>
			<v-card-text class="pa-4">
				<v-row>
					<v-col cols="12" sm="6">
						<!-- Único campo editable: elegir el lugar -->
						<v-select
							v-model="selectedIndex"
							:items="placeOptions"
							item-title="title"
							item-value="value"
							label="Nombre del lugar"
							prepend-inner-icon="mdi-city"
							variant="outlined"
							color="primary"
							rounded="lg"
							density="compact"
							hint="Selecciona el lugar"
							persistent-hint
						/>
					</v-col>
					<v-col cols="12" sm="6">
						<v-text-field
							:model-value="selectedPlace?.state ?? ''"
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
							:model-value="selectedPlace?.stateAbbreviation ?? ''"
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
							:model-value="selectedPlace?.latitude ?? ''"
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
							:model-value="selectedPlace?.longitude ?? ''"
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

		<!-- Sección: Datos adicionales (editables) -->
		<div class="section-header mb-4 mt-2">
			<div class="d-flex align-center gap-2">
				<v-avatar color="deep-purple-lighten-1" size="32" rounded="lg">
					<v-icon size="18" color="white"
						>mdi-account-edit-outline</v-icon
					>
				</v-avatar>
				<div>
					<div
						class="text-subtitle-1 font-weight-bold text-grey-darken-3"
					>
						Datos adicionales
					</div>
					<div class="text-caption text-grey">
						Campos editables que se enviarán al endpoint
					</div>
				</div>
			</div>
		</div>

		<v-alert
			v-if="data?.places?.length"
			type="info"
			variant="tonal"
			density="compact"
			class="mb-4"
			icon="mdi-map-marker-check"
		>
			Lugar seleccionado:
			<strong>{{ selectedPlace?.placeName ?? 'ninguno' }}</strong>
		</v-alert>

		<v-alert
			v-if="isPrefilled"
			type="success"
			variant="tonal"
			density="compact"
			class="mb-4"
			icon="mdi-history"
		>
			Datos recuperados de un registro guardado para este código postal y
			lugar.
		</v-alert>

		<v-row>
			<v-col cols="12" sm="6">
				<v-text-field
					v-model="form.name"
					label="Nombre"
					prepend-inner-icon="mdi-account-outline"
					variant="outlined"
					color="primary"
					rounded="lg"
					placeholder="Ej. Juan Pérez"
				/>
			</v-col>
			<v-col cols="12" sm="6">
				<v-text-field
					v-model="form.phone"
					label="Teléfono"
					prepend-inner-icon="mdi-phone-outline"
					variant="outlined"
					color="primary"
					rounded="lg"
					placeholder="Ej. 555-123-4567"
				/>
			</v-col>
		</v-row>

		<v-alert
			v-if="isSuccess"
			type="success"
			variant="tonal"
			density="compact"
			class="mb-3"
		>
			Registro guardado. Recarga la página o cambia de pestaña y vuelve:
			los datos se recuperarán automáticamente.
		</v-alert>
		<v-alert
			v-if="isSaveError"
			type="error"
			variant="tonal"
			density="compact"
			class="mb-3"
		>
			Ocurrió un error al enviar los datos.
		</v-alert>

		<div class="d-flex justify-end">
			<v-btn
				color="primary"
				rounded="lg"
				prepend-icon="mdi-content-save"
				:loading="isPending"
				:disabled="!data || !selectedPlace || !form.name.trim()"
				@click="handleSubmit"
			>
				Guardar
			</v-btn>
		</div>
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
