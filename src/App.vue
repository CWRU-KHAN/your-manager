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

    #app {
        text-align: center;
        color: #2c3e50;
        padding: 1em 0em
    }


/* containers */

    .container-fluid {
        margin-left: 264px;
        width: auto;
    }

/* probably going to change these to txt */

    .pge-title {
        font-family: 'Montserrat', 'sans serif';
        text-transform: uppercase;
        font-size: 2em;
        font-weight: 600;
        letter-spacing: .1em;
        margin: 2em 0em 1.5em 0em;
    }

    .pge-subtitle {
      font-family: 'Open Sans', 'sans serif';
      font-size: 1em
    }

/* forms */

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

/* error handlers */

    .err-handler {
      display: block
    }

    .err-handler-text {
      color: red
    }

/* buttons */

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

    .but-yellow {
    background-color: #fbaf2c;
    border: solid 2px transparent;
    color: #373737;
    }

    .but-yellow:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #373737
    }

    .but-blue {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    }

    .but-blue:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #373737
    }

</style>
