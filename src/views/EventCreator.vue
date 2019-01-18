<template>
  <div>
    <h1>Create an Event</h1>
    <form >

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>

      <img src="" alt="no image">
      <input type="file" name="file" id="eventImg" ref="file" accept="image/*" v-on:change="processUpload()">
      <button type="button" @click='submitImage()'>Submit Image</button>
      <br><br>
      <br><br> 
      Name of event: <input type="text" placeholder="name of event" v-model="eventName">
      <br>
      What: <input type="text" placeholder="event description" v-model="description">
      <br>
      Venue Name: <input type="text" placeholder="location" v-model="eventlocation">
      <br>
      City: <input type="text" placeholder="city" v-model="eventcity">
      <br>
      State: <input type="text" placeholder="state" v-model="eventstate">
      <br>
      When: <input type="datetime-local" v-model="date">
      <br>
      Band: <select name="bands" v-model="bandName">
                <option v-for="band in bandsList" :key="band.id">{{ band.name }}</option>
            </select>
    
      <br><br>

      <button type='button' @click='submit'>Create Event</button>

    </form>
  </div>
</template>


<script>

import { mapGetters } from 'vuex'

export default {
  name: 'eventCreator',
  data() {
    return {
      eventName: '',
      bandName: '',
      description: '',
      eventlocation: '',
      eventcity: '',
      eventstate: '',
      date: '',
      time: '12:00',
      errors: [],
      file: '',
    }
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    }),
    bandsList() {
      return this.$store.state.currentPageJson.data[2]
    }
  },
  methods: {
    submit() {
      this.errors = []

        if (!this.eventName.length) this.errors.push('Event must have a name.')
        if (!this.eventlocation.length) this.errors.push('Event must have a location')
        if (!this.date.length) this.errors.push('Event must have a date')
        if (!this.bandName.length) this.errors.push('Please select one of your bands')


      if (!this.errors.length) {
        const eventInfo = {
            eventName: this.eventName,
            createdAt: new Date,
            eventLocation: this.eventlocation,
            eventimage: this.$store.state.currentUploadedImage,
            bandName: this.bandName,
            eventdescription: this.description,
            date: this.date,
            time: this.time,
            usersid: this.$store.state.userCredentials.usersid,
            token: this.$store.state.userCredentials.userToken,
            userName: this.$store.state.userCredentials.username
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('createEvent', eventInfo)
      }
    },
     processUpload () {
      this.file = this.$refs.file.files[0]
    },
    submitImage() {
      let formData = new FormData()
      formData.append('file', this.file)
      this.$store.dispatch('uploadImg', formData)
    }
  }
}
</script>
