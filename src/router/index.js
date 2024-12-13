import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterUser.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    children: [
      {
        path: 'professionals',
        name: 'ListViewProfessionals',
        component: () => import('../views/Professionals/ListView.vue'),
      },
      {
        path: 'professionals/new',
        name: 'CreateProfessionalView',
        component: () => import('../views/Professionals/CreateProfessionalView.vue'),
      },
      {
        path: 'professionals/:id/edit',
        name: 'EditProfessionalView',
        component: () => import('../views/Professionals/EditView.vue'),
      },
      // Adicione outras rotas do dashboard aqui
    ],
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` // Adiciona o token ao header de auth
        next()
      } else {
        alert('You must be logged in to access the dashboard.')
        next('/')
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
