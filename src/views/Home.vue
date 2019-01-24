<template>
  <div class="container-fluid">
    <div>
      <img class="landing-img-ym" src="@/assets/ymLuggageIcons.png">
      <h1 class="display-4 text-center">Welcome to Your Manager</h1>
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

  @import url('https://fonts.googleapis.com/css?family=Montserrat|Open+Sans');
  @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css');
  @import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');


body {
  background-color: #ededed;
};

.container {
  width: 100%;
  padding: 0;
  margin: 0;
}

.landing-img-ym {
  height: auto;
  width: auto;
  max-width: 300px
}

</style>