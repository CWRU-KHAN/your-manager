<template>
  <div class='bordered'>
    <div class="row">
      <div class="col-7">
        <h4> {{ noteInfo.notetitle }} </h4>
      </div>
      <div class="col-5">
        <p class="postedAt">{{ postedDate }} | {{ postedTime }}</p>
      </div>
    </div>
    <br>
    <h6>{{noteInfo.notebody}}</h6>
<!-- This is the date on the calendar that the note is attached to.
      There must be a better way to organize this.-->
    <p class="from"> - {{ noteInfo.author }} </p>
    <br>
    <div class="row">
    <div class="col-7">
      <p> Regarding {{ calendarDate }} </p> 
    </div>
    <div class="col-5">
            <button type="button" class="btn-note-read" @click="markAsRead" v-if="!noteInfo.read">Mark As Read</button>

    </div>
    </div>
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
      return moment(this.noteInfo.postedat).format('l')
    },
    postedTime() {
      return moment(this.noteInfo.postedat).format('LT')
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
        .then(() => this.$store.commit(this.refresherMethod, {notesid: this.refresherId, bandsid: this.refresherBandsId}))
    }
  },
}
</script>

<style scoped>
  .btn-note-read {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: .5em 2em .5em 2em;
    margin: 0em .5em;
    border-radius: .4em;
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    transition-property: background-color, color;
    transition: 400ms;
  }

  .btn-note-read:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794;
  }

  .postedAt {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    text-align: right;
  }

  .from {
    text-align: center;
    text-transform: capitalize;
  }

</style>


