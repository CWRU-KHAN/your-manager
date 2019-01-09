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
      bandToken: '',
      bandsid: ''
    },
    eventsid: '',
    userNotes: {},
    events: [],
    currentPageJson: {},
    calendarData: {},
    currentUploadedImage: ''
    errors: []
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
    setBandCredentials(state, { token, bandsid }){
      state.bandCredentials.bandToken = token
      state.bandCredentials.bandsid = bandsid
    },
    setEvent(state, { eventsid }){
      state.eventsid = eventsid
    },
    fillCalendar(state, data) {
      state.calendarData = data
    },
    fillNotes(state, data) {
      state.userNotes = data
    },
    setBandToken(state, data){
      state.bandCredentials.bandToken = data
    },
    setCurrentUploadedImage(state, data) {
      console.log(data)
      state.currentUploadedImage = data
    }
  },
  getters: {
    getCurrentUploadedImage(state) {
      return state.currentUploadedImage
    addError(state, error){
      state.errors.push(error)
    },
    clearErrors(state){
      state.errors = []
    }
  },
  actions: {
    userLogin({ commit }, credentials) {
      return axios.post('/api/auth', credentials).then(({ data, error })  => {
        if (error) {
          commit('addError', error)
        } else { 
          commit('setUserCredentials', data)
          router.push({name: 'dashboard'})
        }
      })
    },
    createUser(context, credentials) {
      return axios.post('/api/user', credentials).then(res => {
        router.push({name: 'login'})
      })
    },
    createBand(context, credentials) {
      return axios.post('/api/band', credentials).then(res => {
        router.push({name: 'dashboard'})
      })
    },
    cancelCreation({ commit }){

    },
    createEvent(context, data) {
      return axios.post('/api/event', data).then(res => {
        router.push({name: 'bandDashboard'})
      })
    },
    createNote(context, data) {
      return axios.post('/api/note', data).then(res => {
        router.push({name: 'eventInfo'})
      })
    },
    addUserToBand(context, credentials) {
      return axios.post('/api/bandmate', credentials).then(res => {
        router.push({name: 'bandDashboard'})
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
      const queryString = `/api/user/${usersid}`
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
    }
  }
})
