<template>
  <div class="container-fluid">
    <br>
    <br>
    <div class="row bandRow">
      <div v-if="this.$store.state.currentUser[0].bands.length && this.$store.state.currentUser[0].bands[0].id">
      <div class="col-lg-3 col-md-6"  v-for="userBand in bandsList" :key="'bandid' + userBand.id">
        <div class="band" @click="goToBand(userBand.id)">
          <div>{{ userBand.bandname }} </div>
        </div>
      </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="band" @click="goToCreate()">
          <i class="fa fa-plus btn-icon plus" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <br>
    <hr>
    <br>
    <div class="row calRow">
      <div class="col-lg-9">
        <div id="CalendarView">
          <calendar-view :eventsProp="eventsForCalendar" />
        </div>
      </div>
      <div class="col-lg-3 ipadHide">
        <img class="profPic" :src="computedImage">
        <br>
        <h2 class="user"> {{ `${this.$store.state.currentUser[0].username}` }} </h2>
        <router-link class="btn page-btn" to="/user/changeProfile">Edit User Profile</router-link>
      </div>
    </div>

    <br>
    <hr>
    <br>
    <div class="row">
      <div class="col-lg-6 col-md-12">
        <h4>Events</h4>
        <div>
          <div v-if="!hasEvents">
            <div class="bandBox">
              <p>please create a band to have events</p>
            </div>
          </div>

          <div v-if="hasEvents">
            <div v-for="(band, i) in eventsList" :key="i">
              <div class="row boxHeader">
                <div class="col-8 ">
                  <h3 class="note-event-band">{{ band.name }}</h3>
                </div>
                <div class="col-4">
                  <router-link class="btn btn-event-create btn-fix-center" to="event/create"><i class="fa fa-plus boxEditor"
                      aria-hidden="true"></i></router-link>
                </div>
              </div>
              <div class="bandBox">
                <table class="col-12">
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th></th>
                  </tr>
                  <event-card v-for="event in band.events" :key="event.id" :event-info="event"></event-card>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-12">
        <h4>Notes</h4>
        <div>
          <div v-if="!hasNotes">
            <div class="bandBox">
              <p>please create a band to have notes</p>
            </div>
          </div>
          <div v-if="hasNotes">
            <div v-for="(band, i) in notesList" :key="i">
              <div class="row boxHeader">
                <div class="col-lg-6 ">
                  <h3 class="note-event-band">{{ band.name }}</h3>
                </div>
                <div class="col-lg-3">
                  <p class="note-event-band unread" v-if="notesList.length"> {{ notesList[i].notes.length }} Unread </p>
                </div>
                <div class="col-lg-3">
                    <router-link class="btn btn-event-create" to="note/create"><i class="fa fa-pencil boxEditor"></i></router-link>
                </div>
              </div>
              <div class="bandBox">
                <div class="notesHead unreadNotes" v-if="notesList[i].notes.length">
                <h4>Unread</h4>
                </div>
                <hr>
                <div v-for="note in band.notes" :key="note.id">
                    <note-card :noteInfo="note"
                    :refresherId="note.id"
                    :refresherMethod="'toggleUserDashNote'"
                    :refresherBandsId="band.bandsid"
                    ></note-card>
                </div>
                <div class="notesHead"  v-if="readNotesList[i].notes.length">
                <h4>Read</h4>
                </div>
                <hr>
                <div v-for="note in readNotesList[i].notes" :key="note.id">
                    <note-card :noteInfo="note"></note-card>
                </div>
              </div>
            </div>
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
  name: 'Dashboard',
  
  components: {
    CalendarView,
    EventCard,
    NoteCard
  },


  computed: {
    hasBands() {
      return !!this.$store.state.currentUser[0].bands && !!this.$store.state.currentUser[0].bands.length
    },
    bandsList() {
      return this.$store.state.currentUser[0].bands 
    },
    eventsList() {
      return this.$store.state.currentUser[2].length ? 
        this.$store.state.currentUser[2]
          .filter(entry => entry.name)
          .map(({ name, events }) => {
            const futureEvents = events.filter(({ date }) => moment().isBefore(date))
            return {
              name,
              events: futureEvents
            }
          }) : 
        false
    },
    notesList() {
      return this.$store.state.currentUser[1].length ? 
        this.$store.state.currentUser[1]
          .filter(entry => entry.bandsid)
          .map(band => {
            const { bandsid, name, notes } = band
            const unreadNotes = notes.filter(note => !note.read)
            return { bandsid, name, notes: unreadNotes }
          }) : 
        false
    },
    readNotesList() {
      return this.$store.state.currentUser[1].length ? 
        this.$store.state.currentUser[1]
          .filter(entry => entry.bandsid)
          .map(band => {
            const { bandsid, name, notes } = band
            const readNotes = notes.filter(note => note.read)
            return { bandsid, name, notes: readNotes }
          }) : 
        false
    },
    
    eventsForCalendar() {
      const rawEvents = this.$store.state.currentUser[2]
      if (!rawEvents.length) return []
      const formattedEvents = rawEvents
      .map(band => {
        if (!band.events) return []
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
    computedImage() {
      return this.$store.state.currentUser[0].userimage ?
       this.$store.state.currentUser[0].userimage :
       false
    },
    hasEvents() {
      const eventsList = this.$store.state.currentUser[2]
      return eventsList.length &&
         !!eventsList.find(({ events }) => events.length)
    },
    hasNotes() {
      const notesList = this.$store.state.currentUser[1]
      return notesList.length &&
         !!notesList.find(({ notes }) => notes.length)
    }

  },
  
  methods: {
    goToBand(id) {
      this.$store.commit("setBandCredentials", id)
      this.$router.push({name : "bandDashboard"})
    },
    goToCreate() {
      this.$router.push({name : "joinBand"})
    },
  }
}
</script>

<style scoped>

  .btn {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: .5em 2em .5em 2em;
    margin: 0em .5em;
  }

  .btn-fix-center {
    margin: 1em;
  }
/* 
  .btn-icon {
    margin-right: .5em
  } */

  .page-btn {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    transition-property: background-color, color;
    transition: 400ms;
  }

  .page-btn:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794;
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
  

  .profPic {
    width: 100%;
    border: 2px solid #979797;
    border-radius: .4em;
  }

  .band {
    font-family: 'Open Sans', 'sans-serif';
    font-size: .75em;
    letter-spacing: .1em;
    text-transform: uppercase;    
    height: 100px;
    line-height: 100px;
    border: 2px solid #677794;
    margin: 0px, 10px;
    border-radius: 5px;
    background-color: #677794;
    color: #ededed;
    transition-property: background-color, color;
    transition: 400ms;
  }

  .band:hover {
    background-color: transparent;
    color: #677794
  }

  .bandBox {
    height: 20em;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 3%;
    border: 2px solid #979797;
    border-radius: .4em;
    text-align: left;
    padding-right: 3%;
    padding-left: 3%;    
  }

  .boxHeader {
    background-color: #677794;
    border: 1px solid #677794;
    border-radius: 5px;
    margin-left: .1em;
    margin-right: .1em;
    height: 6em;
    width: auto;
    font-family: 'Open Sans';
    font-size: .5em;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #ededed;
    margin-top: 3%;
  }

  .btn-event-create {
    background-color: #677794;
    font-size: 1.5em;
    border: solid 2px transparent;
    color: #ededed;
    transition-property: background-color, color;
    transition: 400ms;
  }

  .btn-event-create:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794;
  }

  .calRow {
    height:400px;
  }

  #CalendarView {
    height: 100%;
  }

  .user {
    margin: 6.5%;
  }

  .note-event-band {
    height: 50px;
    line-height: 50px;
    text-align: left;
    margin-left: 5%;
    font-size: 2em;
  }

  .plus {
    font-size: 2em;
  }

  .container-fluid {
    margin-left: 264px;
    width: auto;

}

.unread {
  font-size: 1.5em;
}

.notesHead {
  text-align: right;
  background-color: #fbaf2c;
  padding: 3%;
  border-radius: .4em;
}

.unreadNotes {
  margin-top: 3%;
}


@media only screen and (max-width: 992px) {

  .ipadHide {
    display: none;
  }
}

</style>

<style>
  .container-fluid {
    margin-left: 264px;
    width: auto;
}
.ym-luggage {
  height: 500px;
  width: auto;
  float: right
}
</style>


