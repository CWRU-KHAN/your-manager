<template>
  <div>
    <h1>Login</h1>
    <form>

      <label for="username"> Username
        <input 
          id='username'
          type="text" 
          v-model="username"
          autocomplete="username" /> 
      </label>

      <label for="password"> Password
        <input 
          id="password"
          name="password"
          v-model="password"
          autocomplete="current-password"
          :type="show1 ? 'text' : 'password'" /> 
      </label>

      <button 
        @click="show1 = !show1"
        type="button"> 
          {{ !show1 ? "Show Password" : "Hide Password" }} 
      </button>

      <button 
        @click='submit' 
        type="button">
          Login
      </button>    
    </form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      show1: false
    }
  },

  methods: {
    submit() {      
      const credentials = {
        userName: this.username,
        password: this.password
      }
      this.$store.commit('clearErrors')
      this.$store.dispatch('userLogin', credentials)     
    }    
  }
}
</script>
