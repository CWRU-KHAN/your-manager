<template>
  <div class="container-fluid">
    <div class="row top">
      <div class="col-lg-8 col-md-12">
        <div id="CalendarView">
          <calendar-view :eventsProp="eventsForCalendar" />
        </div>
      </div>
      <div class="col-lg-4 col-md-12">
        <h1 class="bandName">{{ this.$store.state.currentPageJson.data.bandname }}</h1>
        <h4>Members</h4>
          <div class="members" v-for="member in membersList" :key="member.id"> {{ member.username }} </div>
        <router-link v-if="bandOwner" to="/band/changeProfile" class="editButton">Edit Band Details</router-link>
      </div>
    </div>
    <br>
    <hr>
    <div class="row">
      <div class="col-lg-6 col-md-12">
        <div class="row boxHeader">
          <div class="col-8 ">
              <h3 class="note-event">Upcoming Events</h3>
          </div>
          <div class="col-4">
            <router-link class="btn btn-event-create" to="/event/create"><i class="fa fa-plus boxEditor" aria-hidden="true"></i></router-link>
            </div>
          </div>
        <div class="bandBox">
          <table class="col-12">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th></th>
            </tr>
          <event-card v-for="event in eventsList" :key="event.id" :eventInfo="event"></event-card>
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
                                <router-link class="btn btn-event-create" to="/note/create"><i class="fa fa-pencil boxEditor"></i></router-link>
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
    border-radius: .4em;
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
    border-radius: .4em;
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
    height: 2.5em;
    line-height: 2.5em;
    text-align: left;
    margin-left: 5%;
    font-size: 2em;
  }

  .btn-event-create {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    transition-property: background-color, color;
    transition: 400ms;
    font-size: 1.5em;
  }

  .bandName {
    font-size: 2em;
  }

  .editButton {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    font-family: 'Open Sans';
    font-size: .75em;
    padding: .5em;
    text-transform: uppercase;
    letter-spacing: .1em;
    transition-property: background-color, color;
    transition: 400ms;
    border-radius: .4em;
  }

  .editButton :hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794;
  }

</style>