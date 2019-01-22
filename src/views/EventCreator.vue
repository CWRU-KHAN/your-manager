<template>
    <div class="container-fluid">
        <h1 class="pge-title">Create an Event</h1>
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
            <!-- event photo upload -->
            <div class="frm-group">
                <label class="frm-input-label">Event Photo
                    <img
                        v-if="displayImage"
                        class="img-event-create"
                        :src="displayImage"
                        alt="Event">
                    <input 
                        v-if="!upload1"
                        id="eventImg"
                        class="frm-input"
                        type="file"
                        name="file"
                        ref="file"
                        accept="image/*"
                        v-on:change="processUpload()">
                    <button
                        v-if="upload1 && !upload2"
                        type="button"
                        @click='submitImage()'>Submit Image
                    </button>
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-name">Name of Event
                    <input
                        id="event-name"
                        class="frm-input"
                        type="text"
                        v-model="eventName"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-date">Date
                    <input
                        id="event-date"
                        class="frm-input"
                        type="date"
                        v-model="date"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-description">Description
                    <textarea
                        id="event-description"
                        class="frm-input frm-input-textarea"
                        v-model="description"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-location">Venue Name
                    <input
                        id="event-location"
                        class="frm-input"
                        type="text"
                        v-model="eventlocation"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-city">City
                    <input
                    id="event-city"
                    class="frm-input"
                    type="text"
                    v-model="eventcity"
                    placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-state">State
                    <input
                    id="event-state"
                    class="frm-input"
                    type="text"
                    v-model="eventstate"
                    placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-bands">Your Band
                    <select
                        id="event-bands"
                        class="frm-input"
                        type="text"
                        v-model="bandsid"
                        placeholder="">
                            <option
                                v-for="band in bandsList" 
                                :key="band.id"
                                :value="band.id">
                                    {{ band.bandname }}
                            </option>
                    </select>
                </label>
            </div>
        <div>
            <button
                class="but but-block but-yellow" 
                type='button'
                @click='submit'>
                    <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                        Create Event
            </button>
        </div>
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
      bandsid: '',
      description: '',
      eventlocation: '',
      eventcity: '',
      eventstate: '',
      date: '',
      time: '12:00',
      errors: [],
      file: '',
      upload1: false,
      upload2: false,
      eventimage: ''
    }
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    }),
    bandsList() {
      const data = this.$store.state.currentUser
      return data.bandname ? 
        [{
          bandname: data.bandname,
          id: this.$store.state.bandCredentials.bandsid
        }] :
        data[0].bands
    },
    displayImage() {
      return this.eventimage ? this.eventimage : false
    }
  },
  methods: {
    submit() {
      this.errors = []

        if (!this.eventName.length) this.errors.push('Event must have a name.')
        if (!this.eventlocation.length) this.errors.push('Event must have a location')
        if (!this.date.length) this.errors.push('Event must have a date')
        if (!this.bandsid) this.errors.push('Please select one of your bands')


      if (!this.errors.length) {
        const eventInfo = {
            eventName: this.eventName,
            createdAt: new Date,
            eventLocation: this.eventlocation,
            eventcity: this.eventcity,
            eventstate: this.eventstate,
            eventimage: this.$store.state.currentUploadedImage,
            bandsid: this.bandsid,
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
      this.upload1 = true
    },
    submitImage() {
      let formData = new FormData()
      formData.append('file', this.file)
      this.$store.dispatch('uploadImg', formData)
        .then(() => {
          this.eventimage = this.$store.getters.getCurrentUploadedImage
          this.upload2 = true
        })
    }
  }
}
</script>

<style>

    /* can't change to scoped because it breaks on chrome when you do  */
    
    .img-event-create {
        width: 100%;
        height: auto;
        border: 2px solid #979797;
        border-radius: 5px;
    }

</style>
