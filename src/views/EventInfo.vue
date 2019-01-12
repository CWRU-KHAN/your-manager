<template>
    <div>
        <h2>{{ this.$store.state.currentPageJson.data.eventname }}</h2>
        <h4> {{ formattedDate}} </h4>
        <h4>{{ this.$store.state.currentPageJson.data.eventlocation }}</h4>
        <h4 v-if="eventDescription"> {{ eventDescription }} </h4>


        <router-link to='/calendar'>Go to calendar</router-link>
        <router-link to='event/create'>Create new event</router-link>
    </div>
</template>

<script>
import moment from "moment"
export default {
    name: "eventInfo",
    computed: {
        eventDescription () {
            return this.$store.state.currentPageJson.data.eventdescription
        },
        formattedDate () {
            const day = moment(this.$store.state.currentPageJson.data.date)
            return day.format('MMMM Do YYYY, h:mm a')
        }
    }
    //how to tell it that the event we are looking for is in the url? 
    //need to add delete and edit buttons
}
</script>