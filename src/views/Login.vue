<template>
  <div>
    <form>
      <label for="username"> Username
        <input 
          id='username'
          type="text" 
          v-model="username"
          autocomplete="username" /> {{ username.length > 3 ? '' : 'At least 4 characters' }}
      </label>

      <label for="password"> Password
        <input 
          id="password"
          name="password"
          v-model="password"
          autocomplete="current-password"
          :type="show1 ? 'text' : 'password'" /> {{ password.length > 7 ? '' : 'At least 8 characters' }}
      </label>
      <button 
        @click="show1 = !show1"
        type="button"> 
          {{ !show1 ? "Show Password" : "Hide Password" }} 
        </button>
      <button 
        @click='submit' 
        :disabled="!valid"
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

  computed: {
    valid() {      
      return this.password.length > 7 && this.username.length > 3
    }
  },

  methods: {
    submit() {
      if (this.valid) {
        const credentials = {
          userName: this.username,
          password: this.password
        }

        this.$store.dispatch('authUser', credentials)
          .then(() => {
            this.$store.state.userToken ? this.$router.push({ name: 'dashboard' }) : this.password = ''
          })
      }
    }
  }
}
</script>
