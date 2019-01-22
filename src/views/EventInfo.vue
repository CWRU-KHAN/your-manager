<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-9">
                <h1 class="pge-title">
                    {{ this.$store.state.currentPageJson.data.eventname }}
                </h1>
            </div>
            <div class="col-3">
                <router-link tag="button" class="but but-top-right but-blue" v-if="eventOwner" to="/event/changeProfile">Change Event Details</router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-5 col-md-12">
                <img class="img-event-display" :src="displayImage">
            </div>
            <div class="col-lg-7 col-md-12">
                <h4 class="txt-event-info">
                    <span class="txt-event-info-label">Date:</span>
                    {{ formattedDate}}
                </h4>
                <h4 v-if="eventDescription" class="txt-event-info">
                    <span class="txt-event-info-label">Description:</span>
                    {{ this.$store.state.currentPageJson.data.eventdescription }}
                </h4>
                <h4 class="txt-event-info">
                    <span class="txt-event-info-label">Venue:</span>
                    {{ this.$store.state.currentPageJson.data.eventlocation }}
                </h4>
                <h4 class="txt-event-info">
                    <span class="txt-event-info-label">City:</span>
                    {{ this.$store.state.currentPageJson.data.eventcity }}
                </h4>
                <h4 class="txt-event-info">
                    <span class="txt-event-info-label">State:</span>
                    {{ this.$store.state.currentPageJson.data.eventstate }}
                </h4>
            </div>
        </div>
        <hr><br>

        <!-- maybe band cards? -->
        <h4 class="txt-event-info-label">Bands:</h4>
            <div
                class="event-band-internal"
                v-for="band in bandsPlaying"
                :key="band.bandname"> {{ band.bandname }}
            </div>
        
        <br><hr><br>
        <div class="row">
            <div class="col-12">
        <h4 class="txt-event-info-label">See Notes For:
            <select                     
                type="text"
                class="frm-input"
                id="event-bands"
                v-model="noteBandId"
                placeholder=""
                @change="getNotes">
                    <option class="frm-input" v-for="band in relevantBands" :key="band.id" :value="band.id">{{ band.bandname }}</option>               
            </select></h4>
                <h4 v-if="relevantNotes.length">Unread Notes</h4>
                <note-card v-for="note in relevantNotes" :noteInfo="note" :key="note.id"
                :refresherId="note.id"
                :refresherMethod="'toggleEventInfoNote'"
                ></note-card>
                <h4 v-if="relevantReadNotes.length">Read Notes</h4>
                <note-card v-for="note in relevantReadNotes" :noteInfo="note" :key="note.id"></note-card>
            </div>
        </div><br><hr><br>
        <div class="row">
            <!-- <router-link tag="button" to='/calendar'>Go to calendar</router-link> -->
            <div class="col-lg-6 col-md-12">
                <router-link tag="button" class="but but-block but-blue" to="note/create">Add A New Note</router-link>
            </div>
            <div class="col-lg-6 col-md-12">
                <router-link tag="button" class="but but-block but-yellow" to='event/create'>Create new event</router-link>
            </div>
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
            noteBandId: '',
            eventimage: this.$store.state.currentEvent.eventimage,
        }
    },
    computed: {
        displayImage() {
            return this.eventimage ? this.eventimage : require('../assets/no-profile-pic.png')
        },
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
                this.$store.state.currentEventPageNotes.data
                .map(note => {
                    note.author = note.username
                    return note
                })
                .filter(note => !note.read) : 
                false
        },
        relevantReadNotes() {
            return this.$store.state.currentEventPageNotes.data ? 
                this.$store.state.currentEventPageNotes.data
                .map(note => {
                    note.author = note.username
                    return note
                })
                .filter(note => note.read) : 
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

<style>

    .but-top-right {
        display: block;
        width: 100%;
        height: auto;
        margin: 4em 0em;
    }

    .img-event-display {
        width: 100%;
        height: auto;
        border: 2px solid #979797;
        border-radius: 5px;
        margin-bottom: 1em
    }

    .txt-event-info {
        font-family: 'Open Sans', 'sans serif';
        font-size: 1.25em;
        line-height: 2em;
        padding: .5em 0em
    }

    .txt-event-info-label {
        font-weight: 600;
        text-transform: uppercase;
        margin-right: 1em;
        color: #677794
    }

    .event-band-internal {
        font-size: 1.5em;
        text-transform: uppercase;
        font-family: 'Montserrat', 'sans serif';
        font-weight: 600;
        padding: 1.5em 0em;
        border: solid .1px #677794;
        text-align: center;
        width: 100%
    }

    /* .event-band-internal:hover {
        color: #ededed;
        background: #373737
    } */

</style>