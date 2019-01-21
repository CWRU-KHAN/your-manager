<template>
    <div class="container-fluid">
        <h2>{{ this.$store.state.currentPageJson.data.eventname }}</h2>
        <router-link v-if="eventOwner" to="/event/changeProfile">Change Event Details</router-link>
        <h4> {{ formattedDate}} </h4>
        <h4>{{ this.$store.state.currentPageJson.data.eventlocation }}</h4>
        <h4>{{ this.$store.state.currentPageJson.data.eventcity }}</h4>
        <h4>{{ this.$store.state.currentPageJson.data.eventstate }}</h4>
        <h4>Bands:</h4>
        <ul>
            <li v-for="band in bandsPlaying" :key="band.bandname"> {{ band.bandname }} </li>
        </ul>
        <h4 v-if="eventDescription"> {{ eventDescription }} </h4>

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

                    <router-link to="note/create">Add A New Note</router-link>

        <router-link to='/calendar'>Go to calendar</router-link>
        <router-link to='event/create'>Create new event</router-link>
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
                eventdate: this.$store.state.currentPageJson.data.date,
                usersid: this.$store.state.userCredentials.usersid
            }
            this.$store.dispatch('getEventPageNotes', payload)
        }
    }
    //how to tell it that the event we are looking for is in the url? 
    //need to add delete and edit buttons
}
</script>