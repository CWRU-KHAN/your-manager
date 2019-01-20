<template>
  <div class="container-fluid">
    <div class="row">
      <h1 class="bandName">{{ this.$store.state.currentPageJson.data.bandname }}</h1>
    </div>
    <br>
    <hr>
    <br>

    <!-- <router-link v-if="bandOwner" to="/band/changeProfile">Edit Band Details</router-link> -->


    <div class="row">
      <div class="col-lg-8">
        <div id="CalendarView">
          <calendar-view :eventsProp="eventsForCalendar" />
        </div>
      </div>
      <div class="col-lg-4">
        <h4>Members</h4>
          <div class="members" v-for="member in membersList" :key="member.id"> {{ member.username }} </div>
      </div>
    </div>
    <br>
    <hr>
    <br>
    <div class="row">
      <div class="col-lg-6 col-md-12">
        <h4>Events</h4>
          <table class="col-12">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Info</th>
            </tr>
            <event-card v-for="event in events" :key="event.id" :event-info="event"></event-card>
          </table>
      </div>
      <br>
      <div class="col-lg-6 col-md-12">
        <h4>Notes</h4>
          <div v-for="note in notesList" :key="'note'+note.id"> 
            <note-card :noteInfo="note"></note-card> 
          </div>
      </div>
    </div>


    <router-link to="event/create">go to event create</router-link>
    <br>
    <router-link to="event/info">go to event info</router-link>
  </div>
</template>

<script>
import EventCard from '../components/EventCard.vue'
import NoteCard from '../components/NoteCard.vue'
import CalendarView from './CalendarView'

export default {
  name: 'bandDashboard',

  components: {
    CalendarView,
    EventCard,
    NoteCard
  },

  computed: {
    membersList() {
        return this.$store.state.currentPageJson.data.users 
    },
    eventsList() {
      return this.$store.state.currentPageJson.data.events.length ?
      this.$store.state.currentPageJson.data.events :
      false
    },
    // when we have events rendering to band page this will work
    notesList() {
      return this.$store.state.currentPageJson.data.notes.length ? 
        this.$store.state.currentPageJson.data.notes : 
        false
    },
    eventsForCalendar() {
      const calendarEvents = this.$store.state.currentPageJson.data.events ? 
      this.$store.state.currentPageJson.data.events
      .map(event => {
        return {
          startDate: event.date,
          title: event.eventname,
          id: event.id
        }
      }) : []
      return [...calendarEvents]
    },
    bandOwner() {
      return this.$store.state.userCredentials.usersid === this.$store.state.currentPageJson.data.ownerid
    }
  }
}
</script>

<style scoped>

  .bandName {
    text-align: center;
  }

  .members {
    text-align: left;
  }

</style>