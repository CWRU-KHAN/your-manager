<template>
  
  <div class="container py-4 my-3 mx-auto">
    <div class="row justify-content-start">
      
      <div class="col-12 col-md-8 col-lg-6 col-xl-5 text-left">
        
        <div class="form-box-register">
          <div class="row">
            <div class="col">
              <h1>Sign Up</h1>
              <p class="lead">You are one step away from organizational harmony.</p>
              <br>
                    
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
                    <label for="email"> Email
        <input
          class="form-control"
          type="text" 
          id="email"
          v-model="email"
          autocomplete="email"
        />
      </label>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
              <label for="username"> Username
        <input 
          class="form-control"
          type="text"
          id="username"
          v-model="username"
          placeholder="At least 4 characters"
        />
      </label>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col">
                    <label for="password"> Password
        <input 
          class="form-control"
          :type="show1 ? 'text' : 'password'"
          id="password"
          v-model="password"
          placeholder="At least 8 characters" 
          autocomplete="new-password"
        />
      </label>
          <button class="btn btn-show-password-2"
        @click="show1 = !show1"
        type="button"> 
          {{ !show1 ? "Show Password" : "Hide Password" }} 
      </button> 
            </div>
          </div>
          <div class="row mt-4">
            <div class="col">
<label for="confirmPassword"> Confirm Password
        <input 
          class="form-control"
          :type="show1 ? 'text' : 'password'" 
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="At least 8 characters"
          autocomplete="new-password"
        />
      </label>
            </div>
          </div>

          <div class="row mt-4">
            <div class="col">
                    <button class="btn btn-register-2"
        @click='submit' 
        
        type="button">
          Register
      </button>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col">
              <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <img class="ym-luggage-icons" src="@/assets/ymLuggageIcons.png">
      </div>
    </div>
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

<style>

.ym-luggage-icons {
  float: left;
  height: 500px;
  width: 400px
}

.button-show-password-2 {
  font-family: 'Open Sans', 'san-serif';
  font-size: .75em;
  font-style: italic;
  float: right
}

.btn-register-2 {
    font-size: 1em;
    padding: .5em 3em .5em 3em;
    background-color: #fbaf2c;
    border: solid 1px #ededed;
    color: #373737;
  }

  .btn-register-2:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #373737
  }

  .form-box-register {
  background: #ededed;
  padding: 3.75em 2.5em;
  overflow: hidden;
  color: #373737;
  border-radius: .25em;
  box-shadow: 0 .3125rem .875rem 0 rgba(129,129,129,.2) !important;
}


</style>
