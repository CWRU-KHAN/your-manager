<template>
  <div>
  <div class="container mx-auto">
    <form >
        <div class="form-box-register">
          <div class="row">
            <div class="col">
              <h1>Create an Event</h1>
            </div>
          </div>
          
          <div class="row">
            <div class="col">
              <img src="" alt="no image"><br>
              <input class="form-control" type="file" name="file" id="eventImg" ref="file" accept="image/*" v-on:change="processUpload()">
              <button type="button" @click='submitImage()'>Submit Image</button>
            </div>
          </div>
          
          <div class="row">
            <div class="col mt-4">
              <label for="event-name">Name of Event
                <input 
                    class="form-control"
                    type="text"
                    id="event-name"
                    v-model="eventName"
                    placeholder=""
                  />
                </label>
  
              <label for="event-date">Date
                <input 
                    class="form-control"
                    type="datetime-local"
                    id="event-date"
                    v-model="date"
                    placeholder=""
                  />
                </label> <br>
            
              <label for="event-description">Description
                <input 
                    class="form-control"
                    type="textarea"
                    id="event-description"
                    v-model="description"
                    placeholder=""
                  />
                </label> <br>
            </div>
          </div>
  
          <div class="row">
            <div class="col mt-4">
              <h1>Venue Information</h1>

              <label for="event-location">Venue Name
                <input 
                    class="form-control"
                    type="text"
                    id="event-location"
                    v-model="eventlocation"
                    placeholder=""
                  />
                </label>

              <label for="event-city">City
                <input 
                    class="form-control"
                    type="text"
                    id="event-city"
                    v-model="eventcity"
                    placeholder=""
                  />
                </label>

              <label for="event-state">State
                <input 
                    class="form-control"
                    type="text"
                    id="event-state"
                    v-model="eventstate"
                    placeholder=""
                  />
                </label>
            </div>
          </div>
  
    
          <div class="row">
            <div class="col mt-4">
              <h1>Band Information</h1>
            </div>
          </div>

          <div class="row">
            <div class="col mt-4">
              <label for="event-bands">Your Band
                <select 
                    class="form-control"
                    type="text"
                    id="event-bands"
                    v-model="bandsid"
                    placeholder=""
                  >
                    <option v-for="band in bandsList" :key="band.id" :value="band.id">{{ band.bandname }}</option>                    
                  </select>
                </label>
            </div>
          </div>
      
          <div class="row">
            <div class="col mt-4">
              <button class="btn btn-event-create-2" type='button' @click='submit'>
                  <i class="fa fa-plus btn-icon" aria-hidden="true"></i>
                    Create Event
              </button>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>
            </div>
          </div>

        </div>
    </form>
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
    }
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    }),
    bandsList() {
      return this.$store.state.currentPageJson.data[0].bands ? 
        this.$store.state.currentPageJson.data[0].bands :
        false
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
    },
    submitImage() {
      let formData = new FormData()
      formData.append('file', this.file)
      this.$store.dispatch('uploadImg', formData)
    }
  }
}
</script>

<style>

  label {
    font-family: 'Open Sans', 'sans-serif';
    font-size: 1em;
    letter-spacing: .2em;
    text-transform: uppercase
  }

  .btn-event-create-2 {
    font-size: 1em;
    padding: .5em 3em .5em 3em;
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed
  }

  .btn-event-create-2:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794
  }

</style>
