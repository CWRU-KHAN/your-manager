<template>
  <div id="app">
    <site-navbar></site-navbar>
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

</style>
