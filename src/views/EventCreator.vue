<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 col-md-0">
                <p>hey karol put something fun here</p>
            </div>
            <div class="col-lg-8 col-md-12">
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
                        <input v-if="!upload1" id="eventImg" class="frm-input bandImgClass" type="file" name="file" ref="file"
                            accept="image/*" v-on:change="processUpload()">
                        <label class="frm-input-label">Upload Event Photo</label>
                        <img v-if="displayImage" class="img-event-create" :src="displayImage" alt="Event">

                        <button v-if="upload1 && !upload2" type="button" @click='submitImage()'>Submit Image
                        </button>
                    </div>
                    <div class="frm-group">
                        <label class="frm-input-label" for="event-name">Name of Event
                            <input id="event-name" class="frm-input" type="text" v-model="eventName" placeholder="" />
                        </label>
                    </div>
                    <div class="frm-group">
                        <label class="frm-input-label" for="event-date">Date
                            <input id="event-date" class="frm-input" type="date" v-model="date" placeholder="" />
                        </label>
                    </div>
                    <div class="frm-group">
                        <label class="frm-input-label" for="event-description">Description
                            <textarea id="event-description" class="frm-input frm-input-textarea" v-model="description"
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
                    <select id="event-state"
                    class="frm-input"
                    type="text"
                    v-model="eventstate"
                    placeholder="" >
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </select>
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
    //a phantom change
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

      .bandImgClass {
  width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}

.bandImgClass + label {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    border-radius: .4em;
    display: inline-block;
    padding: .5em;
}



.bandImgClass:focus + label,
.bandImgClass + label:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #373737}

.bandImgClass + label {
	cursor: pointer;
}

</style>
