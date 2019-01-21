<template>
  <div class='bordered'>
    <h2> {{ noteInfo.notetitle }} </h2>
    <button type="button" @click="markAsRead">Mark As Read</button>
    <h4>{{noteInfo.notebody}}</h4>
<!-- This is the date on the calendar that the note is attached to.
      There must be a better way to organize this.-->
    <p> By {{ noteInfo.author }} </p>
    <p> Regarding {{ calendarDate }} </p> 

    <p> Posted on {{ postedDate }} at {{ postedTime }} </p>
    <hr>
    <!-- body of the note is also available with {{ noteInfo.notebody }} -->
    <!-- note can be navigated to with noteInfo.id, but we don't currently have a page for that -->
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: [
    'noteInfo',
    'refresherId',
    'refresherBandsId',
    'refresherMethod'
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
    },
    readClass() {
      return this.noteInfo.read ? 'readNote' : 'unreadNote'
    }
  },
  methods: {
    markAsRead() {
      const payload = {
        token: this.$store.state.userCredentials.userToken,
        userName: this.$store.state.userCredentials.username,
        usersid: this.$store.state.userCredentials.usersid,
        notesid: this.noteInfo.id
      }
      this.$store.dispatch('markNoteAsRead', payload)
        .then(result => this.$store.commit(this.refresherMethod, {notesid: this.refresherId, bandsid: this.refresherBandsId}))
    }
  },
}
</script>


