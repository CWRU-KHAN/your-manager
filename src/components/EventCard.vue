<template>
  <div class="bordered">
    

    <img src="https://via.placeholder.com/225x125.png" alt="placeholder">
    <p> {{ eventInfo.eventname }} </p>
    <p> {{ formattedDate }} </p>
    <p> {{ formattedTime }} </p>
    <p> {{ eventInfo.eventlocation }} </p>
    <button type="button" @click="viewEvent">View Event Details</button>
  </div>
  
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
</style>
