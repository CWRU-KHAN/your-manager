<template>
  <div>
    <img src="@/assets/ym-login.png" class="login-icon" />
    <h1>Login</h1>
    <form>

      <label for="username"> Username
        <input 
          id='username'
          type="text" 
          v-model="username"
          autocomplete="username" /> 
      </label><br>

      <label for="password"> Password
        <input 
          id="password"
          name="password"
          v-model="password"
          autocomplete="current-password"
          :type="show1 ? 'text' : 'password'" /> 
      </label>

      <button class="btn-show-pass" 
        @click="show1 = !show1"
        type="button"> 
          {{ !show1 ? "Show" : "Hide" }} 
      </button> <br>

      <button class="btn"
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

      this.$store.dispatch('userLogin', credentials)
        .then(() => {
          this.$store.state.userToken ? this.$router.push({ name: 'dashboard' }) : this.password = ''
        })
    }    
  }
}
</script>

<style>

  @import url('https://fonts.googleapis.com/css?family=Open+Sans|Shrikhand');

  label {
    font-family: 'Open Sans', sans-serif
  }
  input {
    padding: 1em;
    margin: 1em
  }
  .btn-show-pass {
    border: none;
    margin: 1em;
    padding: 1em;
    color: #677794;
    background-color: transparent;
    font-family: 'Opens Sans', sans-serif;
  }
  .btn-show-pass:hover {
    color: #fbaf2c
  }
  .login-icon {
    padding: 0px;
    margin: 0px;
    height: 10%;
    width: 10%
  }

</style>
