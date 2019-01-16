import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import BandCreator from './views/BandCreator.vue'
import BandDashboard from './views/BandDashboard.vue'
import EventCreator from './views/EventCreator.vue'
import EventInfo from './views/EventInfo.vue'
import CalendarView from './views/CalendarView'
import JoinBand from './views/JoinBand.vue'
import store from './store'
import axios from 'axios'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  beforeEach: (to, from, next) => {
    store.commit('clearErrors')
    next()
  },
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

       if (store.state.userCredentials.userToken) store.dispatch('getUserPage', store.state.userCredentials)
        .then(() => store.commit('fillUserData', store.state.currentPageJson))
        .then(() => next())
        else next('/login')
      }
    },
    //remove this route once calendar implemented onto dashboard
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter : (to, from, next) => {
        store.state.userCredentials.userToken ? next('/dashboard') : next()
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/band/create',
      name: 'bandCreator',
      component: BandCreator,
      beforeEnter: (to, from, next) => {
        store.state.userCredentials.userToken ? next() : next('/login')
      }
    },
    {
      path: '/band/dashboard',
      name: 'bandDashboard',
      component: BandDashboard,
      beforeEnter: (to, from, next) => {
        if (store.state.userCredentials.userToken) store.dispatch('getBandPage', store.state.bandCredentials)
        .then(() => {
          store.commit('fillBandData', store.state.currentPageJson)
          next()
        })
        else next('/login')
      }
    },
    {
      path: '/band/join',
      name: 'joinBand',
      component: JoinBand,
    },
    {
      path: '/event/create',
      name: 'eventCreator',
      component: EventCreator,
      beforeEnter: (to, from, next) => {
        store.state.userCredentials.userToken ? next() : next('/login')
      }
    },
    {
      path: '/event/info',
      name: 'eventInfo',
      component: EventInfo,
      beforeEnter: (to, from, next) => {
        if (store.state.userCredentials.userToken) store.dispatch('getEventPage', store.state.eventsid).then(() => next())
        else next('/login')
      }
    },
    {
      
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
})