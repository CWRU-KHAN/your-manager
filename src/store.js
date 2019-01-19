import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'

Vue.use(Vuex)
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    currentUser: {},
    currentBand: {},
    currentEvent: {},
    userCredentials: { 
      userToken: '',
      username: '',
      usersid: ''
    },
    bandCredentials: {
      bandsid: ''
    },
    bandToken: '',
    eventsid: '',
    userNotes: {},
    events: [],
    currentPageJson: {},
    calendarData: {},
    currentUploadedImage: '',
    errors: [],
    dashboardNotes: [],
    dashboardEvents: [],
    bandDashboardNotes: [],
    bandDashboardEvents: [],
    bandMembers: []

  },
  mutations: {
    setPage(state, data) {
      state.currentPageJson = data
    },
    setUserCredentials(state, { token, userName, usersid }) {
      state.userCredentials.userToken = token
      state.userCredentials.username = userName
      state.userCredentials.usersid = usersid
    },
    fillUserData(state, { data} ){
      state.currentUser = data
    },
    fillBandData(state, { data }){
      state.currentBand = data
    },
    fillEventData(state, { data }){
      state.currentEvent = data
    },
    setBandCredentials(state, id){
      state.bandCredentials.bandsid = id
    },
    setEvent(state, id){
      state.eventsid = id
    },
    fillCalendar(state, data) {
      state.calendarData = data
    },
    fillNotes(state, data) {
      state.userNotes = data
    },
    setBandToken(state, data){
      state.bandToken = data
    },
    setCurrentUploadedImage(state, data) {
      state.currentUploadedImage = data
    },
    addError(state, error){
      state.errors.push(error)
    },
    clearErrors(state){
      state.errors = []
    },
    addDashboardEvents(state, data) {
      state.dashboardEvents = state.dashboardEvents.concat(data)
    },
    addDashboardNotes(state, data) {
      state.dashboardNotes = state.dashboardNotes.concat(data)
    },
    addBandDashboardEvents(state, data) {
      state.bandDashboardEvents = state.bandDashboardEvents.concat(data)
    },
    addBandDashboardNotes(state, data) {
      state.bandDashboardNotes = state.bandDashboardNotes.concat(data)
    },
    addBandMembers(state, data) {
      state.bandMembers = state.bandMembers.concat(data)
    },
    clearDashboard(state) {
      state.dashboardEvents = []
      state.dashboardNotes = [] 
    }
  },
  getters: {
    getCurrentUploadedImage(state) {
      return state.currentUploadedImage
    },
    getCurrentErrors(state) {
      return state.errors
    }
  },
  actions: {
    userLogin({ commit }, credentials) {
      return axios.post('/api/auth', credentials).then(({data})  => {
          if (data.message) {
            commit('addError', data.message)
          } else {
            commit('setUserCredentials', data)
            router.push({name: 'dashboard'})
          }
      })
    },
    createUser({ commit }, credentials) {
      return axios.post('/api/user', credentials).then(({ data }) => {
          if (data.message) {
            commit('addError', data.message)
          } else {
            router.push({name: 'login'})
          }
      })
    },
    createBand({ commit }, credentials) {
      return axios.post('/api/band', credentials).then(({ data }) => {
        if (data.message) {
          commit('addError', data.message)
        } else {
        router.push({name: 'dashboard'})
        }
      })
    },
    createEvent({ commit }, details) {
      return axios.post('/api/event', details).then(({ data }) => {

        if (data.message) {
          commit('addError', data.message)
        } else {
        commit('setEvent', data.insertId)
        router.push({name: 'dashboard'})
        }
      })
    },
    createNote({ commit }, data) {
      return axios.post('/api/note', data).then(({ data }) => {
        if (data.message) {
          commit('addError', data.message)
        } else {
        router.push({name: 'dashboard'})
        }
      })
    },
    addUserToBand({ commit }, credentials) {
      return axios.post('/api/bandmate', credentials).then(({ data }) => {
        if (data.message) {
          commit('addError', data.message)
        } else {
        router.push({name: 'bandDashboard'})
        }
      })
    },
    createBandToken( { commit }, credentials){
      return axios.post('/api/bandtoken', credentials)
        .then(results => commit('setBandToken', results))
    },
    getBandPage( { commit }, { bandsid }){
      const queryString = `/api/band/${bandsid}`
      return axios.get(queryString)
        .then(data => commit('setPage', data))
    },
    getUserPage( { commit }, { usersid }){
      const queryString = `/api/userdashboard/${usersid}`
      return axios.get(queryString)
        .then(data => commit('setPage', data))
    },
    getEventPage( { commit }, id){
      const queryString = `/api/event/${id}`
      return axios.get(queryString)
        .then(data => commit('setPage', data))
    },
    getCalendarInfo( { commit }, { bandsid }){
      const queryString = `/api/event/${bandsid}`
      return axios.get(queryString)
        .then(data => commit('fillCalendar', data))
    },
    getUserNotes( { commit }, { usersid }){
      const queryString = `/api/usernotes/${usersid}`
      return axios.get(queryString) 
        .then(data => commit('fillNotes', data))
    },
    uploadImg({ commit }, data) {
      return axios.post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => commit('setCurrentUploadedImage', res.data))
    },
    updateUserInfo({ commit }, data) {
      return axios.put('/api/user', data)
        .then(success => {
          if (!success) commit('addError', 'Update not successful.')
          else router.push({name: 'dashboard'})
        })
    },
    updateUserPassword({ commit }, data) {
      return axios.put('/api/user/password', data)
        .then(success => {
          if (!success) commit('addError', 'Password not changed.')
          else router.push({name: 'dashboard'})
        })
    },
    updateBandInfo({ commit }, data) {
      return axios.put('/api/band', data)
        .then(success => {
          if (!success) commit('addError', 'Update not successful.')
          else router.push({name: 'bandDashboard'})
        })
    },
    updateEventInfo({ commit }, data) {
      return axios.put('/api/event', data)
        .then(success => {
          if (!success) commit('addError', 'Update not successful.')
          else router.push({name: 'eventInfo'})
        })
    },
    deleteBandmate({ commit }, data) {
      return axios.delete('/api/bandmate', data)
        .then(success => {
          if (!success) commit('addError', 'Band member not successfully removed.')
          else router.push({name: 'bandDashboard'})
        })
    },    
    deleteBandevent({ commit }, data) {
      return axios.delete('/api/bandevent', data)
        .then(success => {
          if (!success) commit('addError', 'Band not successfully removed from event.')
          else router.push({name: 'eventInfo'})
        })
    },
  }
})