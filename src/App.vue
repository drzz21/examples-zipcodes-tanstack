<script setup lang="ts">
import { ref } from 'vue'
import ZipcodeForm from './components/ZipcodeForm.vue'
import type { ZipcodeData } from './components/ZipcodeForm.vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

interface TabItem {
  id: number
  data: ZipcodeData
}

let nextId = 1

function createEmptyTab(id: number): TabItem {
  return {
    id,
    data: {
      postCode: '',
      country: '',
      countryAbbreviation: '',
      places: [
        {
          placeName: '',
          longitude: '',
          latitude: '',
          state: '',
          stateAbbreviation: '',
        },
      ],
    },
  }
}

const tabs = ref<TabItem[]>([createEmptyTab(nextId++)])
const activeTab = ref<number>(tabs.value[0].id)

function addTab() {
  const tab = createEmptyTab(nextId++)
  tabs.value.push(tab)
  activeTab.value = tab.id
}

function removeTab(id: number) {
  if (tabs.value.length <= 1) return
  const index = tabs.value.findIndex(t => t.id === id)
  tabs.value.splice(index, 1)
  if (activeTab.value === id) {
    activeTab.value = tabs.value[Math.max(0, index - 1)].id
  }
}

function updateTabData(id: number, data: ZipcodeData) {
  const tab = tabs.value.find(t => t.id === id)
  if (tab) tab.data = data
}

function tabLabel(tab: TabItem, index: number): string {
  return tab.data.postCode.trim() ? tab.data.postCode : `Pestaña ${index + 1}`
}
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar elevation="0" color="white" border="b">
      <template #prepend>
        <v-avatar color="primary" rounded="lg" size="36" class="ml-3">
          <v-icon color="white" size="20">mdi-map-marker-multiple</v-icon>
        </v-avatar>
      </template>
      <v-app-bar-title>
        <span class="text-h6 font-weight-bold text-grey-darken-3">Códigos Postales</span>
        <span class="text-caption text-grey ml-2">Consulta de información</span>
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8" style="max-width: 900px;">

        <!-- Card principal con pestañas -->
        <v-card rounded="xl" elevation="1">

          <!-- Cabecera de pestañas -->
          <div class="d-flex align-center" style="border-bottom: 1px solid #e8edf2;">
            <v-tabs
              v-model="activeTab"
              color="primary"
              class="flex-grow-1"
              style="border-radius: 12px 0 0 0;"
            >
              <v-tab
                v-for="(tab, index) in tabs"
                :key="tab.id"
                :value="tab.id"
                class="text-none"
                style="min-width: 130px;"
              >
                <v-icon size="14" class="mr-1" :color="activeTab === tab.id ? 'primary' : 'grey'">
                  mdi-map-marker
                </v-icon>
                <span class="text-body-2 font-weight-medium">{{ tabLabel(tab, index) }}</span>
                <v-btn
                  v-if="tabs.length > 1"
                  icon
                  size="x-small"
                  variant="text"
                  color="grey"
                  class="ml-2"
                  style="width: 20px; height: 20px;"
                  @click.stop="removeTab(tab.id)"
                >
                  <v-icon size="12">mdi-close</v-icon>
                </v-btn>
              </v-tab>
            </v-tabs>

            <!-- Botón agregar pestaña -->
            <v-tooltip text="Nueva pestaña" location="bottom">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  icon
                  variant="text"
                  color="primary"
                  size="small"
                  class="mx-2"
                  @click="addTab"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>

          <!-- Contenido de las pestañas -->
          <v-tabs-window v-model="activeTab">
            <v-tabs-window-item
              v-for="tab in tabs"
              :key="tab.id"
              :value="tab.id"
            >
              <div class="pa-6">
                <ZipcodeForm
                  :model-value="tab.data"
                  @update:model-value="updateTabData(tab.id, $event)"
                />
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>

        <!-- Footer info -->
        <div class="d-flex align-center justify-center mt-4 gap-2">
          <v-icon size="14" color="grey">mdi-information-outline</v-icon>
          <span class="text-caption text-grey">Los datos se almacenan en memoria por sesión</span>
        </div>

      </v-container>
    </v-main>
      <VueQueryDevtools />
  </v-app>
</template>

