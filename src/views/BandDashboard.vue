<template>
  <div class="container-fluid">
    <!-- <router-link v-if="bandOwner" to="/band/changeProfile">Edit Band Details</router-link> -->
    <div class="row top">
      <div class="col-lg-8">
        <div id="CalendarView">
          <calendar-view :eventsProp="eventsForCalendar" />
        </div>
      </div>
      <div class="col-lg-4">
        <h1>{{ this.$store.state.currentPageJson.data.bandname }}</h1>
        <h4>Members</h4>
          <div class="members" v-for="member in membersList" :key="member.id"> {{ member.username }} </div>
      </div>
    </div>
    <br>
    <hr>
    <div class="row">
      <div class="col-lg-6 col-md-12">
        <div class="row boxHeader">
          <div class="col-8 ">
              <h3 class="note-event">Events</h3>
          </div>
          <div class="col-4">
            <router-link class="btn btn-event-create" to="event/create"><i class="fa fa-plus boxEditor" aria-hidden="true"></i></router-link>
            </div>
          </div>
        <div class="bandBox">
          <table class="col-12">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Info</th>
            </tr>
          <event-card v-for="event in eventsList" :key="event.id" :event-info="event"></event-card>
          </table>
        </div>
      </div>
      <br>
      <div class="col-lg-6 col-md-12">
<div class="row boxHeader">
                            <div class="col-8 ">
                            <h3 class="note-event">Notes</h3>
                            </div>
                            <div class="col-4">
                                <router-link class="btn btn-event-create" to="event/create"><i class="fa fa-pencil boxEditor"></i></router-link>
                              </div>
                          </div>
        <div class="bandBox">
          <div v-for="note in notesList" :key="'note'+note.id"> 
            <note-card :noteInfo="note"></note-card> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventCard from '../components/EventCard.vue'
import NoteCard from '../components/NoteCard.vue'
import CalendarView from './CalendarView'
import moment from 'moment'

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
      this.$store.state.currentPageJson.data.events
        .filter(({ date }) => moment().isBefore(date)) :
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

  table {
    text-align: left;
  }

  .bandBox {
    height: 20em;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 3%;
    border: 2px solid black;
    border-radius: 5px;
    text-align: left;
    padding: 3%;
    
  }

  .top {
    margin-top: 3%;
  }
  
  .container-fluid {
    margin-left: 264px;
    width: auto;
}

  .boxHeader {
    background-color: #677794;
    border: 1px solid #677794;
    border-radius: 5px;
    margin-left: 1%;
    margin-right: 1%;
    width: auto;
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #ededed;
    margin-top: 3%;
  }

  .note-event {
    height: 50px;
    line-height: 50px;
    text-align: left;
    margin-left: 5%;
  }

    
  .btn-event-create {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    transition-property: background-color, color;
    transition: 400ms;
    font-size: 1.5em;

  }
</style>