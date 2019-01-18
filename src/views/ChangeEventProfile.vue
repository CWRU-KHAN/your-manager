<template>
  <div>
    <h3>Event Information</h3>

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>

    <form>


      <label for="eventname"> Eventname
        <input type="text" id="eventname" v-model="eventname">
      </label>

      <label for="date"> Date
        <input type="datetime-local" v-model="date">
      </label>
      
      <label for="eventlocation"> Event Location
        <input type="text" id="eventlocation" v-model="eventlocation">
      </label>

      <label for="eventdescription"> Event Description
        <textarea type="text" id="eventdescription" v-model="eventdescription" />
      </label>




      <label for="eventimage"> Profile Image
        <h3 v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</h3>
        <img :src="displayImage" alt="Event Profile">
        <input v-if="!upload1" type="file" name="file" id="eventImg" ref="file" accept="image/*" v-on:change="processUpload()">
        <button v-if="upload1" type="button" @click='submitImage()'>Submit Image</button>
      </label>

      <button type="button" @click="submit">Save Changes</button>
    </form>
  </div>
</template>


<script>

export default {
  data() {
    return {
      eventname: this.$store.state.currentEvent.eventname,
      eventdescription: this.$store.state.currentEvent.eventdescription,
      eventimage: this.$store.state.currentEvent.eventimage,
      date: this.$store.state.currentEvent.date.slice(0, 23),
      eventlocation: this.$store.state.currentEvent.eventlocation,
      errors: [],
      upload1: false,
      upload2: false
    }
  },
  computed: {
    displayImage() {
      return this.eventimage ? this.eventimage : require('../assets/no-profile-pic.png')
    },
  },
  methods: {
    submit() {
      this.errors = []

      if (!this.errors.length) {
        const payload = {
          userName: this.$store.state.userCredentials.username,
          usersid: this.$store.state.userCredentials.usersid,
          token: this.$store.state.userCredentials.userToken,
          eventsid: this.$store.state.eventsid,
          updates: {
            eventname: this.eventname,
            eventdescription: this.eventdescription,
            eventimage: this.eventimage,
            date: this.date,
            eventlocation: this.eventlocation
          }
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('updateEventInfo', payload)
      }
    },
    processUpload () {
      this.file = this.$refs.file.files[0]
      this.upload1 = true
    },
    submitImage() {
      let formData = new FormData()
      formData.append('file', this.file)
      this.$store.dispatch('uploadImg', formData)
        .then(() => {
          this.eventimage = this.$store.getters.getCurrentUploadedImage
          this.upload1 = false
          this.upload2 = true
      })
    }
  }
}
</script>


<style scoped>
  label {
    display: block;
  }
</style>
