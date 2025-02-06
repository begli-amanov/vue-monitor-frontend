import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

// PrimeVue imports
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import Chart from 'primevue/chart'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import Ripple from 'primevue/ripple'
import ToastService from 'primevue/toastservice'

// Variables and Function
const app = createApp(App)
const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{surface.50}',
      100: '{surface.100}',
      200: '{surface.200}',
      300: '{surface.300}',
      400: '{surface.400}',
      500: '{surface.500}',
      600: '{surface.600}',
      700: '{surface.700}',
      800: '{surface.800}',
      900: '{surface.900}',
      950: '{surface.950}',
    },
    colorScheme: {
      light: {},
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f4f4f4',
          100: '#e8e9e9',
          200: '#d2d2d4',
          300: '#bbbcbe',
          400: '#a5a5a9',
          500: '#8e8f93',
          600: '#77787d',
          700: '#616268',
          800: '#4a4b52',
          900: '#34343d',
          950: '#1d1e27',
        },
      },
    },
  },
})

export default Noir

app.directive('ripple', Ripple)
app.use(router)
app.mount('#app')
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)
app.component('Chart', Chart)

app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      prefix: 'p',
      darkModeSelector: '.my-app-dark',
    },
  },
  ripple: true,
})
