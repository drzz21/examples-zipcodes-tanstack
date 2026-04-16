import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { VueQueryPlugin } from '@tanstack/vue-query';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' 

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
  },
})

createApp(App).use(VueQueryPlugin).use(vuetify).mount('#app');

