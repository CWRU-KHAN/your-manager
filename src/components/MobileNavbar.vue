<template>
  
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
  }
}
</script>


<style scoped>

</style>
