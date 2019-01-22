<template>
  <div class="container-fluid">
    <h1 class="pge-title">Edit Event Information</h1>
    <div class="err-handler">
        <p class="err-handler-text" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
                <li v-for="error in serverErrors" :key="error">{{ error }}</li>
            </ul>
        </p>
    </div>
    <form>
        <div class="frm-group">
            <label class="frm-input-label" for="eventname"> Eventname
                <input
                    class="frm-input"
                    type="text"
                    id="eventname"
                    v-model="eventname">
            </label>
        </div>
        <!-- date is not populating -->
        <div class="frm-group">
            <label class="frm-input-label" for="eventDate"> Date
                <input
                    class="frm-input"
                    type="date"
                    id="eventDate"
                    v-model="date">
            </label>
        </div>
        <!-- This needs to be updated to be Venue Name, City, State -->
        <!-- <div class="frm-group">
            <label class="frm-input-label" for="eventlocation"> Event Location
                <input class="frm-label" type="text" id="eventlocation" v-model="eventlocation">
            </label>
        </div> -->
        <div class="frm-group">
            <label class="frm-input-label" for="eventdescription"> Event Description
                <textarea
                    class="frm-input frm-input-textarea"
                    type="text"
                    id="eventdescription"
                    v-model="eventdescription" />
            </label>
        </div>
        <div class="frm-group">
            <label class="frm-input-label" for="eventimage"> Profile Image
                <p class="err-handler-text" v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</p>
                <img class="img-event-edit" :src="displayImage" alt="Event Profile">
                <input
                    v-if="!upload1"
                    class="frm-input"
                    type="file"
                    name="file"
                    id="eventImg"
                    ref="file"
                    accept="image/*"
                    v-on:change="processUpload()">
                <button v-if="upload1" type="button" @click='submitImage()'>Submit Image</button>
            </label>
        </div>
        <div>
          <button class="but but-block but-blue" type="button" @click="submit">Save Changes</button>
        </div>
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
  /* label {
    display: block;
  } */

    .img-event-edit {
    width: 100%;
    height: auto;
    border: 2px solid #979797;
    border-radius: 5px;
    }

</style>
