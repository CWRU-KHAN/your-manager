<template>
    <div>
        <h2>{{ this.$store.state.currentEvent.eventName }}</h2>
        <h4>{{ this.$store.state.currentEvent.date }}</h4>
        <h4>{{ this.$store.state.currentEvent.location }}</h4>

        <router-link to='/calendar'>Go to calendar</router-link>
        <router-link to='event/create'>Create new event</router-link>
    </div>
</template>

<script>
export default {
    
    //how to tell it that the event we are looking for is in the url? 
    //need to add delete and edit buttons
}
</script>