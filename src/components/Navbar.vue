<template>
<div class="container navContainer">
    <div class="nav-left-sidebar sidebar-dark nav-fix-left">
    <div class="menu-list">
        <nav class="navbar navbar-expand-lg navbar-light">
            <a class="d-xl-none d-lg-none" href="#">Dashboard</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav flex-column">
                    <li class="nav-divider">
                        Menu
                    </li>
                    <li class="nav-item">
                        <router-link class="btn btn-login" v-if="!loggedIn" to="/login">
                        <i class="fa fa-sign-in btn-icon" aria-hidden="true"></i>
                        Login
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="btn btn-register" v-if="!loggedIn" to="/signup">
                        <i class="fa fa-user-plus btn-icon" aria-hidden="true"></i>
                        Register
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="btn btn-dashboard" v-if="loggedIn" to="/dashboard">
                            <i class="fa fa-home btn-icon" aria-hidden="true"></i>
                            Dashboard
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="btn btn-event-create" v-if="loggedIn" to="/event/create" alt>
                        <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                            Event
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="btn btn-note-create" v-if="loggedIn" to="/note/create" alt>
                        <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                            Note
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <button class="btn btn-logout" v-if="loggedIn" type="button" @click="logout">
                        <i class="fa fa-sign-out btn-icon" aria-hidden="true"></i>
                        Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
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

.nav-fix-left {
    float: left;
    width: 20%;
    overflow-x: hidden
}

  .navigation-horizontal {

    width: 100%;
    height: 100%;

    overflow: auto;
   /* background-color: #fff;
    -webkit-box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.13);
    box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.13);
    -webkit-transition: all 0.3s ease;*/
}

.navContainer {
    height: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
}

.container {
    padding-left: 0px;
    width: 264px;
}

.navigation-horizontal .nav-link[data-toggle="collapse"] {
    position: relative;
    display: flex;
    align-items: center;
}

.navigation-horizontal .nav-link[data-toggle="collapse"]::after {
    display: inline-block;
    width: 0;
    height: 0;
    position: absolute;
    right: 8px;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
}

.navigation-horizontal .nav-link[data-toggle="collapse"][aria-expanded="false"]:after {
    transform: rotate(-90deg);
}

.navigation-horizontal .nav-link[data-toggle="collapse"]:after {
    transition: transform .35s ease, opacity .35s ease;
    opacity: .5;
}

.navigation-horizontal .navbar-nav {
    width: 100%;
}

.navigation-horizontal .navbar {
    position: relative;
    padding: 0px;
}

.navigation-horizontal .navbar-nav .nav-link {
   font-size: 13px;
    padding: 9px 30px 9px 20px;
    margin-bottom: 2px;
    color: #71789e;
    transition: 0.3s;
    margin: 6px 1px;
}

.navigation-horizontal .nav-link i {
    font-size: 14px;
    margin-right: 9px;
    text-align: center;
    vertical-align: middle;
    line-height: 16px;
}

.nav-divider {
    padding: 10px 14px;
    line-height: 30px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
}

.navigation-horizontal .submenu {
       background-color: #e2e2eb;
}

.navigation-horizontal .submenu .nav .nav-item .nav-link {
    font-size: 12px;
    padding: 0px 12px;
    transition: 0.3s;
    line-height: 1;
}

.navigation-horizontal .navbar-nav .nav-link:focus,
.navigation-horizontal .navbar-nav .nav-link.active {
    background-color: #e2e2eb;
    color: #3d405c;
    border-radius: 2px;
}

.navigation-horizontal .navbar-nav .nav-link:focus,
.navigation-horizontal .navbar-nav .nav-link:hover {
    background-color: #e2e2eb;
    color: #3d405c;
    border-radius: 2px;
}

.navigation-horizontal .submenu .nav .nav-item .nav-link:hover {
    color: #3d405c;
    border-radius: 2px;
    background-color: transparent;
}

.nav-left-sidebar {
    position: fixed;
    width: 264px;
    height: 100%;
    top: 0px;
    overflow: auto;
    background-color: #fff;
    -webkit-box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.13);
    box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.13);
    -webkit-transition: all 0.3s ease;
}

.nav-left-sidebar .nav-link[data-toggle="collapse"] {
    position: relative;
    display: flex;
    align-items: center;
}

