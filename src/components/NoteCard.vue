<template>
  <div class='bordered'>
    <h4> {{ noteInfo.notetitle }} </h4>
    <p> By {{ noteInfo.author }} </p>
<!-- This is the date on the calendar that the note is attached to.
      There must be a better way to organize this.-->
    <p> Regarding {{ calendarDate }} </p> 

    <p> Posted on {{ postedDate }} at {{ postedTime }} </p>
    <!-- body of the note is also available with {{ noteInfo.notebody }} -->
    <!-- note can be navigated to with noteInfo.id, but we don't currently have a page for that -->
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: [
    'noteInfo'
  ],
  computed: {
    calendarDate() {
      return moment(this.noteInfo.calendardate).format('MMMM Do YYYY')
    },
    postedDate() {
      return moment(this.noteInfo.postedat).format('MMMM Do YYYY')
    },
    postedTime() {
      return moment(this.noteInfo.postedat).format('h:mm a')

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
