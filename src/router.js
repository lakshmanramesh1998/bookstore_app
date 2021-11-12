import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

export default [
    {path: "/", component: Login, name: "login_page"},
    {path: "/dashboard", component: Dashboard, name: "dashboard_page"},
]