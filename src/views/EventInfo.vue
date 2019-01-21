<template>
    <div class="container-fluid">
        <div class="section">
        <h1>{{ this.$store.state.currentPageJson.data.eventname }}</h1>
        <br>
        <h4 class="sectionHead"> {{ formattedDate}} </h4>
        <br>
        <h4 class="sectionHead">at {{ this.$store.state.currentPageJson.data.eventlocation }}</h4>
        <br>
        <h4 class="sectionHead">{{ this.$store.state.currentPageJson.data.eventcity }}, {{ this.$store.state.currentPageJson.data.eventstate }}</h4>
        <br>
        <h4 class="sectionHead">Bands:</h4>
        <ul>
            <li v-for="band in bandsPlaying" :key="band.bandname"> {{ band.bandname }} </li>
        </ul>
        <h4>Description: <br><br><h6 class="sectionHead" v-if="eventDescription">{{ eventDescription }} </h6></h4>
<hr>
        <h4>See Notes For:                 <select                     
                    type="text"
                    id="event-bands"
                    v-model="noteBandId"
                    placeholder=""
                    @change="getNotes"
                  >
                    <option v-for="band in relevantBands" :key="band.id" :value="band.id">{{ band.bandname }}</option>                    
                  </select></h4>
                  <note-card v-for="note in relevantNotes" :noteInfo="note" :key="note.id"></note-card>
                  <br>
        <router-link v-if="eventOwner" to="/event/changeProfile" class="btn-register-2">Change Event Details</router-link>
        </div>
    </div>
</template>

<script>
import moment from "moment"
import NoteCard from '../components/NoteCard.vue'

export default {
    name: "eventInfo",
    components: {
        NoteCard
    },
    data() {
        return {
            noteBandId: ''
        }
    },
    computed: {
        eventDescription () {
            return this.$store.state.currentPageJson.data.eventdescription
        },
        formattedDate () {
            const day = moment(this.$store.state.currentPageJson.data.date)
            return day.format('MMMM Do YYYY, h:mm a')
        },
        eventOwner() {
            return this.$store.state.userCredentials.usersid === this.$store.state.currentPageJson.data.ownerid
        },
        bandsPlaying() {
            return this.$store.state.currentPageJson.data.internalBands && 
                this.$store.state.currentPageJson.data.internalBands.length ?
                    this.$store.state.currentPageJson.data.internalBands :
                    []
        },
        relevantBands() {
            const eventBands = this.$store.state.currentPageJson.data.internalBands
            const userBands = this.$store.state.currentUser[0].bands            
            if (!eventBands.length || !userBands.length) return []
            const relevantBands = eventBands.filter(band => {
                const matchMap = userBands.map(({ id }) => id)
                return matchMap.includes(band.id)
            })
            return relevantBands
        },
        relevantNotes() {
            return this.$store.state.currentEventPageNotes.data ? 
                this.$store.state.currentEventPageNotes.data.map(note => {
                    note.author = note.username
                    return note
                }) : 
                false
        }
    },
    methods: {
        getNotes() {
            const payload = {
                bandsid: this.noteBandId,
                eventdate: this.$store.state.currentPageJson.data.date
            }
            this.$store.dispatch('getEventPageNotes', payload)
        }
    }
    //how to tell it that the event we are looking for is in the url? 
    //need to add delete and edit buttons
}
</script>

<style scoped>
  .sectionHead {
    text-transform: capitalize; 
  }

  .section {
      padding: 2em;
      text-align: left;
  }

    .btn-register-2 {
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

  .btn-register-2:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794;
  }
</style>