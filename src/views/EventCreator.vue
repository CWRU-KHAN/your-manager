<template>
    <div class="container-fluid">
        <h1 class="pge-title">Create an Event</h1>
        <form>
            <!-- event photo upload -->
            <div class="frm-group">
                <label class="frm-input-label">Event Photo
                    <img
                        class="eventPic"
                        v-if="displayImage"
                        :src="displayImage"
                        alt="Event">
                    <input 
                        v-if="!upload1"
                        class="form-control"
                        type="file"
                        name="file"
                        id="eventImg"
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
                        class="frm-input"
                        type="text"
                        id="event-name"
                        v-model="eventName"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-date">Date
                    <input
                        class="frm-input"
                        type="date"
                        id="event-date"
                        v-model="date"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-description">Description
                    <textarea
                        class="frm-input frm-input-textarea"
                        id="event-description"
                        v-model="description"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-location">Venue Name
                    <input
                        class="frm-input"
                        type="text"
                        id="event-location"
                        v-model="eventlocation"
                        placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-city">City
                    <input
                    class="frm-input"
                    type="text"
                    id="event-city"
                    v-model="eventcity"
                    placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-state">State
                    <input
                    class="frm-input"
                    type="text"
                    id="event-state"
                    v-model="eventstate"
                    placeholder="" />
                </label>
            </div>
            <div class="frm-group">
                <label class="frm-input-label" for="event-bands">Your Band
                    <select
                        class="frm-input"
                        type="text"
                        id="event-bands"
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
        </form>
        <div>
            <button
                class="but but-block" 
                type='button'
                @click='submit'>
                    <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                        Create Event
            </button>
        </div>
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
      const data = this.$store.state.currentPageJson.data
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

    .pge-title {
        font-family: 'Montserrat', 'sans serif';
        text-transform: uppercase;
        font-size: 2em;
        font-weight: 600;
        letter-spacing: .1em;
        margin: 2em 0em 1.5em 0em;
    }

    .frm-group {
        margin: 1.5em 0em;
    }

    .frm-input {
        display: block;
        width: 100%;
        padding: 1em 1em;
        font-size: 1em;
        color: #373737;
        background-color: #ffffff
    }

    .frm-input-textarea {
        min-height: 100px;
        resize: vertical
    }

    .frm-input-label {
        display: block;
        font-family: 'Open Sans', 'sans serif';
        text-transform: uppercase;
        font-size: .8em;
        font-weight: 500;
    }

    .but {
        font-family: 'Open Sans';
        text-transform: uppercase;
        font-size: .75em;
        letter-spacing: .1em;
        padding: 1em
    }

    .but-block {
        display: block;
        width: 100%
    }

    .eventPic {
        width: 100%;
        height: auto;
        border: 2px solid #979797;
        border-radius: 5px;
    }

</style>
