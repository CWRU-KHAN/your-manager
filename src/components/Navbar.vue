<template>
<div class="navContainer">
    <div class="nav-left-sidebar">
            <router-link v-if="!loggedIn" to="/">
                <img class="nav-ym-icon" src="@/assets/svg/ym-icon.svg">
            </router-link>
            <router-link v-if="loggedIn" to="/dashboard">
                <img class="nav-ym-icon" src="@/assets/svg/ym-icon.svg">
            </router-link>
        <nav class="navbar navbar-expand-md">
            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- menu not logged in -->
                <ul v-if="!loggedIn" class="navbar-nav flex-column">
                    <li class="nav-heading">
                        Your Manager
                        <hr class="nav-line-break">
                    </li>
                    
                    <router-link tag="li" class="nav-item" to="/login">
                        <i class="fa fa-sign-in btn-icon" aria-hidden="true"></i>
                        Login
                    </router-link>
                    <router-link tag="li" class="nav-item" to="/signup">
                        <i class="fa fa-user-plus btn-icon" aria-hidden="true"></i>
                        Register
                    </router-link>
                </ul>

                <!-- menu logged in -->
                <ul v-if="loggedIn" class="navbar-nav flex-column">
                    <li class="nav-heading">
                        YM: <span class="nav-heading nav-heading-username">{{ this.$store.state.userCredentials.username }}</span>
                        <hr class="nav-line-break">
                    </li>
                    
                    <router-link tag="li" class="nav-item" to="/dashboard">
                        <i class="fa fa-home btn-icon" aria-hidden="true"></i>
                        Dashboard
                    </router-link>
                    
                    <br><br>

                    <li class="nav-heading">
                        Bands
                        <hr class="nav-line-break">
                    </li>
                    
                    <div v-if="bandsList.length && bandsList[0].id">

                        <li class="nav-item" v-for="userBand in bandsList" :key="'bandid' + userBand.id">
                            <div class="band" @click="goToBand(userBand.id)">{{ userBand.bandname }} </div>     
                        </li>
                    </div>

                    <router-link tag="li" class="nav-item" to="/band/join" alt>
                        <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                            Band
                    </router-link>

                    <br><br>


                    <li class="nav-heading">
                        Events
                        <hr class="nav-line-break">
                    </li>

                    <router-link tag="li" class="nav-item" to="/event/create" alt>
                        <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                            Event
                    </router-link>

                    <br><br>

                    <li class="nav-heading">
                        Notes
                        <hr class="nav-line-break">
                    </li>


                    <router-link tag="li" class="nav-item" to="/note/create" alt>
                        <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                            Note
                    </router-link>

                    <br><br>

                    <button class="button button-red btn-block nav-item" type="button" @click="logout">
                        <i class="fa fa-sign-out btn-icon" aria-hidden="true"></i>
                        Logout
                    </button>
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
      return !!this.$store.state.userCredentials.userToken
    },
    hasBands() {
      return !!this.$store.state.currentUser[0].bands && !!this.$store.state.currentUser[0].bands.length
    },
    bandsList() {
      return this.$store.state.currentUser && this.$store.state.currentUser[0] ? 
        this.$store.state.currentUser[0].bands :
        false 
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
    },
    goToBand(id) {
      this.$store.commit("setBandCredentials", id)
      this.$store.dispatch('getBandPage', {
          bandsid: this.$store.state.bandCredentials.bandsid,
          usersid: this.$store.state.userCredentials.usersid
        }).then(() => {

            this.$router.push({name : "bandDashboard"})
        })
    }
  }
}
</script>

<style scoped>

.force-white {
    color: #ededed
}

.nav-item {
    font-family: 'Open Sans', 'sans serif';
    font-size: .8em;
    line-height: 2em;
    letter-spacing: .1em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 1em .2em;
    margin: .1em 0em;
    color:#ededed;
    cursor: pointer;
}

.router-link-active {
    font-weight: 800;
    color: #ededed
}

.nav-item:hover {
    color: #373737;
    background-color: #ededed
}

.nav-item:active {
    font-weight: 800;
    color: #ededed
}

.nav-line-break {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ededed;
    margin: 1em 0em 0em 0em;
    padding: 0; 
}

.nav-ym-icon {
    padding: 1em;
    margin: 1em 0em 0em 0em;
    height: 175px;
    width: 175px
}

.nav-heading {
    font-family: 'Open Sans', 'sans serif';
    font-size: 1em;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    text-decoration: none;
    color: #fbaf2c;
    margin: 1em 0em
}

.nav-heading-username {
    color: #ededed
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

</style>
