<template>
  <div class="container-fluid">
    <h1 class="pge-title">Edit Band Profile</h1>
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
        <label class="frm-input-label" for="bandname"> Bandname
          <input
            class="frm-input"
            type="text"
            id="bandname"
            v-model="bandname">
        </label>
      </div>
      <div class="frm-group">
        <label class="frm-input-label" for="description"> Description
          <textarea
            class="frm-input frm-input-textarea"
            id="description"
            v-model="description" />
        </label>
      </div>
      <div class="frm-group">
                  <input
            v-if="!upload1"
            type="file"
            name="file"
            id="bandImg"
            class="bandImgClass"
            ref="file"
            accept="image/*"
            v-on:change="processUpload()">
        <label class="frm-input-label" for="bandimage">Upload New Profile Image</label>
          <p class="err-handler-text" v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</p>
          <img class="img-band-edit" :src="displayImage" alt="Band Profile">

                <button v-if="upload1" type="button" @click='submitImage()'>Submit Image</button>
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
      bandname: this.$store.state.currentBand.bandname,
      description: this.$store.state.currentBand.description,
      bandimage: this.$store.state.currentBand.bandimage,
      errors: [],
      upload1: false,
      upload2: false
    }
  },
  computed: {
    displayImage() {
      return this.bandimage ? this.bandimage : require('../assets/no-profile-pic.png')
    }
  },
  methods: {
    submit() {
      this.errors = []

      if (this.bandname.length < 2) this.errors.push('Bandname 4 characters or longer required.')

      if (!this.errors.length) {
        const payload = {
          userName: this.$store.state.userCredentials.username,
          usersid: this.$store.state.userCredentials.usersid,
          token: this.$store.state.userCredentials.userToken,
          bandsid: this.$store.state.bandCredentials.bandsid,
          updates: {
            bandname: this.bandname,
            description: this.description,
            bandimage: this.bandimage
          }
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('updateBandInfo', payload)
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
          this.bandimage = this.$store.getters.getCurrentUploadedImage
          this.upload1 = false
          this.upload2 = true
      })
    }
  }
}
</script>

<style>

  /* making this scoped breaks it */

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
