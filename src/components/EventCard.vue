<template>
    
<!-- <div class="form-box">
          <div class="row">
            <div class="col">
    <img src="https://via.placeholder.com/225x125.png" alt="placeholder">
    <p class="event-name"> {{ eventInfo.eventname }} </p>
    <p> {{ formattedDate }} </p>
    <p> {{ formattedTime }} </p>
    <p> {{ eventInfo.eventlocation }} </p>
    <p> {{ eventInfo.eventcity }} </p>
    <p> {{ eventInfo.eventstate }} </p>
    <button type="button" @click="viewEvent">View Event Details</button>
            </div>
            </div>
            </div> -->
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
.bordered {
  border: 2px solid black;
  margin: 10px;
  padding: 10px;
}

p.event-name {
  font-family: 'Open Sans', sans-serif;
  font-size: 1em
}

</style>
