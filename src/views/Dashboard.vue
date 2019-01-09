<template>
  <div>
    <h1>Dashboard</h1>
    <h2> {{ `Welcome ${this.$store.state.userCredentials.username}` }} </h2>
    <div>
      <router-link to='/calendar'>View Calendar</router-link>
    </div>
    <br>
    <h4>Bands</h4>
    <div>
      <p>No Bands Exist</p>
      <router-link to='/band/create'>Create A Band</router-link>
      <router-link to='/band/join'>Join A Band</router-link>
    </div>
    <br>
    <h4>Events</h4>
    <div>
      <p>Please Create or Join a Band to see Events</p>
    </div>
    <br>
    <h4>Notes</h4>
    <div>
      <p>Please Create or Join a Band to see Notes</p>
    </div>
  </div>
</template>


<script>

export default {
  name: 'Dashboard'
}
</script>
