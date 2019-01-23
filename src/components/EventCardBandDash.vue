<template>
  <tr class="tableRow">
      <td>{{ eventInfo.eventname }}</td>
      <td>{{ formattedDate }}</td>
      <td><button type="button" @click="viewEvent" class="editButton">View Details</button></td>
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
      this.$router.push('/event/info')
    }
  }
}
</script>

<style scoped>

p.event-name {
  font-family: 'Open Sans', sans-serif;
  font-size: 1em
}

  .editButton {
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

  .editButton :hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794;
  }


</style>