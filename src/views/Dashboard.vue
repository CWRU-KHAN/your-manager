<template>
  <div>
    <h1>Dashboard</h1>
    <h2> {{ `Welcome ${this.$store.state.userCredentials.username}` }} </h2>
    <div>
      Calendar goes here
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
      <div v-if="hasBands">
        <p v-if="!eventsList">None of your bands have upcoming events.</p>
        <ul v-if="eventsList">
          <li v-for="event in eventsList" :key="Object.keys(event)[0]"> {{ event[Object.keys(event)[0]][0].eventname }} </li>
        </ul>
      </div>
    </div>
    <br>
    <h4>Notes</h4>
    <div>
      <p v-if="!hasBands">Please Create or Join a Band to see Notes</p>
      <div v-if="hasBands">
        <p v-if="!notesList">None of your bands have upcoming notes.</p>
        <ul v-if="notesList">
          <li v-for="note in notesList" :key="Object.keys(note)[0]"> {{ note[Object.keys(note)[0]] ? note[Object.keys(note)[0]][0].notetitle : 'Untitled note.' }} </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'Dashboard',
  computed: {
    hasBands() {
      return !!this.$store.state.currentPageJson.data.bands && !!this.$store.state.currentPageJson.data.bands.length
    },
    bandsList() {
      return this.$store.state.currentPageJson.data.bands 
    },
    eventsList() {
      return this.$store.state.dashboardEvents.length ? 
        this.$store.state.dashboardEvents : 
        false
    },
    notesList() {
      return this.$store.state.dashboardNotes.length ? 
        this.$store.state.dashboardNotes : 
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
