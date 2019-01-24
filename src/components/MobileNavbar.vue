<template>
  <nav>
    <img src='@/assets/svg/ym-icon.svg' @click="toDashboard" alt="Your Manager Logo" :style="{height: '95%', width: '95%'}">
<button class='inline-p' @click="logout">Logout</button>
  </nav>
</template>


<script>
export default {
  computed: {
    loggedIn() {
      return !!this.$store.state.userCredentials.userToken
    },
  },
  methods: {
    logout() {
      this.$store.commit('setUserCredentials', {
        token: '',
        userName: '',
        usersid: ''
      })
      this.$router.push({ 'path': '/' })
    },
    toDashboard() {
      this.$router.push({'name' : 'dashboard'})
    }
  }
}
</script>


<style scoped>
  nav {
    width: 100%;
    height: 10%;
    background-color: #373737;    
    position: relative;
  }

  .button {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: .5em 2em .5em 2em;
}

.button-red {
    background-color: #d9534f;
    border: solid 2px transparent;
    color: #ededed;
    margin-top: 1em;
    border-radius: .4em;
  }

  .inline-p {
    right: 5px;
    top: 5px;
    position: absolute;
  }



</style>
