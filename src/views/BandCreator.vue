<template>
  <div>
    <h1>Create A Band</h1>
    <form >

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>

      <img src="" alt="no image">
      <input type="file" name="file" id="bandImg" ref="file" accept="image/*" v-on:change="processUpload()">
      <button type="button" @click='submitImage()'>Submit Image</button>
      <br><br>
      <input type="text" placeholder="bandname" id='bandName' v-model="bandName">
      <br><br>
      Genre:
        <input type="checkbox" v-model='genres' value="1"> Blues
        <input type="checkbox" v-model='genres' value="2"> Classical
        <input type="checkbox" v-model='genres' value="3"> Jazz
        <input type="checkbox" v-model='genres' value="4"> Reggae
        <input type="checkbox" v-model='genres' value="5"> Country
        <input type="checkbox" v-model='genres' value="6"> Electronic
        <input type="checkbox" v-model='genres' value="7"> Folk
        <input type="checkbox" v-model='genres' value="8"> Rock
        <input type="checkbox" v-model='genres' value="9"> Hip-Hop
      <br><br>

      <button type='button' @click='submit'>Create Band</button>

    </form>
  </div>
</template>


<script>

import { mapGetters } from 'vuex'

export default {
  name: 'bandCreator',
  data() {
    return {
      genres: [],
      bandName: '',
      errors: [],
      file: ''
    }
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    })
  },
  methods: {
    submit() {
      this.errors = []

      if (this.bandName.length < 2) this.errors.push('Bandname must be at least 2 characters.')
      if (!this.errors.length) {
        const bandInfo = {
          bandName: this.bandName,
          genres: this.genres,
          bandimage: this.$store.state.currentUploadedImage,
          usersid: this.$store.state.userCredentials.usersid,
          token: this.$store.state.userCredentials.userToken,
          userName: this.$store.state.userCredentials.username
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('createBand', bandInfo)
      }
    },
    processUpload () {
      this.file = this.$refs.file.files[0]
    },
    submitImage() {
      let formData = new FormData()
      formData.append('file', this.file)
      this.$store.dispatch('uploadImg', formData)
        .then(() => this.bandimage = this.$store.getters.getCurrentUploadedImage)
    }
  }
}
</script>
