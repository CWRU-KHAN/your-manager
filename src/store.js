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
    userCredentials: { 
      userToken: '',
      username: '',
      usersid: ''
    },
    bandToken: '',
    events: [],
    currentPageJson: {}
  },
  mutations: {
    setPage(state, data) {
      state.currentPageJson = data
    },
    setUserCredentials(state, { token, userName, usersid }) {
      state.userCredentials.userToken = token
      state.userCredentials.username = userName
      state.userCredentials.usersid = usersid
    }

  },
  actions: {
    userLogin({ commit }, credentials) {
      return axios.post('/api/auth', credentials).then(data => {
        commit('setUserCredentials', data)
      })
    },
    createUser(context, credentials) {
      return axios.post('/api/user', credentials).then(res => {
        
      })
    },
    createBand(context, credentials) {
      return axios.post('/api/band', credentials).then(res => {

      })
    },
    cancelCreation({ commit }){

    },
    createEvent(context, data) {
      return axios.post('/api/event', data).then(res => {

      })
    },
    createNote(context, data) {
      return axios.post('/api/note', data).then(res => {

      })
    },
    addUserToBand(context, credentials) {
      return axios.post('/api/bandmate', credentials).then(res => {

      })
    },
    getBandPage( { commit }, { id }){
      const queryString = `/api/band/${id}`
      return axios.get(queryString)
        .then(data => commit('setPage', data))
    },
    getUserPage( { commit }, { id }){
      const queryString = `/api/user/${id}`
      return axios.get(queryString)
        .then(data => commit('setPage', data))
    },
    getEventPage( { commit }, { id }){
      const queryString = `/api/event/${id}`
      return axios.get(queryString)
        .then(data => commit('setPage', data))
    },
    uploadImg(context, data) {
      return axios.post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {

      })
    }
  }
})
