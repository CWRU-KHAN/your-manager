<template>
  <header>
    <div>
      <router-link to="/dashboard">
        <img src="../assets/ym-logo-bad.png" alt="Your Manager Logo">
        <router-link v-if="!loggedIn" to="/login">Login</router-link>
        <button v-if="loggedIn" type="button" @click="logout">Logout</button>
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.state.userCredentials.userToken
    }
  },
  methods: {
    logout() {
      this.$store.commit('setUserCredentials', {
        token: '',
        userName: '',
        usersid: ''
      })
      this.$router.push({ 'path': '/' })
    }
  }
}
</script>

<style scoped>
  header {
    background-color: lightblue;
  }
</style>
