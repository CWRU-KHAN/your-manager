import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import BandCreator from './views/BandCreator.vue'
import BandDashboard from './views/BandDashboard.vue'
import EventCreator from './views/EventCreator.vue'
import EventInfo from './views/EventInfo.vue'
import store from './store.js'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if (store.state.userToken) store.dispatch('getUserPage', {userName: store.state.userName, token: store.state.userToken}).then(() => next())
        else next('/login')
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter : (to, from, next) => {
        store.state.userToken ? next('/dashboard') : next()
      },
    },
    {
      path: '/band/create',
      name: 'bandCreator',
      component: BandCreator
    },
    {
      path: '/band/dashboard',
      name: 'bandDashboard',
      component: BandDashboard
    },
    {
      path: '/event/create',
      name: 'eventCreator',
      component: EventCreator
    },
    {
      path: '/event/info',
      name: 'eventInfo',
      component: EventInfo
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
