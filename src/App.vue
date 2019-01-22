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


<style>

</style>
