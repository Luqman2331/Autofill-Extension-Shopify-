import { createApp } from 'vue';
import App from './App.vue';
import { loadStorage } from './useStorage';
import './assets/scss/app.scss';

loadStorage().then(() => createApp(App).mount('#app')).catch(error => {
  console.error(error);
  document.getElementById('app')!.textContent = 'Could not load saved profiles. Reopen the extension to retry.';
});
