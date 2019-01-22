<template>
  <div class="container-fluid">
    <div class="container mx-auto">
    <div class="form-box-register">
      <div class="row">
        <div class="col">
            <h1>Create A Band</h1>
        </div>
      </div>
    <form>

    <div class="row">
      <div class="col mt-4">
        <label for="bandImg"> Band Image <br><hr>
        <img src="" alt="no image">
         <input
         type="file"
         name="file"
         id="bandImg"
         ref="file"
         accept="image/*" 
         v-on:change="processUpload()">
        </label>
         <br>
        <button
          class="btn btn-login"
          type="button"
          @click='submitImage()'>
            Submit Image
        </button>
      </div>
    </div><br>

    <div class="row">
      <div class="col mt-4">
        <label for="bandName"> Band Name:<hr>
        <input
          class="form-control"
          type="text"
          placeholder=""
          id='bandName'
          v-model="bandName">
      </label>
      </div>
    </div>
      
    <div class="row">
      <div class="col mt-4">
        <h3 class="force-label">Genre:</h3><br><hr>
        <input class="form-check-input" id="blues" type="checkbox" v-model='genres' value="1">
        <label class="form-check-label" for="blues"> Blues </label><br>

        <input class="form-check-input" id="classical" type="checkbox" v-model='genres' value="2">
        <label class="form-check-label" for="classical"> Classical </label><br>

        <input class="form-check-input" id="jazz" type="checkbox" v-model='genres' value="3">
        <label class="form-check-label" for="jazz"> Jazz </label><br>

        <input class="form-check-input" id="reggae" type="checkbox" v-model='genres' value="4">
        <label class="form-check-label" for="reggae"> Reggae </label><br>

        <input class="form-check-input" id="country" type="checkbox" v-model='genres' value="5">
        <label class="form-check-label" for="country"> Country </label><br>

        <input class="form-check-input" id="electronic" type="checkbox" v-model='genres' value="6">
        <label class="form-check-label" for="electronic"> Electronic </label><br>

        <input class="form-check-input" id="folk" type="checkbox" v-model='genres' value="7">
        <label class="form-check-label" for="folk"> Folk </label><br>

        <input class="form-check-input" id="rock" type="checkbox" v-model='genres' value="8">
        <label class="form-check-label" for="rock"> Rock </label><br>

        <input class="form-check-input" id="hip-hop" type="checkbox" v-model='genres' value="9">
        <label class="form-check-label" for="hip-hop"> Hip-Hop </label><br>
      </div>
    </div>

    <div class="row">
      <div class="col mt-4">
        <button
          class="btn btn-register-2"
          type='button'
          @click='submit'>
            Create Band
        </button>
      </div>
    </div>
    </form>
  </div>
  </div>
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
    }
  }
}
</script>

<style scoped>

/* .force-label {
  font-family: 'Open Sans', 'sans-serif';
  font-size: 1em;
  letter-spacing: .2em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: .5rem;
} */

</style>