.nav-left-sidebar .nav-link[data-toggle="collapse"]::after {
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

.nav-left-sidebar .nav-link[data-toggle="collapse"][aria-expanded="false"]:after {
    transform: rotate(-90deg);
}

.nav-left-sidebar .nav-link[data-toggle="collapse"]:after {
    transition: transform .35s ease, opacity .35s ease;
    opacity: .5;
}

.nav-left-sidebar .navbar-nav {
    width: 100%;
}

.nav-left-sidebar .navbar {
    position: relative;
    padding: 14px;
}

.nav-left-sidebar .navbar-nav .nav-item {}

.nav-left-sidebar .navbar-nav .nav-link {
    font-size: 14px;
    padding: 12px;
    /* margin-bottom: 2px; */
    color: #71789e;
    transition: 0.3s;
}

.nav-left-sidebar .nav-link i {
    font-size: 14px;
    margin-right: 9px;
    text-align: center;
    vertical-align: middle;
    line-height: 16px;
}

.nav-divider {
    padding: 10px 14px;
    line-height: 30px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
}

.nav-left-sidebar .submenu {
    padding-left: 12px;
    padding-right: 12px;
    /* margin-top: 5px; */
    background: #24274a;
}

.nav-left-sidebar .submenu .nav .nav-item .nav-link {
    font-size: 14px;
    padding: 6px 12px;
    transition: 0.3s;
}

.nav-left-sidebar .navbar-nav .nav-link:focus,
.nav-left-sidebar .navbar-nav .nav-link.active {
    background-color: #e2e2eb;
    color: #3d405c;
    border-radius: 2px;
}

.nav-left-sidebar .navbar-nav .nav-link:focus,
.nav-left-sidebar .navbar-nav .nav-link:hover {
    background-color: #e2e2eb;
    color: #3d405c;
    border-radius: 2px;
}

.nav-left-sidebar .submenu .nav .nav-item .nav-link:hover {
    color: #3d405c;
    border-radius: 2px;
    background-color: transparent;
}

.nav-left-sidebar .navbar-toggler {
    background-color: #fff;
}
.navbar-toggler {
    padding: .25rem 0.5rem;
    font-size: 1.25rem;
    line-height: 1;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: .25rem;
}

.sidebar-primary {
    background-color: #414da7;
}

.sidebar-primary .nav-divider {
    color: #ddddff;
}

.sidebar-primary.nav-left-sidebar .nav-link i {
    color: #8991d4;
}


.sidebar-primary.nav-left-sidebar .navbar-nav .nav-link {
    color: #8991d4;
}

.sidebar-primary.nav-left-sidebar .navbar-nav .nav-link:focus,
.sidebar-primary.nav-left-sidebar .navbar-nav .nav-link:hover {
    color: #fff;
    background-color: #5761c2;
    border-radius: 2px;
}

.sidebar-primary.nav-left-sidebar .navbar-nav .nav-link:focus,
.sidebar-primary.nav-left-sidebar .navbar-nav .nav-link.active {
    background-color: #5761c2;
    color: #fff;
    border-radius: 2px;
}

.sidebar-primary.nav-left-sidebar .submenu .nav .nav-item .nav-link:hover {
    color: #fff;
    border-radius: 2px;
    background-color: transparent;
}

.sidebar-dark {
    background-color: #0e0c28;
    -webkit-box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.13);
    box-shadow: 0px 0px 28px 0px rgba(82, 63, 105, 0.13);
    -webkit-transition: all 0.3s ease;
}

.sidebar-dark .nav-divider {
    color: #a4aadb;
    font-size: 12px;
    letter-spacing: 1px;
}

.sidebar-dark.nav-left-sidebar .nav-link i {
    color: #7a80b4;
}
.sidebar-dark.nav-left-sidebar .navbar-nav .nav-link {
    color: #7a80b4;
}

.sidebar-dark.nav-left-sidebar .navbar-nav .nav-link:focus,
.sidebar-dark.nav-left-sidebar .navbar-nav .nav-link:hover {
    color: #fff;
    background-color: #242849;
    border-radius: 2px;
}

.sidebar-dark.nav-left-sidebar .navbar-nav .nav-link:focus,
.sidebar-dark.nav-left-sidebar .navbar-nav .nav-link.active {
    background-color: #242849;
    color: #fff;
    border-radius: 2px;
}

.sidebar-dark.nav-left-sidebar .submenu .nav .nav-item .nav-link:hover {
    color: #fff;
    border-radius: 2px;
    background-color: #242849;
}

.sidebar-dark.nav-left-sidebar .navbar-nav .nav-item .badge{
    position: absolute;
    right: 40px;
    display: none;
}

.sidebar-nav-fixed {
    position: sticky;
    top: 5rem;
}

.sidebar-nav-fixed ul li a {
    font-size: 14px;
    color: #71728e;
    display: block;
    padding: 5px 15px;
    background: transparent;
    border-radius: 4px;
    line-height: 1.8;
}

.sidebar-nav-fixed ul li a:hover {
    color: #5969ff;
}

.sidebar-nav-fixed ul li a.active {
    display: block;
    color: #5969ff;
    background: #e0e0fd;
}

.dropdown-menu {
    background: #fff;
    font-size: 14px;
    color: #3d405c;
    border: 1px solid #e6e6f2;
}

.dropdown-item {
    display: block;
    width: 100%;
    padding: .25rem 1.5rem;
    clear: both;
    font-weight: 400;
    color: #3d405c;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
}

.dropdown-item:hover {
    color: #5969ff;
    background: #efeff6;
}

.dropdown-item.active,
.dropdown-item:active {
    color: #fff;
    text-decoration: none;
    background-color: #5969ff;
}






</style>
