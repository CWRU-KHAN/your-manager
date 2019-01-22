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

.pge-title {
        font-family: 'Montserrat', 'sans serif';
        text-transform: uppercase;
        font-size: 2em;
        font-weight: 600;
        letter-spacing: .1em;
        margin: 2em 0em 1.5em 0em;
    }

    .frm-group {
        margin: 1.5em 0em;
    }

    .frm-input {
        display: block;
        width: 100%;
        padding: 1em 1em;
        font-size: 1em;
        color: #373737;
        background-color: #ffffff
    }

    .frm-input-textarea {
        min-height: 100px;
        resize: vertical
    }

    .frm-input-label {
        display: block;
        font-family: 'Open Sans', 'sans serif';
        text-transform: uppercase;
        font-size: .8em;
        font-weight: 500;
    }

    .but {
        font-family: 'Open Sans';
        text-transform: uppercase;
        font-size: .75em;
        letter-spacing: .1em;
        padding: 1em
    }

    .but-block {
        display: block;
        width: 100%
    }

    .err-handler {
      display: block
    }

    .err-handler-text {
      color: red
    }

</style>
