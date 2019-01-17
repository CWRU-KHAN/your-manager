<template>
  <div>
    <h3>Band Information</h3>

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>

    <form>


      <label for="bandname"> Bandname
        <input type="text" id="bandname" v-model="bandname">
      </label>

      <label for="description"> Description
        <textarea type="text" id="description" v-model="description" />
      </label>


      <label for="bandimage"> Profile Image
        <h3 v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</h3>
        <img :src="displayImage" alt="Band Profile">
        <input v-if="!upload1" type="file" name="file" id="bandImg" ref="file" accept="image/*" v-on:change="processUpload()">
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
