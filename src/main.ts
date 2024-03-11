import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import withUUID from "vue-uuid";
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = withUUID(
  createApp(App),
);

app.use(router)

app.use(store)

app.use(Vue3Toastify, {
  autoClose: 1500,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
});

app.mount('#app').$nextTick(() => {
  // Remove Preload scripts loading
  postMessage({ payload: 'removeLoading' }, '*')

  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
