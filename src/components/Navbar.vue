<template>
  <header>
    <nav class="navbar navbar-fix">
        <router-link to="/" v-if="!loggedIn">
            <h1 class="nav-text">
              <img class="nav-icon" src="@/assets/svg/ym-icon.svg">
              <span class="nav-text-heavy">Your</span>Manager
            </h1>
        </router-link>
        <router-link to="/dashboard" v-if="loggedIn">
            <h4 class="nav-text">
              <img class="nav-icon" src="@/assets/svg/ym-icon.svg">
            <span class="nav-text-username">
              {{ this.$store.state.userCredentials.username }}
            </span>
            </h4>
        </router-link>

        <div class="nav-float-right">

        <router-link class="btn btn-login" v-if="!loggedIn" to="/login">
          <i class="fa fa-sign-in btn-icon" aria-hidden="true"></i>
          Login
        </router-link>
        <router-link class="btn btn-register" v-if="!loggedIn" to="/signup">
          <i class="fa fa-user-plus btn-icon" aria-hidden="true"></i>
          Register
        </router-link>
        
        <router-link class="btn btn-dashboard" v-if="loggedIn" to="/dashboard">
            <i class="fa fa-home btn-icon" aria-hidden="true"></i>
            Dashboard
        </router-link>
        <router-link class="btn btn-event-create" v-if="loggedIn" to="/event/create" alt>
          <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
            Event
        </router-link>
        <router-link class="btn btn-note-create" v-if="loggedIn" to="/note/create" alt>
          <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
            Note
        </router-link>
        
        <button class="btn btn-logout" v-if="loggedIn" type="button" @click="logout">
        <i class="fa fa-sign-out btn-icon" aria-hidden="true"></i>
          Logout
        </button>

        </div>

    </nav>
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
    padding: 1em;
    margin: 0;
    background-color: #373737;
  }

  .nav-icon {
    height: 40px;
    width: 40px;
    margin-right: .6em;
  }

  .nav-text {
    font-family: 'Montserrat', 'sans-serif';
    font-size: 1em;
    font-weight: 200;
    text-transform: uppercase;
    letter-spacing: .15em;
    color: #ededed;
    float: left;
  }

  .nav-text-heavy {
    font-weight: 900;
    color: #fbaf2c
  }
  
  .nav-text-username {
    font-family: 'Open Sans', 'sans-serif';
    font-size: .75em;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 0em .5em 0em .5em
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

  .btn-login {
    background-color: transparent;
    border: solid 1px #ededed;
    color: #ededed;
  }

  .btn-login:hover {
    background-color: #ededed;
    border: solid 2px #ededed;
    color: #677794
  }
  
  .btn-logout {
    background-color: #d9534f;
    border: solid 1px #d9534f;
    color: #ededed;
  }

  .btn-logout:hover {
    background-color: transparent;
    border: solid 2px #d9534f;
    color: #d9534f
  }

  .btn-register {
    background-color: #fbaf2c;
    border: solid 1px #fbaf2c;
    color: #373737;
  }

  .btn-register:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #fbaf2c
  }
  
  .btn-dashboard {
    background-color: #fbaf2c;
    border: solid 1px #fbaf2c;
    color: #373737;
  }

  .btn-dashboard:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #fbaf2c
  }
  
  .btn-event-create {
    background-color: #677794;
    border: solid 1px #677794;
    color: #ededed;
  }

  .btn-event-create:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #ededed
  }

  .btn-note-create {
    background-color: #979797;
    border: solid 1px #979797;
    color: #ededed;
  }

  .btn-note-create:hover {
    background-color: transparent;
    border: solid 2px #979797;
    color: #ededed
  }

  

</style>
