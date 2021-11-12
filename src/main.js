import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(VueRouter);

const router = new VueRouter({
  routes: Routes
})

new Vue({
  vuetify,
  router: router,
  render: h => h(App)
}).$mount('#app')
