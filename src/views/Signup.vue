<template>
  <div>
    <h1>Register</h1>
    <form>

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>

      <label for="email"> Email
        <input 
          type="text" 
          id="email"
          v-model="email"
          autocomplete="email"
        />
      </label>

      <label for="username"> Username
        <input 
          type="text"
          id="username"
          v-model="username"
          placeholder="At least 4 characters"
          
        />
      </label>

      <label for="password"> Password
        <input 
          :type="show1 ? 'text' : 'password'"
          id="password"
          v-model="password"
          placeholder="At least 8 characters" 
          autocomplete="new-password"
        />
      </label>

      <label for="confirmPassword"> Confirm Password
        <input 
          :type="show1 ? 'text' : 'password'" 
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="At least 8 characters"
          autocomplete="new-password"
        />
      </label>

      <button 
        @click="show1 = !show1"
        type="button"> 
          {{ !show1 ? "Show Password" : "Hide Password" }} 
      </button>

      <button 
        @click='submit' 
        
        type="button">
          Signup
      </button>    

    </form>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: "Signup",

  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      show1: false,
      errors: []
    }
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    })
  },
  methods: {
    submit() {
      this.errors = []

      if (this.username.length < 4) this.errors.push('Username 4 characters or longer required.')
      if (this.password.length < 8) this.errors.push('Password 8 characters or longer required.')
      if (this.password !== this.confirmPassword) this.errors.push('Password and Confirm Password must match.')
      if (!this.validEmail(this.email)) this.errors.push('Must use a valid email.')


      if (!this.errors.length) {
        const credentials = {
          userName: this.username,
          password: this.password,
          email: this.email
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('createUser', credentials)
      }
    },

    validEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
</script>
