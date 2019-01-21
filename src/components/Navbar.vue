<template>
<div class="navContainer">
    <div class="nav-left-sidebar">
            <img class="nav-ym-icon" src="@/assets/svg/ym-icon.svg">
        <nav class="navbar navbar-expand-lg">
            <a class="d-xl-none d-lg-none" href="#">Dashboard</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav flex-column">
                    <li class="nav-heading" v-if="!loggedIn">
                        Your Manager
                    </li>
                    <li class="nav-heading" v-if="loggedIn">
                        {{ this.$store.state.userCredentials.username }}
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-item-text" v-if="!loggedIn" to="/login">
                        <i class="fa fa-sign-in btn-icon" aria-hidden="true"></i>
                        Login
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="" v-if="!loggedIn" to="/signup">
                        <i class="fa fa-user-plus btn-icon" aria-hidden="true"></i>
                        Register
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="" v-if="loggedIn" to="/dashboard">
                            <i class="fa fa-home btn-icon" aria-hidden="true"></i>
                            Dashboard
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="" v-if="loggedIn" to="/event/create" alt>
                        <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                            Event
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="" v-if="loggedIn" to="/note/create" alt>
                        <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                            Note
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <button class="button button-red" v-if="loggedIn" type="button" @click="logout">
                        <i class="fa fa-sign-out btn-icon" aria-hidden="true"></i>
                        Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</div>
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

.nav-item {
    font-family: 'Open Sans', 'sans serif';
    font-size: .9em;
    line-height: 2em;
    letter-spacing: .1em;
    text-transform: uppercase;
    text-decoration: none;
    padding: .2em;
    margin: .5em 0em .5em 0em
}

a {
    color: #ededed
}

.nav-ym-icon {
    padding: 1em;
    height: 200px;
    width: 200px
}

.nav-heading {
    font-family: 'Open Sans', 'sans serif';
    font-size: 1.2em;
    font-weight: 400;
    line-height: 1em;
    letter-spacing: .1em;
    text-transform: uppercase;
    text-decoration: none;
    padding: .2em;
    color: #fbaf2c
}

.navContainer {
    height: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
}

.nav-left-sidebar {
    position: fixed;
    width: 264px;
    height: 100%;
    top: 0px;
    overflow: auto;
    background-color: #373737;
    box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.13);
}

.navbar-nav {
    width: 100%;
}

.navbar {
    position: relative;
    padding: 14px;
}

.button {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: .5em 2em .5em 2em;
    margin: 0em .5em 0em .5em
}

.button-icon {
    margin-right: .5em
}

.button-red {
    background-color: #d9534f;
    border: solid 2px transparent;
    color: #ededed;
    margin-top: 1em
  }

.button-red:hover {
    background-color: transparent;
    border: solid 2px #d9534f;
    color: #d9534f
}

/* .container {
    padding-left: 0px;
    width: 264px;
} */

/* .navbar-toggler {
    padding: .25rem 0.5rem;
    font-size: 1.25rem;
    line-height: 1;
    background-color: #ffffff;
    border: 1px solid transparent;
    border-radius: .25rem;
}

.nav-link[data-toggle="collapse"] {
    position: relative;
    display: flex;
    align-items: center;
}

.nav-link[data-toggle="collapse"]::after {
    display: inline-block;
    width: 0;
    height: 0;
    position: absolute;
    right: 20px;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
}

.nav-link[data-toggle="collapse"][aria-expanded="false"]:after {
    transform: rotate(-90deg);
}

.nav-link[data-toggle="collapse"]:after {
    transition: transform .35s ease, opacity .35s ease;
    opacity: .5;
} */

</style>
