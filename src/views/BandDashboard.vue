<template>
  <div>
    <h1>Dashboard</h1>

    <router-link to="/band/changeProfile">Edit Band Details</router-link>



    <div id="CalendarView">
      <h4>Calendar</h4>
      <calendar-view :eventsProp="eventsForCalendar" />

    </div>
    <br>
    <h4>Members</h4>
        <ul>
            <li v-for="member in membersList" :key="member.id"> {{ member.username }} </li>
        </ul>
    <br>
    <h4>Events</h4>
        <div v-for="event in eventsList" :key="'band'+event.id"> 
          <event-card :eventInfo="event"></event-card> 
        </div>
    <br>
    <h4>Notes</h4>
      <div v-for="note in notesList" :key="'note'+note.id"> 
        <note-card :noteInfo="note"></note-card> 
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
    }
  }
}
</script>