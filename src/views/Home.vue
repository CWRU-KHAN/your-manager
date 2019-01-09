<template>
  <div class="container">
    <div class="landing1">
      <img class="ymLuggage" src="@/assets/ymLuggageIcons.png" />
    </div>
    <div class="landing2">
      <h1 class="header">Welcome toYour Manager</h1>
      <p>A comprehensive tool designed to help touring bands stay organized</p><br>
      <router-link to='login' class="btn btn-login">Login</router-link>
      <router-link to='signup' class="btn btn-register">Register</router-link>
    </div>
  </div>
</template>

<script>

export default {

}
</script>

<style>

  @import url('https://fonts.googleapis.com/css?family=Open+Sans|Shrikhand');

  .container {
    display: grid;
    grid-template-columns: 10% auto auto 10%;
    background-color: #ededed;
  }
  .landing1 {
    grid-column-start: 2;
    grid-column-end: 3;
    background-color: #ededed;
  }
  .landing2 {
    grid-column-start: 3;
    grid-column-end: 4;
    background-color: #ededed;
  }
  h1.header {
    font-size: 3em;
    font-family: 'Shrikhand', cursive;
    padding: 0px;
    margin: 0px
  }
  p {
    font-family: 'Open Sans', sans-serif
  }
  .btn {
    border: 2px solid #677794;
    margin: 1em;
    padding: 1em 5em 1em 5em;
    color: #ededed;
    background-color: #677794; 
    font-family: 'Opens Sans', sans-serif;
  }
  .btn:hover {
    background-color: #fbaf2c
  }
  .btn-register {
    background-color: #ededed;
    color: #677794
  }
  .ymLuggage {
    height: 300px;
    width: 250px
  }

</style>
