import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
<<<<<<< HEAD

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
=======
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)){
  app.component(key, component)
>>>>>>> 0cc4715b609a7328dec4bc89f91e01697171871e
};
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')