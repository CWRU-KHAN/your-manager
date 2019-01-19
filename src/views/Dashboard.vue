<template>
  <div class="container">
    <h1>Dashboard</h1><br><hr><br>
    <img src="this.$store.state.currentPageJson.data[0].userimage">
    <h2> {{ `Welcome ${this.$store.state.userCredentials.username}` }} </h2>
    <router-link class="btn btn-register" to="/user/changePassword">Change Password</router-link>
    
    <router-link
      class="btn btn-event-create"
      to="/user/changeProfile">Change User Profile
    </router-link>
    
    <br><hr><br>
    
    <div id="CalendarView">
      <h4>Calendar</h4>
      <calendar-view :eventsProp="eventsForCalendar" />
    </div>
    
    <br><hr><br>

        <h4>Bands</h4>
            <div>
              <p v-if="!hasBands">No Bands Exist</p>
              <ul v-if="hasBands">
                <li v-for="userBand in bandsList" :key="'bandid' + userBand.id"> <button type="button" @click="goToBand(userBand.id)">{{ userBand.bandname }}</button> </li>
              </ul>
              <router-link class="btn btn-event-create" to='/band/create'>Create A Band</router-link>
              <router-link class="btn btn-note-create" to='/band/join'>Join A Band</router-link>
              <br>
            </div>
    

    <br><hr><br>
    
    <div class="col-6 events-box">
      <h4>Events</h4>

    <div>
      <router-link
        class="btn btn-event-create"
        to="event/create">create an event
      </router-link>
      
      <p v-if="!hasBands">Please Create or Join a Band to see Events</p>
      <div v-for="(band, i) in eventsList" :key="i" class='bandBox'>
        <h3>{{ band.name }}</h3>
        <div v-for="event in band.events" :key="event.id"> 
          <event-card :eventInfo="event"></event-card> 
        </div>
      </div>
    </div>
    </div>
    
    <div class="col-6 notes-box">

    <h4>Notes</h4>
    <router-link
      class="btn btn-note-create"
      to="/note/create"> write a note
    </router-link>
    
    <div>
      <p v-if="!hasBands">Please Create or Join a Band to see Notes</p>  
      <div v-for="(band, i) in notesList" :key="i" class='bandBox'>
        <h3>{{ band.name }}</h3>
        <div v-for="note in band.notes" :key="note.id">
          <note-card :noteInfo="note"></note-card>
        </div>
      </div>
    </div>

    </div>

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
      const rawEvents = this.$store.state.currentPageJson.data[2]
      if (!rawEvents.length) return []
      const formattedEvents = rawEvents
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
    },
  },
  
  methods: {
    goToBand(id) {
      this.$store.commit("setBandCredentials", id)
      this.$router.push({name : "bandDashboard"})
    }
  }
}
</script>

<style>

  .notes-box {
    float: right
  }

  .events-box {
    float: left
  }

  .btn {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: .5em 2em .5em 2em;
    margin: 0em .5em 0em .5em
  }

  .btn-icon {
    margin-right: .5em
  }

  .btn-login {
    background-color: transparent;
    border: solid 2px transparent;
    color: #ededed;
  }

  .btn-login:hover {
    background-color: #ededed;
    border: solid 2px #ededed;
    color: #677794
  }
  
  .btn-logout {
    background-color: #d9534f;
    border: solid 2px transparent;
    color: #ededed;
  }

  .btn-logout:hover {
    background-color: transparent;
    border: solid 2px #d9534f;
    color: #d9534f
  }

  .btn-register {
    background-color: #fbaf2c;
    border: solid 2px transparent;
    color: #373737;
  }

  .btn-register:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #fbaf2c
  }
  
  .btn-dashboard {
    background-color: #fbaf2c;
    border: solid 2px transparent;
    color: #373737;
  }

  .btn-dashboard:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #fbaf2c
  }
  
  .btn-event-create {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
  }

  .btn-event-create:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #ededed
  }

  .btn-note-create {
    background-color: #979797;
    border: solid 2px transparent;
    color: #ededed;
  }

  .btn-note-create:hover {
    background-color: transparent;
    border: solid 2px #979797;
    color: #ededed
  }

</style>
