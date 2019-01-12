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
      <p v-if="!hasBands">No Bands Exist</p>
      <ul v-if="hasBands">
        <li v-for="userBand in bandsList" :key="userBand.id"> <button type="button" @click="goToBand(userBand.id)">{{ userBand.bandname }}</button> </li>
      </ul>
      <router-link to='/band/create'>Create A Band</router-link>
      <router-link to='/band/join'>Join A Band</router-link>
    </div>
    <br>
    <h4>Events</h4>
    <div>
      <p v-if="!hasBands">Please Create or Join a Band to see Events</p>

    </div>
    <br>
    <h4>Notes</h4>
    <div>
      <p v-if="!hasBands">Please Create or Join a Band to see Notes</p>
  
    </div>
  </div>
</template>


<script>

export default {
  name: 'Dashboard',
  computed: {
    hasBands() {
      return !!this.$store.state.currentPageJson.data[0].bands && !!this.$store.state.currentPageJson.data[0].bands.length
    },
    bandsList() {
      return this.$store.state.currentPageJson.data[0].bands 
    },
    eventsList() {
      return this.$store.state.currentPageJson.data[2].length ? 
        this.$store.state.currentPageJson.data[2] : 
        false
    },
    notesList() {
      return this.$store.state.currentPageJson.data[1].length ? 
        this.$store.state.currentPageJson.data[1] : 
        false
    }
  },
  methods: {
    goToBand(id) {
      console.log(id)
    }
  }
}
</script>
