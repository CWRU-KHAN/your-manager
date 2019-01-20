    <template>
        <div class="container-fluid">
            <br>
            <br>
            <div class="row bandRow">

                <div class="col-lg-3 col-md-6" v-for="userBand in bandsList" :key="'bandid' + userBand.id">
                  <div class="band">
                    <div @click="goToBand(userBand.id)">{{ userBand.bandname }} </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="band">
                    <i class="fa fa-plus btn-icon plus" aria-hidden="true" @click="goToCreate()"></i>
                  </div>
                </div>
                <div v-if="this.$store.state.currentPageJson.data[0].length < 3" class="col-lg-3 col-md-6 band">
                    <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                </div>
            </div>

            <br>
            <hr>
            <br>
            <div class="row calRow">
                <div class="col-lg-9">
                    <div id="CalendarView">
                        <calendar-view :eventsProp="eventsForCalendar"/>
                    </div>
                </div>
                <div class="col-lg-3 ipadHide">
                    <img class="profPic" :src="computedImage">
                    <br>
                    <h2 class="user"> {{ `${this.$store.state.currentPageJson.data[0].username}` }} </h2>
                    <router-link class="btn page-btn" to="/user/changeProfile">Edit User Profile</router-link>
                </div>
            </div>

            <br>
            <hr>
            <br>
            <div class="row">
                <div class="col-lg-6 col-md-12 events-box">
                    <h4>Events</h4>
                    <div>
                        <p v-if="!hasBands">Please Create or Join a Band to see Events</p>
                        <div v-for="(band, i) in eventsList" :key="i" class='bandBox'>
                            <div class="row boxHeader">
                              <div class="col-8 ">
                                <h3 class="note-event-band">{{ band.name }}</h3>
                              </div>
                              <div class="col-4">
                                <router-link class="btn btn-event-create" to="event/create"><i class="fa fa-plus" aria-hidden="true"></i></router-link>
                              </div>
                            </div>
                            <table class="col-12">
                                  <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Venue</th>
                                    <th>Info</th>
                                  </tr>
                                  <event-card v-for="event in band.events" :key="event.id" :event-info="event"></event-card>
                            </table>
                        </div>
                    </div>
                  <br>
                  <hr>
                  <br>
                </div>
                <div class="col-lg-6 col-md-12">
                    <h4>Notes</h4>
                    <div>
                        <p v-if="!hasBands">Please Create or Join a Band to see Notes</p>
                        <div v-for="(band, i) in notesList" :key="i" class='bandBox'>
                          <div class="row boxHeader">
                            <div class="col-8 ">
                            <h3 class="note-event-band">{{ band.name }}</h3>
                            </div>
                            <div class="col-4">
                                <router-link class="btn btn-event-create" to="event/create"><i class="fa fa-pencil"></i></router-link>
                              </div>
                          </div>
                            <div v-for="note in band.notes" :key="note.id">
                                <note-card :noteInfo="note"></note-card>
                            </div>
                        </div>
                    </div>
                  <br>
                  <hr>
                  <br>
                </div>
            </div>
        </div>
    </template>


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
    computedImage() {
      return this.$store.state.currentPageJson.data[0].userimage ?
       this.$store.state.currentPageJson.data[0].userimage :
       false
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
  
  .btn-event-create {
    background-color: #677794;
    font-size: 1.2em;
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

  .profPic {
    width: 100%;
    border: 2px solid #979797;
    border-radius: 5px;
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
    border: 3px solid blue;
  }

  .floatRight {
    display: flex;
    justify-content: flex-end;
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
  }

  .plus {
    font-size: 2em;
  }


@media only screen and (max-width: 992px) {

  .ipadHide {
    display: none;
  }
}

</style>
