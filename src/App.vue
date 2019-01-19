<template>
  <div id="app">
    <site-navbar id="side-nav"></site-navbar>
    <router-view/>
  </div>
</template>


<script>
import SiteNavbar from './components/Navbar.vue'
export default {
  components: {
    SiteNavbar
  }
}
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#side-nav {
  float: left;
  margin: 0 1em 0em 0em;
  padding: 0;
}

</style>
