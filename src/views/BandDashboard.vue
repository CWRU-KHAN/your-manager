<template>
  <div>
    <h1>Dashboard</h1>
    <h2> {{ `Welcome ${this.$store.state.currentPageJson.data.bandname}` }} </h2>
    <div>
      <router-link to='/calendar'>View Calendar</router-link>
    </div>
    <br>
    <h4>Members</h4>
        <ul>
          <li v-for="user in usersList" :key="user.id"> {{ user.username }} </li>
        </ul>
    <br>
    <h4>Events</h4>
        <div>
            <p v-if="!eventsList">Your band does not have any upcoming events.</p>
            <ul v-if="eventsList">
            <li v-for="event in eventsList" :key="Object.keys(event)[0]"> {{ event[Object.keys(event)[0]][0].eventname }} </li>
                    <button type="button" @click="gotoEvent(6)">go to event</button> -->
                    <!-- how to pass an event's id as a prop if not through Object.keys(event)[0][0].id?  -->
            </ul>
      </div>
    <br>
    <!-- <h4>Notes</h4>
    <div>
      <div v-if="hasBands">
        <p v-if="!notesList">None of your bands have upcoming notes.</p>
        <ul v-if="notesList">
          <li v-for="note in notesList" :key="Object.keys(note)[0]"> {{ note[Object.keys(note)[0]] ? note[Object.keys(note)[0]][0].notetitle : 'Untitled note.' }} </li>
        </ul>
      </div>
    </div> -->

    <router-link to="event/create">go to event create</router-link>
    <br>
    <router-link to="event/info">go to event info</router-link>
  </div>
</template>
<script>

export default {
  name: 'bandDashboard',
  computed: {
    usersList() {
      return this.$store.state.currentPageJson.data.users 
    },
    // membersList() {
    //     return this.$store.state.bandMembers.length ?
    //     this.$store.state.bandMembers :
    //     console.log("band has no members")
    //     false
    // },
    eventsList() {
      return this.$store.state.bandDashboardEvents.length ? 
        this.$store.state.bandDashboardEvents : 
        console.log("events has no length")
        false
    },
    notesList() {
      return this.$store.state.bandDashboardNotes.length ? 
        this.$store.state.bandDashboardNotes : 
        false
    }
  },
  methods: {
    goToBand(id) {
      console.log(id)
    },
    gotoEvent(id) {
      console.log("id: " + id)
      this.$store.commit("setEvent", {eventsid: id})
      this.$router.push({"path" : "/event/info"})
    }
  }
}
</script>
