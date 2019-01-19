<template>

<div class="container py-4 my-3 mx-auto">
      <form>
    <div class="row justify-content-start">
      <div class="col">
        <img class="ym-luggage" src="@/assets/svg/ym-icon-luggage.svg">
      </div>
      <div class="col-12 col-md-8 col-lg-6 col-xl-5 text-left">
        <div class="form-box">
          <div class="row">
            <div class="col">
              <h1>Log In</h1>
              <p class="lead">Here goes a tagline that I haven't come up with yet</p>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
              <input 
              class="form-control"
              placeholder="Username"
          id='username'
          type="text" 
          v-model="username"
          autocomplete="username" />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col">
              <input 
              class="form-control"
              placeholder= "Password"
          id="password"
          name="password"
          v-model="password"
          autocomplete="current-password"
          :type="show1 ? 'text' : 'password'" />
          <button class="btn btn-show-password"
        @click="show1 = !show1"
        type="button"> 
          {{ !show1 ? "Show Password" : "Hide Password" }} 
      </button> 
            </div>
          </div>
          <div class="row mt-4">
            <div class="col">
              <button class="btn btn-login-2"
        @click='submit' 
        type="button">
          Login
      </button>
      <router-link class="btn btn-register" to="/signup">
          <i class="fa fa-user-plus btn-icon" aria-hidden="true"></i>
          register
        </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
      </form>
  </div>

</template>

<script>

import { mapGetters } from 'vuex'

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
    ...mapGetters({
      errors: 'getCurrentErrors'
    })
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

<style>

.ym-luggage {
  height: 500px;
  width: auto;
  float: right
}

input {
  font-family: 'Open Sans', 'san-serif';
  margin: .1em
}

.lead {
  font-family: 'Open Sans', 'san-serif';
  font-size: 1.4em;
  font-weight: 400;
}

.btn {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: .5em 2em .5em 2em;
    margin: 0em .5em 0em .5em
  }

  .btn-icon {
    margin-right: .5em
  }

  .btn-login-2 {
    font-size: 1em;
    padding: .5em 3em .5em 3em;
    background-color: #373737;
    border: solid 2px transparent;
    color: #ededed;
  }

  .btn-login-2:hover {
    background-color: #677794;
    border: solid 2px #677794;
    color: #ededed
  }

.button-show-password {
  font-family: 'Open Sans', 'san-serif';
  font-size: .75em;
  font-style: italic;
}

.form-box {
  background: #ededed;
  padding: 3.75em 2.5em;
  overflow: hidden;
  color: #373737;
  border-radius: .25em;
  box-shadow: 0 .3125rem .875rem 0 rgba(129,129,129,.2) !important;
}

</style>