<template>
  <div>
    <h1>Dashboard</h1>
    <h2> {{ `Welcome ${this.$store.state.userCredentials.username}` }} </h2>
    <div id="CalendarView">
      <h4>Calendar</h4>
      <calendar-view :eventsProp="events" />
      <!-- <router-link to='/calendar'>View Calendar</router-link> -->
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
      <br>
    </div>
    <br>
    <h4>Events</h4>
    <div>
      <p v-if="!hasBands">Please Create or Join a Band to see Events</p>
      <div v-if="hasBands">
        <p v-if="!eventsList">None of your bands have upcoming events.</p>
        <ul v-if="eventsList">
          <li v-for="event in eventsList" :key="Object.keys(event)[0]"> {{ event[Object.keys(event)[0]][0].eventname }} </li>
                  <button type="button" @click="gotoEvent(6)">go to event</button>
                  <!-- how to pass an event's id as a prop if not through Object.keys(event)[0][0].id?  -->
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

    <router-link to="event/create">go to event create</router-link>
    <br>
    <router-link to="event/info">go to event info</router-link>
  </div>
</template>


<script>

import CalendarView from './CalendarView'

	const eventsJson = [
		{
			id: 0,
			startDate: '2019-01-10 12:00:00',
			title: 'go to the park'

		},
		{
			id: 1,
			startDate: '2019-01-11 12:00:00',
			title: 'does this work?'
		}
  ]
  

export default {
  name: 'Dashboard',
  components: {
    CalendarView
  },

    data: function() {
    return { showDate: new Date(),
        events: eventsJson }
  },

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
      id = 34
      console.log("id: " + id)
      // this.$store.commit("setBandToken", {bandid: id})
      this.$store.commit('setBandCredentials', id)
      this.$router.push({name : "bandDashboard"})

    },
    gotoEvent(id) {
      console.log("id: " + id)
      this.$store.commit("setEvent", id)
      this.$router.push({"path" : "/event/info"})
    },
    
  }
}
</script>
