<template>
  <tr>
      <td>{{ eventInfo.eventname }}</td>
      <td>{{ formattedDate }}</td>
      <td>{{ eventInfo.eventlocation }}</td>
      <td><button type="button" @click="viewEvent">View Details</button></td>
  </tr>
  
</template>

<script>
import moment from 'moment'
export default {
  computed: {
    formattedDate() {
      return moment(this.eventInfo.date).format('MMMM Do YYYY')
    },
    formattedTime() {
      return moment(this.eventInfo.date).format('h:mm a')
    }
  },
  props: [
    'eventInfo'
  ],
  methods: {
    viewEvent() {
      this.$store.commit('setEvent', this.eventInfo.id)
      this.$router.push('event/info')
    }
  }
}
</script>

<style scoped>

p.event-name {
  font-family: 'Open Sans', sans-serif;
  font-size: 1em
}

</style>
