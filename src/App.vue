<template>
  <v-app>
    <v-main>
      <router-view>
      <Login/>
      <Dashboard/>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',

  components: {
    Login,
    Dashboard,
  },

  data: () => ({
    //
  }),
};
</script>
