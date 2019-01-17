<template>
  <div>
    <h1>Dashboard</h1>
    <h2> {{ `Welcome ${this.$store.state.userCredentials.username}` }} </h2>
    <div id="CalendarView">
      <h4>Calendar</h4>
      <calendar-view :eventsProp="eventsForCalendar" />
    </div>
    <br>
    <h4>Bands</h4>
    <div>
      <p v-if="!hasBands">No Bands Exist</p>
      <ul v-if="hasBands">
        <li v-for="userBand in bandsList" :key="'bandid' + userBand.id"> <button type="button" @click="goToBand(userBand.id)">{{ userBand.bandname }}</button> </li>
      </ul>
      <router-link to='/band/create'>Create A Band</router-link>
      <router-link to='/band/join'>Join A Band</router-link>
      <br>
    </div>
    <br>
    <h4>Events</h4>

    <div>
      <router-link to="event/create">create an event</router-link>
      <p v-if="!hasBands">Please Create or Join a Band to see Events</p>
      <div v-for="(band, i) in eventsList" :key="i" class='bandBox'>
        <h3>{{ band.name }}</h3>
        <div v-for="event in band.events" :key="event.id"> 
          <event-card :eventInfo="event"></event-card> 
        </div>
      </div>
    </div>
    
    <br>
    <h4>Notes</h4>
    <router-link to="/note/create"> write a note </router-link>
    <div>
      <p v-if="!hasBands">Please Create or Join a Band to see Notes</p>  
      <div v-for="(band, i) in notesList" :key="i" class='bandBox'>
        <h3>{{ band.name }}</h3>
        <div v-for="note in band.notes" :key="note.id">
          <note-card :noteInfo="note"></note-card>
        </div>
      </div>
    </div>
    <br>
    <router-link to="event/info">go to event info</router-link>
  </div>
</template>

<style scoped>
.bandBox {
  border: 3px solid blue;
  margin: 10px;
}
</style>


<script>
import EventCard from '../components/EventCard.vue'
import NoteCard from '../components/NoteCard.vue'
import CalendarView from './CalendarView'


  

export default {
  name: 'Dashboard',
  
  components: {
    CalendarView,
    EventCard,
    NoteCard
  },


  computed: {
    hasBands() {
      return !!this.$store.state.currentPageJson.data[0].bands && !!this.$store.state.currentPageJson.data[0].bands.length
    },
    bandsList() {
      return this.$store.state.currentPageJson.data[0].bands 
    },
    eventsList() {
      return this.$store.state.currentPageJson.data[2].length ? 
        this.$store.state.currentPageJson.data[2].filter(entry => entry.name) : 
        false
    },
    notesList() {
      return this.$store.state.currentPageJson.data[1].length ? 
        this.$store.state.currentPageJson.data[1].filter(entry => entry.bandsid) : 
        false
    },
    eventsForCalendar() {
      const formattedEvents = this.$store.state.currentPageJson.data[2]
      .map(band => {
        const calendarEvents = band.events.map(event => {
          return {
            startDate: event.date,
            title: event.eventname,
            id: event.id,
            bandname: event.bandname
          }
        })
        return [...calendarEvents]
      })
      .reduce((a, b) => a.concat(b))

      return formattedEvents
    }
  },
  
  methods: {
    goToBand(id) {
      this.$store.commit("setBandCredentials", id)
      this.$router.push({name : "bandDashboard"})
    },
    gotoEvent(id) {
      this.$store.commit("setEvent", id)
      this.$router.push({"path" : "/event/info"})
    },    
  }
}
</script>
